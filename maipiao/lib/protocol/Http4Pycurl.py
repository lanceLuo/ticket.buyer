# -*- coding: utf-8
import pycurl
import StringIO
import urllib
import time
import os
import sys
import datetime
import json


class Http4Pycurl:

    def __init__(self, cookie_path=None, refferer=None):
        self.__cookie_path = cookie_path
        self.__header = None
        self.__refferer = refferer
        self.__user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'

    def curl(self, url, method, data):
        c = pycurl.Curl()
        io_buf = StringIO.StringIO()
        c.setopt(pycurl.URL, url)
        c.setopt(pycurl.WRITEFUNCTION, io_buf.write)
        c.setopt(pycurl.FOLLOWLOCATION, 1)
        c.setopt(pycurl.SSL_VERIFYPEER, 0)
        c.setopt(pycurl.SSL_VERIFYHOST, 0)
        c.setopt(pycurl.CONNECTTIMEOUT, 1)
        c.setopt(pycurl.TIMEOUT, 2)
        c.setopt(pycurl.ENCODING, "gzip,deflate,sdch")
        c.setopt(pycurl.USERAGENT, self.__user_agent)
        if self.__refferer:
            c.setopt(pycurl.REFERER, self.__refferer)
        if method == 'POST':
            c.setopt(pycurl.POST, True)
            c.setopt(pycurl.POSTFIELDS, urllib.urlencode(data))
        if self.__cookie_path:
            c.setopt(pycurl.COOKIEFILE, self.__cookie_path)
            c.setopt(pycurl.COOKIEJAR, self.__cookie_path)
        try:
            c.perform()
            http_code = c.getinfo(c.HTTP_CODE)
            content_type = c.getinfo(c.CONTENT_TYPE)
            total_time = c.getinfo(pycurl.TOTAL_TIME)
            value = io_buf.getvalue()
            if method == 'GET':
                msg = u"[URL] {} | [CODE] {} | [TOTAL_TIME] {} | GET".format(url, str(http_code), str(total_time))
            else:
                msg = u"[URL] {} | [CODE] {} | [TOTAL_TIME] {} | [PARAMS] {} | POST"\
                    .format(url, str(http_code), str(total_time), urllib.urlencode(data))
            self.write_log(msg)
            if http_code >= 400:
                return False, c.errstr()
            c.close()
            return True, value
        except:
            http_code = c.getinfo(c.HTTP_CODE)
            c.close()
            return False, ""

    '''
    GET请求
    '''
    def get(self, url, num_retry=2):
        s, r = self.curl(url, 'GET', None)
        if not s:
            num_retry -= 1
            if num_retry > 0:
                return self.get(url, num_retry)
        return s, r

    def set_header(self):
        pass

    def ajax_post(self, url, data, retries=1):
        pass

    def post(self, url, data, num_retry=2):
        s, r = self.curl(url, 'POST', data)
        if not s:
            num_retry -= 1
            if num_retry > 0:
                time.sleep(0.1)
                return self.post(url, data, num_retry)
        return s, r

    def write_log(self, msg):
        d = datetime.datetime.now().strftime('%y-%d-%m')
        dirname = os.path.dirname(sys.argv[0]) + "/data/log"
        if not os.path.exists(dirname):
            os.mkdir(dirname)
        fp = open(dirname + "/http-{}.log".format(d), "a+")
        fp.write(msg + "\r\n")
        fp.close()

if __name__ == '__main__':
    pass