# -*- coding: utf-8 -*-
import os
import sys
import hashlib
from lib.protocol.Http4Pycurl import Http4Pycurl
import cookielib


class TicketBuyer:

    def __init__(self, login_name, password, phone):
        self.login_url = "https://secure.damai.cn/login.aspx?ru=https://www.damai.cn/sz/"
        self.login_name = str(login_name)
        self.password = str(password)
        self.phone = phone
        self.cookie = self.get_cookie_file_path(self.login_name)
        self.nick_name = self.get_cookie_by_name('damai.cn_nickName')
        if not self.nick_name:
            self.init_login()
            self.nick_name = self.get_cookie_by_name('damai.cn_nickName')

    '''
    登录
    '''
    def init_login(self):
        nick_name = self.get_cookie_by_name('damai.cn_nickName')
        if not nick_name:
            token = 1489469981706
            query_str = "token="+str(token)+"&nationPerfix=86&login_email="+self.login_name+"&login_pwd="+self.password
            curl = Http4Pycurl(self.cookie)
            # html = curl.get(self.login_url)

        self.nick_name = nick_name
        print nick_name

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

    def get_cookie_file_path(self, login_name):
        cookie_dir = os.path.dirname(sys.argv[0]) + '/data/' + login_name + '/'
        if not os.path.exists(cookie_dir):
            os.mkdir(cookie_dir)

        md5 = hashlib.md5()
        md5.update(login_name)
        p = md5.hexdigest()
        p = cookie_dir + p + '.txt'

        return p
