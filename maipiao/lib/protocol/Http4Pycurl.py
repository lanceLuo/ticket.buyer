# -*- coding: utf-8
import pycurl,StringIO

class Http4Pycurl:

    def __init__(self):
        self.cookie_path = None
    	self.data= {}

    def curl(self, url, method='GET', data={}):
        try:
            c = pycurl.Curl()
        except:
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
                if len(links)==2:
                    data=links[1]
                else:
                    data=''

            c.setopt(pycurl.POST, True)
            c.setopt(pycurl.POSTFIELDS, data)
        if self.cookie_path:
            c.setopt(pycurl.COOKIEFILE, self.cookie_path)
            c.setopt(pycurl.COOKIEJAR, self.cookie_path)
        try:
            c.perform()
        except:
            return False
        try:
            http_code = c.getinfo(c.HTTP_CODE)
            content_type = c.getinfo(c.CONTENT_TYPE)
            value = io_buf.getvalue()
            c.close()
            if http_code>=400:
                return False

            return value
        except pycurl.error, e:
            http_code = c.getinfo(c.HTTP_CODE)

            try:
                c.close()
            except:
                pass
            return False

    def get(self, url):
        '''
            GET请求
        '''
    	return self.curl(url)

    def set_cookie_path(self, file_path):
    	self.cookie_path=file_path

	def set_header(self):
		pass

    def ajax_post(self, url, data):
    	pass


if __name__ == '__main__':
    handler = Http4Pycurl()
    handler.set_cookie_path("D:/registration_robot/cookie.txt")
    url = "http://shopping.damai.cn/order.aspx?_action=Immediately&info=%2bb0inMKF1n2S9vl%2ffq9I1agfYzebN35Q"
    print handler.get(url)
    # print handler.get("http://ip.chinaz.com/getip.aspx")