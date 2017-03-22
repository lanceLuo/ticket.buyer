# -*- coding:utf-8
import re, time, datetime
from downhtml import *

def getLocalIp() :
    html  = downHtml()
    res = html.curl("http://ip.chinaz.com/getip.aspx")
    if not res :
    	return '0.0.0.0';
    res = html.iconv('gb2312','utf-8',res)
    ip   = re.search('\d+\.\d+\.\d+\.\d+', res).group(0)
    return ip

def getNowTime():
    t = time.localtime()
    s = datetime.datetime(t[0],t[1],t[2],t[3],t[4],t[5])
    return int(time.mktime(s.timetuple()))

def strftime():
	return time.strftime( '%Y%m%d%H%M%S', time.localtime())