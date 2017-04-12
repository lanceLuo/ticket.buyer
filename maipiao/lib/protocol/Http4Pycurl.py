# -*- coding: utf-8
import pycurl
import StringIO
import urllib
import time
import os
import sys


class Http4Pycurl:

    def __init__(self, cookie_path=None, refferer=None):
        self.__cookie_path = cookie_path
        self.__header = None
        self.__refferer = refferer
        self.__user_agent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'

    def curl(self, url, method, data, retries):
        if retries <= 0:
            return False

        try:
            c = pycurl.Curl()
        except pycurl.error, e:
            pycurl.error.message()
            return False

        io_buf = StringIO.StringIO()
        c.setopt(pycurl.URL, url)
        c.setopt(pycurl.WRITEFUNCTION, io_buf.write)
        c.setopt(pycurl.FOLLOWLOCATION, 1)
        c.setopt(pycurl.SSL_VERIFYPEER, 0)
        c.setopt(pycurl.SSL_VERIFYHOST, 0)
        c.setopt(pycurl.CONNECTTIMEOUT, 1)
        c.setopt(pycurl.TIMEOUT, 1)
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
        except:
            return False
        try:
            http_code = c.getinfo(c.HTTP_CODE)
            content_type = c.getinfo(c.CONTENT_TYPE)
            total_time = c.getinfo(pycurl.TOTAL_TIME)
            if method == 'GET':
                msg = "[URL] {} | [CODE] {} | [TOTAL_TIME] {} | GET".format(url, str(http_code), str(total_time))
            else:
                msg = "[URL] {} | [CODE] {} | [TOTAL_TIME] {} | [PARAMS] {} | POST"\
                    .format(url, str(http_code),str(total_time), urllib.urlencode(data))
            self.write_log(msg)

            value = io_buf.getvalue()
            c.close()
            if http_code >= 400:
                return False

            return value
        except pycurl.error, e:
            http_code = c.getinfo(c.HTTP_CODE)
            print http_code
            try:
                c.close()
            except:
                pass
            return False
    '''
    GET请求
    '''
    def get(self, url, retries=2):
        r = self.curl(url, 'GET', None, retries)
        if not r:
            retries -= 1
            if retries > 0:
                return self.curl(url, 'GET', None, retries)
        return r

    def set_header(self):
        pass

    def ajax_post(self, url, data, retries=1):
        pass

    def post(self, url, data, retries=2):
        r = self.curl(url, 'POST', data, retries)
        if not r:
            retries -= 1
            if retries > 0:
                time.sleep(0.1)
                return self.curl(url, 'POST', data, retries)
        return r

    @classmethod
    def write_log(cls, msg):
        fp = open(os.path.dirname(sys.argv[0]) + "/data/log/http.log", "a+")
        fp.write(msg + "\r\n")
        fp.close()

if __name__ == '__main__':
    pass