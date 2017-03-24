# -*- coding: utf-8 -*-
import os
import sys
import hashlib
from lib.protocol.Http4Pycurl import Http4Pycurl
import cookielib
import time
from common.Settings import *
import json


class YongleBuyer:

    def __init__(self, login_name, password, phone):
        self.login_url = 'http://www.228.com.cn/auth/login'
        self.user_info_url = 'http://www.228.com.cn/ajax/getUserInfoFact'
        self.login_name = str(login_name)
        self.password = str(password)
        self.phone = phone
        self.cookie = self.get_cookie_file_path()
        self.user_info = self.get_user_info()
        if not self.user_info:
            self.__init_login()
            self.user_info = self.get_user_info()
        print self.user_info

    def get_user_info(self):
        curl = Http4Pycurl(self.cookie, 'http://www.228.com.cn')
        json_str = curl.get(self.user_info_url)
        user_info = None
        if isinstance(json_str, str):
            try:
                user_info = json.loads(json_str)
                if not isinstance(user_info, dict):
                    print "a"
                    user_info = None
                else:
                    if not user_info['status']:
                        user_info = None
            except:
                pass

        return user_info

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
        print html

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
