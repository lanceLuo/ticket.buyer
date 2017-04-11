# -*- coding: utf-8 -*-

import os
import sys
import hashlib
from lib.protocol.Http4Pycurl import Http4Pycurl
from parsert.TicketInfoParser import TicketInfoParser
from parsert.ConfirmOrderParser import ConfirmOrderParser
from parsert.LoginResultParser import LoginResultParser
from parsert.SubmitTicketErrorParser import SubmitTicketErrorParser
import cookielib
import json
import re


class YongleBuyer:

    instances_dict = {}

    def __init__(self, **kwargs):
        self.login_url = 'http://www.228.com.cn/auth/login'
        self.user_info_url = 'http://www.228.com.cn/ajax/getUserInfoFact'
        self.confirm_url = 'http://www.228.com.cn/cart/toOrderSure.html?pid={}&sd={}&quickBuyType=-1'
        self.check_login_url = 'http://www.228.com.cn/ajax/isLogin'
        self.is_login = False
        self.login_name = str(kwargs['login_name'])
        self.password = str(kwargs['password'])
        self.card_type = '10'
        self.card_no = kwargs.get('card_no', None)  # 身份证号码
        self.card_name = kwargs.get('card_name', None)  # 身份证姓名
        self.self_name = kwargs.get('self_name', None)
        self.self_phone = kwargs.get('self_phone', None)
        self.cookie = self.get_cookie_file_path()
        self.user_info = None
        if not isinstance(self.card_name, unicode):
            self.card_name = self.card_name.decode('gb2312')
        if not isinstance(self.self_name, unicode):
            self.self_name = self.self_name.decode('gb2312')

    @staticmethod
    def get_instant():
        pass

    '''
    '''
    def login(self, args):
        if not self.is_login:
            c = Http4Pycurl(self.cookie, 'http://www.228.com.cn')
            is_login = c.get(self.check_login_url)
            if is_login != 'true':  # 未登录
                print u"帐号{}开始登录...".format(self.login_name)
                data = {
                    'username': self.login_name,
                    'password': self.password
                }
                c = Http4Pycurl(self.cookie, self.login_url)
                html = c.post(self.login_url, data)
                if isinstance(html, str):
                    p = LoginResultParser()
                    p.feed(html)
                    p.close()
                    if p.login_err_msg:
                        return {"code": 201, "msg": u"{}".format(p.login_err_msg), "data": {"name": self.login_name}}
                    else:
                        return {"code": 200, "msg": u"登录成功", "data": {"name": self.login_name}}
                else:
                    return {"code": 201, "msg": u"网络超时", "data": {"name": self.login_name}}
            else:
                self.is_login = True
        return {"code": 200, "msg": u"登录成功", "data": {"name": self.login_name}}

    '''
    登录
    '''
    def __init_login(self):
        data = {
            'username': self.login_name,
            'password': self.password
        }
        curl = Http4Pycurl(self.cookie)
        html = curl.post(self.login_url, data)
        if isinstance(html, str):
            lparser = LoginResultParser()
            lparser.feed(html)
            if lparser.login_err_msg:
                print lparser.login_err_msg
            else:
                print u"登录成功"
        else:
            print u"登录失败"

    '''
    获取Cookie
    '''
    def get_cookie_by_name(self, name):
        val = None
        if self.cookie and os.path.isfile(self.cookie):
            cookie = cookielib.MozillaCookieJar()
            cookie.load(self.cookie, ignore_discard=True, ignore_expires=False)
            for item in cookie:
                if item.name == name:
                    val = item.value
                    break
        return val

    '''
    获取cookie保存地址
    '''
    def get_cookie_file_path(self):
        cookie_dir = os.path.dirname(sys.argv[0]) + '/data/' + self.login_name + '/'
        if not os.path.exists(cookie_dir):
            os.mkdir(cookie_dir)

        md5 = hashlib.md5()
        md5.update(self.login_name)
        path = md5.hexdigest()
        path = cookie_dir + path + '.txt'

        return path

    '''
    '''
    def get_ticket_info(self, url):
        html = Http4Pycurl(self.cookie, 'http://www.228.com.cn').get(url)
        if not html:
            return False
        p = TicketInfoParser()
        p.feed(html)
        p.close()
        info = {
            'tickets': p.tickets,
            'title': p.title
        }
        return info

    '''
    购票
    '''
    def buy(self, ticket_url, is_self_take=False):
        productid = re.findall(r'ticket-(.+)\.html', ticket_url)[0]
        info = self.get_ticket_info(ticket_url)
        tickets = info.get('tickets', None)
        title = info.get('title', None)
        sd = s1 = s2 = ''
        if tickets and isinstance(tickets, list):
            for each in tickets:
                if each['over']:
                    continue
                s1 = '{}{},'.format(s1, each['ticketid'])
                s2 += '1,'
                break
            if s1:
                sd = s1[0:-1] + '^' + s2[0:-1]
        if not sd:
            return {"code": 201, "msg": u"票已抢完 -- {}".format(title), "data": {"name": self.login_name}}
        # print info
        # return
        confirm_url = self.confirm_url.format(productid, sd)
        confirm_html = Http4Pycurl(self.cookie, ticket_url).get(confirm_url)
        if not confirm_html:
            return {"code": 202, "msg": u"网络超时", "data": {"name": self.login_name}}

        p_confirm = ConfirmOrderParser()
        p_confirm.feed(confirm_html)
        p_confirm.close()
        post_url = p_confirm.form_post_url
        form_dict = p_confirm.form_post_dict
        order_source_val = p_confirm.order_source_val
        union_id = p_confirm.union_id
        address_ids = p_confirm.address_id_list

        if not form_dict.get("o['tickets']", None):
            return {"code": 202, "msg": u"订单确认失败", "data": {"name": self.login_name}}
        if order_source_val:
            form_dict["o['orderSource']"] = order_source_val
        form_dict["o['payid']"] = '2217200'  # 使用支付宝支付
        form_dict['discountdetailid'] = '2217200'
        form_dict['activeNo'] = -1
        form_dict["o['unionId']"] = union_id
        if address_ids:
            form_dict["o['addressid']"] = address_ids[0]['addressid']  # 配送地址ID
        # [{"cityid":1,"tickets":"234938479^1","shipment":1,"insurance":0,"cashno":"0","renewal":"0.00"}]
        purchases_item = {
                "tickets": form_dict["o['tickets']"],  # 购买信息
                "insurance": "0",  # 不购买保险
                "cashno": "0",
                "cityid": 1,
                "shipment": 1,  # 1：快递 2:自取
                "renewal": "0.00"
            }
        if self.self_name and self.self_phone:
            purchases_item["consignee"] = self.self_name  # 自取姓名
            purchases_item["consignee_phone"] = self.self_phone  # 自取电话

        if True and self.card_no and self.card_name:  # 实名认证
            cardnos = u"10:{}:{};".format(self.card_no, self.card_name)
            purchases_item['idcardverified'] = [
                {
                    "tickets": form_dict["o['tickets']"],
                    "cardnos": cardnos
                 }
            ]
        form_dict["o['purchases']"] = json.dumps([purchases_item])
        res = Http4Pycurl(self.cookie, confirm_url).post(post_url, form_dict)
        if not res:
            return {"code": 203, "msg": u"订单提交失败", "data": {"name": self.login_name}}
        if res.find('http://pay.228.com.cn/pay/doTrade.do') != -1:
            return {"code": 200, 'msg': u"帐号{}抢票成功 --{}".format(self.login_name, title), "data": {"name": self.login_name}}
        else:
            p_submit = SubmitTicketErrorParser()
            p_submit.feed(res)
            p_submit.close()
            return {"code": 204, 'msg': u"帐号{}抢票失败:{} --{}".format(self.login_name, p_submit.error_msg, title),
                    "data": {"name": self.login_name}}
