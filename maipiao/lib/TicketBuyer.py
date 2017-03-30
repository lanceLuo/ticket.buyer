# -*- coding: utf-8 -*-
import os
import sys
import hashlib
from lib.protocol.Http4Pycurl import Http4Pycurl
import cookielib
import time
from common.Settings import *


class TicketBuyer:

    def __init__(self, login_name, password, phone):
        self.login_url = YONGLE_LOGIN_URL
        self.login_name = str(login_name)
        self.password = str(password)
        self.phone = phone
        self.cookie = self.get_cookie_file_path()
        self.nick_name = self.get_cookie_by_name('damai.cn_nickName')
        if not self.nick_name:
            self.__init_login()

    '''
    登录
    '''
    def __init_login(self):
        data = {
            'token': str(int(round(time.time() * 1000))),
            'nationPerfix': 86,
            'login_email': self.login_name,
            'login_pwd': self.password
        }
        curl = Http4Pycurl(self.cookie)
        html = curl.post(self.login_url, data)
        print html
        self.nick_name = self.get_cookie_by_name('damai.cn_nickName')
        print self.nick_name

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
