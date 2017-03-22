# -*- coding:utf-8
import urllib,os,time,threading
import urllib2  
import gzip,json
import StringIO,pycurl

#cookies = '_QM=1; _pk_ref.1.9554=%5B%22%22%2C%22%22%2C1438339879%2C%22http%3A%2F%2Fwx.juanpi.com%2Fevent%2Fbaibei%22%5D; _pk_id.1.9554=0e66cd0ceb53890c.1432806659.9.1438339934.1438333775.; utm=104069; _pk_id..2ae0=9d03fc3d61db2562.1439281926.1.1439281926.1439281926.; _Qt=1440062121128; ordertoptip=1; __jsluid=1f0ee2ad86927031829a9958d425cf23; MLogin_newType=b10d1d2e495fea3ef6854e4687e231c1; s_uid=15lpg9; s_suid=101010; s_name=luohaoyan521; s_pic=%2Fface%2Fdefault.jpg; s_sign=20ab80f485a09488e6921b582c977f78; s_exp=0; jindan12_act_15lpg9=1449799747; sid=sitbobuj1gt3e10f7j6k5s25t3; _pk_ref.1.2ae0=%5B%22%22%2C%22%22%2C1449839117%2C%22http%3A%2F%2Fwww.juanpi.com%2F%22%5D; curutm=0; juanpi_sid8=36fd8c2a-c407-4c65-8585-331edaf32183; c_login=1; sign_15lpg9=%257B%2522code%2522%253A1002%252C%2522msg%2522%253A%2522%255Cu6ca1%255Cu6709%255Cu7b7e%255Cu5230%2522%257D; shareCartData=%7B%22shareCartNum%22%3A0%2C%22residualTime%22%3A3600%2C%22expTime%22%3A1449843317.468%2C%22s_uid%22%3A%2215lpg9%22%7D; Hm_lvt_db55e4f19d63bf355540efe831dc46ed=1449839641; Hm_lpvt_db55e4f19d63bf355540efe831dc46ed=1449840158; key_url_list=http://m.juanpi.com/act/sub_baokuan12?mobile,http://m.juanpi.com/act/sub_baokuan12?mobile,http://m.juanpi.com/act/sub_baokuan12?mobile,http://m.juanpi.com/act/sub_baokuan12?mobile; __jsl_clearance=1449842310.257|0|l3cvuNo5paHQbaO8NCgnK5DBy8o%3D; Hm_lpvt_39783c2b2b90a45e774b4dd32bdff570=1449842311; Hm_lvt_39783c2b2b90a45e774b4dd32bdff570=1449842311; Hm_lvt_e4ceab5da6d783f3d6d7e9904eb493f1=1447318468,1449799254; Hm_lpvt_e4ceab5da6d783f3d6d7e9904eb493f1=1449842353; _ga=GA1.2.1064421366.1432806233; _gat=1; _pk_id.1.2ae0=ac1897ad09e7f193.1433389903.62.1449842354.1449835788.; _pk_ses.1.2ae0=*; newPerson=1; server_time=1449842313; JPFROM_LIST=think%3A%7B%222%22%3A%22M%22%2C%223%22%3A%22Android%22%2C%224%22%3A%22iPhone%22%2C%225%22%3A%22iPad%22%2C%226%22%3A%22android%22%2C%227%22%3A%22iPhone%22%2C%228%22%3A%22iPad%22%2C%229%22%3A%22%25E5%25BE%25AE%25E4%25BF%25A1%25E7%2589%25B9%25E5%258D%2596%22%2C%2210%22%3A%22%25E5%25AE%2589%25E5%258D%2593Pad%22%2C%2211%22%3A%22app%22%2C%22-1%22%3A%22PC%22%7D; blid=1'
#####################
#####替换cookie
cookies = '_QM=1; _pk_ref.1.9554=%5B%22%22%2C%22%22%2C1438339879%2C%22http%3A%2F%2Fwx.juanpi.com%2Fevent%2Fbaibei%22%5D; _pk_id.1.9554=0e66cd0ceb53890c.1432806659.9.1438339934.1438333775.; utm=104069; _pk_id..2ae0=9d03fc3d61db2562.1439281926.1.1439281926.1439281926.; _Qt=1440062121128; ordertoptip=1; __jsluid=1f0ee2ad86927031829a9958d425cf23; MLogin_newType=b10d1d2e495fea3ef6854e4687e231c1; s_uid=15lpg9; s_suid=101010; s_name=luohaoyan521; s_pic=%2Fface%2Fdefault.jpg; s_sign=20ab80f485a09488e6921b582c977f78; s_exp=0; jindan12_act_15lpg9=1449799747; sid=sitbobuj1gt3e10f7j6k5s25t3; c_login=1; sign_15lpg9=%257B%2522code%2522%253A1002%252C%2522msg%2522%253A%2522%255Cu6ca1%255Cu6709%255Cu7b7e%255Cu5230%2522%257D; Hm_lvt_db55e4f19d63bf355540efe831dc46ed=1449839641; Hm_lpvt_db55e4f19d63bf355540efe831dc46ed=1449840158; __jsl_clearance=1449845947.016|0|tU1RjVT5ndBsRa%2FB6keAmYCgq6s%3D; curutm=0; _pk_ref.1.2ae0=%5B%22%22%2C%22%22%2C1449845949%2C%22http%3A%2F%2Fwww.juanpi.com%2F%22%5D; juanpi_sid8=1e6cb1f5-e3e2-48b6-8fb2-96fc8313b48b; key_url_list=http://m.juanpi.com/act/sub_baokuan12?mobile,http://m.juanpi.com/act/sub_baokuan12?mobile,http://m.juanpi.com/act/sub_baokuan12?mobile,http://m.juanpi.com/act/sub_baokuan12?mobile; _gat=1; toastPay=0; Hm_lvt_e4ceab5da6d783f3d6d7e9904eb493f1=1447318468,1449799254; Hm_lpvt_e4ceab5da6d783f3d6d7e9904eb493f1=1449847666; _ga=GA1.2.1064421366.1432806233; _pk_id.1.2ae0=ac1897ad09e7f193.1433389903.63.1449847667.1449843829.; _pk_ses.1.2ae0=*; newPerson=1; server_time=1449847753; JPFROM_LIST=think%3A%7B%222%22%3A%22M%22%2C%223%22%3A%22Android%22%2C%224%22%3A%22iPhone%22%2C%225%22%3A%22iPad%22%2C%226%22%3A%22android%22%2C%227%22%3A%22iPhone%22%2C%228%22%3A%22iPad%22%2C%229%22%3A%22%25E5%25BE%25AE%25E4%25BF%25A1%25E7%2589%25B9%25E5%258D%2596%22%2C%2210%22%3A%22%25E5%25AE%2589%25E5%258D%2593Pad%22%2C%2211%22%3A%22app%22%2C%22-1%22%3A%22PC%22%7D; blid=1; Hm_lpvt_39783c2b2b90a45e774b4dd32bdff570=1449847753; Hm_lvt_39783c2b2b90a45e774b4dd32bdff570=1449847753'
cookies = '_QM=1; _pk_ref.1.9554=%5B%22%22%2C%22%22%2C1438339879%2C%22http%3A%2F%2Fwx.juanpi.com%2Fevent%2Fbaibei%22%5D; _pk_id.1.9554=0e66cd0ceb53890c.1432806659.9.1438339934.1438333775.; utm=104069; _pk_id..2ae0=9d03fc3d61db2562.1439281926.1.1439281926.1439281926.; _Qt=1440062121128; ordertoptip=1; __jsluid=1f0ee2ad86927031829a9958d425cf23; MLogin_newType=b10d1d2e495fea3ef6854e4687e231c1; s_uid=15lpg9; s_suid=101010; s_name=luohaoyan521; s_pic=%2Fface%2Fdefault.jpg; s_sign=20ab80f485a09488e6921b582c977f78; s_exp=0; jindan12_act_15lpg9=1449799747; sid=sitbobuj1gt3e10f7j6k5s25t3; c_login=1; Hm_lvt_db55e4f19d63bf355540efe831dc46ed=1449839641; Hm_lpvt_db55e4f19d63bf355540efe831dc46ed=1449849611; toastPay=0; __jsl_clearance=1449854867.123|0|XgLdWwC17gaOaCZ1nLAvYGBJ8tc%3D; curutm=0; _pk_ref.1.2ae0=%5B%22%22%2C%22%22%2C1449854866%2C%22http%3A%2F%2Fwww.juanpi.com%2F%22%5D; _gat=1; juanpi_sid8=5eb2d188-42cf-44a7-b995-500f6741972f; key_url_list=http://m.juanpi.com/act/sub_baokuan12?mobile,http://m.juanpi.com/act/sub_baokuan12?mobile,http://m.juanpi.com/act/sub_baokuan12?mobile,http://m.juanpi.com/act/sub_baokuan12?mobile; Hm_lpvt_39783c2b2b90a45e774b4dd32bdff570=1449854940; Hm_lvt_39783c2b2b90a45e774b4dd32bdff570=1449854940; Hm_lvt_e4ceab5da6d783f3d6d7e9904eb493f1=1447318468,1449799254; Hm_lpvt_e4ceab5da6d783f3d6d7e9904eb493f1=1449854937; _ga=GA1.2.1064421366.1432806233; _pk_id.1.2ae0=ac1897ad09e7f193.1433389903.64.1449854938.1449850906.; _pk_ses.1.2ae0=*; newPerson=1; server_time=1449855034; JPFROM_LIST=think%3A%7B%222%22%3A%22M%22%2C%223%22%3A%22Android%22%2C%224%22%3A%22iPhone%22%2C%225%22%3A%22iPad%22%2C%226%22%3A%22android%22%2C%227%22%3A%22iPhone%22%2C%228%22%3A%22iPad%22%2C%229%22%3A%22%25E5%25BE%25AE%25E4%25BF%25A1%25E7%2589%25B9%25E5%258D%2596%22%2C%2210%22%3A%22%25E5%25AE%2589%25E5%258D%2593Pad%22%2C%2211%22%3A%22app%22%2C%22-1%22%3A%22PC%22%7D; blid=1'
# shopId = '3082447'
# skuid  = '6436346'
#########################
#替换以下
shopId = '3176320'
skuid  = '6241234'
#########################
user_agent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4'

headers = {
	'Referer': 'http://m.juanpi.com/shop/' + shopId,
	'User-Agent':user_agent,
	'Host':'m.juanpi.com',
	'Origin': 'http://m.juanpi.com',
	'Accept-Encoding':"gzip, deflate",
	'Accept':"*/*",
	'X-Requested-With': 'XMLHttpRequest',
	'Accept-Language':"zh-CN,zh;q=0.8",
	'Connection': 'keep-alive',
	'Content-Type': 'application/x-www-form-urlencoded',
	'Cookie' : cookies
}
def getHeadersData():
	return headers
def getPostData():
	postData = {'skuid':skuid,'num':1}
	return postData
AppStop = False
def isStop():
	return AppStop
def setStop():
	global AppStop
	AppStop = True
tryNum = 0
def addGoods():
	postData = getPostData()
	headers = getHeadersData()
	postData = urllib.urlencode(postData)
	while 1:
		global tryNum
		if tryNum > 5:
			return False
		tryNum = tryNum+1
		if isStop():
			break
		try:
			request=urllib2.Request('http://m.juanpi.com/shop/getToken', postData, headers)
			response=urllib2.urlopen(request)
		except:
			setStop()
			return False

		isGzip = response.headers.get('Content-Encoding')
		if isGzip:
			compresseddata = response.read()
			compressedstream = StringIO.StringIO(compresseddata)
			gzipper = gzip.GzipFile(fileobj=compressedstream)
			data = gzipper.read()
			# data = '{"skuNum":1,"goodsNum":2,"expireTime":1449847917,"code":200,"nowTime":1449847023}'
			data = json.loads(data)
			if str(data['code']) == '200':
				setStop()
				break
		time.sleep(0.05)

listTh = []
thNum    = 0
for i in range(thNum):
	s=threading.Thread(target = addGoods, name = "addGoods" + str(i) )
	s.setDaemon(1)	
	s.start()
	listTh.append(s)

postData = getPostData()
headers = getHeadersData()
# postData = urllib.urlencode(postData)
# for i in range(2):
# 	try:
# 		request=urllib2.Request('http://www.baidu.com', postData, headers)
# 		print i
# 		curTime = int(time.time())
# 		print time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(curTime))
# 		response=urllib2.urlopen(request, timeout=1)
# 		curTime = int(time.time())
# 		print time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(curTime))
# 		print i
# 	except:
# 		setStop()
b = StringIO.StringIO()
for i in range(1):
	try:
		try:
			c = pycurl.Curl()
		except:
			pass
		c.setopt(pycurl.URL,'http://m.juanpi.com/shop/getToken')
		c.setopt(pycurl.HTTPHEADER, headers)
		c.setopt(pycurl.FOLLOWLOCATION, 1)
		# c.setopt(pycurl.SSL_VERIFYPEER, 0)
		# c.setopt(pycurl.SSL_VERIFYHOST, 0)
		# c.setopt(pycurl.HTTPHEADER, headers)
		c.setopt(pycurl.WRITEFUNCTION, b.write)
		postData = urllib.urlencode(postData)
		c.setopt(pycurl.POSTFIELDS, postData)
		c.setopt(pycurl.POST, 1)
		try:
			c.perform()
		except:
			print "fail http"
		value=b.getvalue()
		print value
		# c.close()
		# print i
		# curTime = int(time.time())
		# print time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(curTime))
		# response=urllib2.urlopen(request, timeout=1)
		# curTime = int(time.time())
		# print time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(curTime))
		# print i
	except:
		setStop()
# timeLeft = 20
# while 1:
# 	if isStop():
# 		print "success"
# 		break
# 	# timeLeft = timeLeft-2
# 	# print "on proccess"
# 	if timeLeft < 0:
# 		print "exit proccess"
# 		break
# curTime = int(time.time())
# print time.strftime('%Y-%m-%d %H:%M:%S', time.gmtime(curTime))