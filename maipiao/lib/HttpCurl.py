# -*- coding: utf-8
import sys,os,types,pycurl,StringIO,random,re,copy,urllib

class HttpCurl:

    def __init__(self):
        self.REFERER=''
        self.USERAGENT="Mozilla/5.0 (Windows NT 6.1; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0"
        self.HEADER=False
        self.POST=False
        self.DATA=False
        self.HEADERCONTENT=False
        self.FILETYPE=False 
        self.bh=StringIO.StringIO()

    def set_cookie_path(self, file_path):
    	self.cookie_path=file_path

	def set_header(self):
		pass
    
    def ajax_post(self, url, data):
    	pass

