# -*- coding: utf-8
import pycurl
import StringIO


class Http4Pycurl:

    def __init__(self, cookie_path=None):
        self.__cookie_path = cookie_path
        self.__header = None

    def curl(self, url, method, data):
        try:
            c = pycurl.Curl()
        except pycurl.error, e:
            return False

        io_buf = StringIO.StringIO()
        c.setopt(pycurl.URL, url)
        c.setopt(pycurl.WRITEFUNCTION, io_buf.write)
        c.setopt(pycurl.FOLLOWLOCATION, 1)
        c.setopt(pycurl.SSL_VERIFYPEER, 0)
        c.setopt(pycurl.SSL_VERIFYHOST, 0)
        c.setopt(pycurl.ENCODING, "gzip,deflate,sdch")
        if method == 'POST':
            if not data:
                links = url.split('?',1)
                if len(links) == 2:
                    data=links[1]
                else:
                    data = ''

            c.setopt(pycurl.POST, True)
            c.setopt(pycurl.POSTFIELDS, data)
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
            value = io_buf.getvalue()
            c.close()
            if http_code >= 400:
                return False

            return value
        except pycurl.error, e:
            http_code = c.getinfo(c.HTTP_CODE)

            try:
                c.close()
            except:
                pass
            return False
    '''
    GET请求
    '''
    def get(self, url):
        return self.curl(url, 'GET', None)

    def set_header(self):
        pass

    def ajax_post(self, url, data):
        pass

    def post(self, url, data):
        return self.curl(url, 'POST', data)

if __name__ == '__main__':
    handler = Http4Pycurl()
    handler.set_cookie_path("D:/registration_robot/cookie.txt")
    url = "http://shopping.damai.cn/order.aspx?_action=Immediately&info=%2bb0inMKF1n2S9vl%2ffq9I1agfYzebN35Q"
    print handler.get(url)
    # print handler.get("http://ip.chinaz.com/getip.aspx")