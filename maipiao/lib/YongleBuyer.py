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


class YongleBuyer:

    def __init__(self, login_name, password, phone):
        self.login_url = 'http://www.228.com.cn/auth/login'
        self.user_info_url = 'http://www.228.com.cn/ajax/getUserInfoFact'
        self.confirm_url = 'http://www.228.com.cn/cart/toOrderSure.html?pid={}&sd={}&quickBuyType=-1'
        self.login_name = str(login_name)
        self.password = str(password)
        self.phone = phone
        self.cookie = self.get_cookie_file_path()
        self.user_info = None

    '''
    '''
    def http_worker(self, reffer = None):
        if not self.user_info:
            curl = Http4Pycurl(self.cookie, 'http://www.228.com.cn')
            json_str = curl.get(self.user_info_url)
            user_info = json.loads(json_str)
            if not user_info['status']:
                print "login"
                self.__init_login()
                json_str = curl.get(self.user_info_url)
                user_info = json.loads(json_str)
            print user_info
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
        return ticket_parser.tickets

    '''
    '''
    def buy(self, ticket_url, is_self_take=False):
        # http://www.228.com.cn/ticket-234938278.html
        productid = re.findall(r'ticket-(.+)\.html', ticket_url)[0]
        tickets = self.ticket_info_page(ticket_url)
        sd = s1 = s2 = ''
        if tickets and isinstance(tickets, list):
            for each in tickets:
                if each['over']:
                    continue
                s1 = '{}{},'.format(s1, each['ticketid'])
                s2 += '1,'
                break
            sd = s1[0:-1] + '^' + s2[0:-1]
        confirm_url = self.confirm_url.format(productid, sd)
        confirm_html = self.http_worker(ticket_url).get(confirm_url)
        if confirm_html:
            confirm_parser = ConfirmOrderParser()
            confirm_parser.feed(confirm_html)
            post_url = confirm_parser.form_post_url
            post_data = confirm_parser.form_post_dict
            order_source_val = confirm_parser.order_source_val
            if order_source_val:
                post_data["o['orderSource']"] = order_source_val
            post_data["o['payid']"] = '2217200'  # 使用支付宝支付
            post_data['discountdetailid'] = '2217200'
            post_data['activeNo'] = -1
            post_data["o['addressid']"] = '11357794'  # 配送地址ID
            # [{"cityid":1,"tickets":"234938479^1","shipment":1,"insurance":0,"cashno":"0","renewal":"0.00"}]
            purchases = [
                {
                    "tickets": post_data["o['tickets']"],#购买信息
                    "insurance": "0",  # 不购买保险
                    "cashno": "0",
                    "cityid": 1,
                    "shipment": 1,
                    "renewal": "0.00"
                }
            ]
            post_data["o['purchases']"] = json.dumps(purchases)
            # print post_url
            # print post_data
            res = self.http_worker(confirm_url).post(post_url, post_data)
            print res
