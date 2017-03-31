# -*- coding: utf-8 -*-

import os
import sys
import hashlib
from lib.protocol.Http4Pycurl import Http4Pycurl
from parsert.TicketInfoParser import TicketInfoParser
from parsert.ConfirmOrderParser import ConfirmOrderParser
import cookielib
import json
import re
import time


class YongleBuyer:

    def __init__(self, **kwargs):
        self.login_url = 'http://www.228.com.cn/auth/login'
        self.user_info_url = 'http://www.228.com.cn/ajax/getUserInfoFact'
        self.confirm_url = 'http://www.228.com.cn/cart/toOrderSure.html?pid={}&sd={}&quickBuyType=-1'
        self.login_name = str(kwargs['login_name'])
        self.password = str(kwargs['password'])
        self.card_type = '10'
        self.card_no = kwargs.get('card_no', None)  # 身份证号码
        self.card_name = kwargs.get('card_name', None)  # 身份证姓名
        self.cookie = self.get_cookie_file_path()
        self.user_info = None
        if not isinstance(self.card_name, unicode):
            self.card_name = self.card_name.decode('gb2312')

    '''
    '''
    def http_worker(self, reffer = None):
        if not self.user_info:
            curl = Http4Pycurl(self.cookie, 'http://www.228.com.cn')
            json_str = curl.get(self.user_info_url)
            user_info = json.loads(json_str)
            if not user_info['status']:
                print u"帐号{}开始登录...".format(self.login_name)
                self.__init_login()
                json_str = curl.get(self.user_info_url)
                try:
                    user_info = json.loads(json_str)
                except:
                    user_info = {"status": False}
                if not user_info["status"]:
                    print u"帐号{}登录失败!".format(self.login_name)
                else:
                    print u"帐号{}登录成功!".format(self.login_name)
            else:
                print u"帐号{}登录成功!".format(self.login_name)

            self.user_info = user_info

        worker = Http4Pycurl(self.cookie, reffer)
        return worker

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

    '''
    是否登录
    '''
    def is_login(self):
        if not self.nick_name:
            return False
        else:
            return True

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
    def ticket_info_page(self, url):
        reffer = 'http://www.228.com.cn'
        html = self.http_worker().get(url, reffer)
        if not html:
            return False
        ticket_parser = TicketInfoParser()
        ticket_parser.feed(html)
        ticket_parser.close()
        info = {
            'tickets': ticket_parser.tickets,
            'title': ticket_parser.title
        }
        return info

    '''
    购票
    '''
    def buy(self, ticket_url, is_self_take=False):
        # http://www.228.com.cn/ticket-234938278.html
        productid = re.findall(r'ticket-(.+)\.html', ticket_url)[0]
        info = self.ticket_info_page(ticket_url)
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
            print u"票已抢完 -- {}".format(title)
            return

        confirm_url = self.confirm_url.format(productid, sd)
        confirm_html = self.http_worker(ticket_url).get(confirm_url)
        if confirm_html:
            confirm_parser = ConfirmOrderParser()
            confirm_parser.feed(confirm_html)
            post_url = confirm_parser.form_post_url
            post_data = confirm_parser.form_post_dict
            order_source_val = confirm_parser.order_source_val
            address_ids = confirm_parser.address_id_list
            if not post_data.get("o['tickets']", None):
                print u"订单确认失败"
                return
            if order_source_val:
                post_data["o['orderSource']"] = order_source_val
            post_data["o['payid']"] = '2217200'  # 使用支付宝支付
            post_data['discountdetailid'] = '2217200'
            post_data['activeNo'] = -1
            if address_ids:
                post_data["o['addressid']"] = address_ids[0]['addressid']  # 配送地址ID
            # [{"cityid":1,"tickets":"234938479^1","shipment":1,"insurance":0,"cashno":"0","renewal":"0.00"}]
            purchases = [
                {
                    "tickets": post_data["o['tickets']"],  # 购买信息
                    "insurance": "0",  # 不购买保险
                    "cashno": "0",
                    "cityid": 1,
                    "shipment": 1,
                    "renewal": "0.00"
                }
            ]

            if True:  # 实名认证
                cardnos = u"10:{}:{};".format(self.card_no, self.card_name)
                purchases[0]['idcardverified'] = [
                    {
                        "tickets": post_data["o['tickets']"],
                        "cardnos": cardnos
                     }
                ]

            post_data["o['purchases']"] = json.dumps(purchases)
            res = self.http_worker(confirm_url).post(post_url, post_data)
