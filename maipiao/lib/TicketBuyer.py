# -*- coding: utf-8 -*-
import os
import sys
import hashlib


class TicketBuyer:

    def __init__(self, login_name, password, phone):
        self.__login_name = login_name
        self.__password = password
        self.__phone = phone
        self.__cookie = os.path.dirname(sys.argv[0]) + '/' + self.get_cookie_file_path(login_name) + '.txt'

    '''
    登录
    '''
    def init_login(self, login_name, password):
        pass

    def get_cookie_file_path(self, login_name):
        md5 = hashlib.md5()
        md5.update(login_name)
        s = md5.hexdigest()
        return s

