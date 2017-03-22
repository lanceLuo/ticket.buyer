# -*- coding:utf-8
import sys,os,types,pycurl,StringIO,random,re,copy,urllib,types,time,datetime
from downhtml import *
import functions,Config
import urllib2
import cookielib
class RegisterService(object):
	"""
	docstring for RegisterService
	注册服务类
	"""
	def __init__(self):
		super(RegisterService, self).__init__()
		self.Article = downHtml()
		# self.Article.COOKIE = "%s/%s_register_%s.txt" % ( Config.CACHE_DIR, functions.strftime(), random.randint(1,1000))
		self.Article.COOKIE = 'D:/registration_robot/cache/20150512163514_register_601.txt'
		print self.Article.COOKIE
		result = self.Article.curl('http://www.rrs.com')
		result = self.Article.curl('http://www.rrs.com/register')
		self.REFERER = Config.REGISTER_URL

	def getValifyCode(self):
		num = 13691695495
		url = Config.REGISTER_VCODE_SEND % num
		result = self.Article.curl(url)
		print result

	def register(self):

		pass
from cookielib import Cookie
c = Cookie(None,'UniqueName', 'ed84c206-d5f5-8254-7727-494fff6ac750', '80', '80', 'rrs.com', None, None, '/', None, False, False, 'TestCookie', None, None, None)
cookie = cookielib.CookieJar()
cookie.set_cookie(c)
c = Cookie(None,'ZXKJSESSIONID', 'ed84c206-d5f5-8254-7727-494fff6ac750***1', '80', '80', 'rrs.com', None, None, '/', None, False, False, 'TestCookie', None, None, None)
cookie.set_cookie(c)


handler=urllib2.HTTPCookieProcessor(cookie)
opener = urllib2.build_opener(handler)
response = opener.open('http://www.rrs.com/api/user/sms')
print response
# cookie.set_cookie(c)
for item in cookie:
    print 'Name = '+item.name
    print 'Value = '+item.value
if __name__ == 'main':
	pass