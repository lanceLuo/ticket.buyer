# -*- coding:utf-8
import sys,os,types,pycurl,StringIO,random,re,copy,urllib,types,time,datetime
from downhtml import *
import functions
import conf.constant as constant

'''
爱码服务类
'''
class AiMaService(object):
	UID     = ''
	TOKEN   = ''
	#错误定义
	MSGINFO = {
		'login_error'                : u'用户名密码错误',
		'message'                    : u'访问速度过快',
		'account_is_locked'          : u'账号被锁定',
		'account_is_stoped'          : u'账号被停用',
		'account_is_question_locked' : u'账号已关闭',
		'account_is_ip_stoped'       : u'账号ip锁定',
		'account_is_FreezeUser'      : u'账号被冻结',
		'parameter_error'            : u'传入参数错误',
		'unknow_error'               : u'未知错误,再次请求就会正确返回',
		'no_data'                    : u'系统暂时没有可用号码了',
		'not_found_project'          : u'没有找到项目,项目ID不正确',
		'max_count_disable'          : u'已经达到了当前等级可以获取手机号的最大数量，请先处理完您手上的号码再获取新的号码', #处理方式：能用的号码就获取验证码，不能用的号码就加黑
		'not_receive'                : u'还没有接收到验证码,请让程序等待几秒后再次尝试',
		'sending'                    : u'发送中',
		'fail'                       : u'失败',
		'not_found_moblie'           : u'没有找到手机号'

	}

	def __init__(self):
		self.Article = downHtml()
		self.Article.COOKIE = "%s/%s_Msg.txt" % ( constant.CACHE_DIR, functions.strftime() )

	def loginIn(self, username, password):
		'''
		@ 用户登录
		@ param int pid 项目ID
		@ param int mobile 手机号码 指定号码获取(可以不填写该参数，如填入格式不正确则获取新号码) 
		@ param int size 数量 (可以不填，默认为1，1<=size<=10)
		@ return
		@ todo 
		'''
		username = urllib.quote( username )
		url      = constant.AIMA_LOGIN_IN_URL % (username, password)
		result   = self.Article.curl( url )
		result   = result.split( '|' )
		if result[0] == username :
			self.UID   = username
			self.TOKEN = result[1]
			self.getMobileNum()
			return True
		print result[0]
		return False

	'''
	@ 获取用户个人信息
	@ return 成功返回：用户名;积分;爱码币;可同时获取号码数
	@ todo 
	'''
	def getUserInfos(self):
		url  = constant.AIMA_USER_INFO_URL % (self.UID, self.TOKEN)
		info = self.Article.curl( url )
		print info
		info = info.split( ';' )
		#成功返回：用户名;积分;爱码币;可同时获取号码数
		if info[0] == self.UID :
			return True
		return false

	'''
	@ 获取手机号码
	@ param int pid 项目ID
	@ param int mobile 手机号码 指定号码获取(可以不填写该参数，如填入格式不正确则获取新号码) 
	@ param int size 数量 (可以不填，默认为1，1<=size<=10)
	@ return
	@ todo 项目ID请登陆爱码官网www.f02.cn，查看项目管理获得
	'''
	def getMobileNum(self):
		# url    = constant.AIMA_GET_MOBILE_NUM_URL % ( self.UID, self.TOKEN,
		# 	constant.AIMA_REGISTER_PID, '', constant.AIMA_MOBILE_MAX_NUM )
		# result = self.Article.curl( url )
		result = '159591|aasdasdas'
		print result
		result = result.split( '|' )
		if result[0] in self.MSGINFO :
			return False
		phoneArr = result[0].split( ';' )
		return phoneArr


	'''
	@ 获取验证码并不再使用本号
	@ param int mobile 用getMobilenum方法获取到的手机号
	@ param int author_uid 开发者用户名(可选,传入此参数必须是注册类型为软件开发者的用户名，在获取验证码时传入软件开发者用户名,则按本次消费金额的10%奖励给软件开发者)
	@ return
	@ todo 1.使用该方法获得验证码后，系统自动加黑该号码 2. 因部分短信可能延迟，所以建议该方法每5秒调用一次，调用100秒（可增加获取成功率）
	'''
	def getVcodeAndReleaseMobile(self, mobile, authorUid):
		url    = constant.AIMA_GET_VCODE_AND_RELEASE_MOBILE_URL % ( self.UID, self.TOKEN, mobile, authorUid )
		result = self.Article.curl( url )
		result = result.split( '|' )
		if result[0] in self.MSGINFO :
			return False
		#返回验证码
		return result[1]

	'''
	@ 获取手机号码
	@ param int pid 项目ID
	@ param int mobile 手机号码 指定号码获取(可以不填写该参数，如填入格式不正确则获取新号码) 
	@ param int size 数量 (可以不填，默认为1，1<=size<=10)
	@ return
	@ todo 1. 使用该方法获取完多条短信后，请调用方法addIgnoreList对获取的号码进行加黑 2. 因部分短信可能延迟，所以建议该方法每5秒调用一次，调用100秒（可增加获取成功率）
	'''
	def getVcodeAndHoldMobilenum(self, mobile, authorUid, nextPid):
		url    = constant.AIMA_GET_VCODE_AND_HOLD_MOBILE_NUM_URL % (self.UID, self.TOKEN, mobile,
			authorUid, nextPid)
		result = self.Article.curl( url )
		result = result.split( '|' )
		if result[0] in self.MSGINFO :
			return False
		#返回验证码
		return result[1]

	'''
	@ 加黑无用号码
	@ param int pid 项目ID
	@ param list mobile 手机号码 指定号码获取(可以不填写该参数，如填入格式不正确则获取新号码) 
	@ return
	@ todo 该方法使用于 1.无法注册的手机号码（对方网站提示不可用）2. 超过100秒都无法获取短信的手机号码 3. 调用getVcodeAndHoldMobilenum方法使用结束后的号码
	'''
	def addIgnoreList( self, pid, mobiles ):
		if type(mobiles) is not types.ListType :
			return False

		mobiles = ','.join(str(i) for i in mobiles)
		url     = self.URL + 'addIgnoreList&uid=%s&token=%s&pid=%s&mobiles=%s' % (self.UID, self.TOKEN, pid, mobiles)
		result  = self.Article.curl( url )
		if type(result) is types.IntType :
			return True

		#错误处理


	'''
	@ 发短信
	@ param int pid 项目ID
	@ param int mobile 手机号码 指定号码获取(可以不填写该参数，如填入格式不正确则获取新号码) 
	@ param int size 数量 (可以不填，默认为1，1<=size<=10)
	@ return
	@ todo 调用sendSms方法后，通过 getSmsStatus方法检查短信发送状态
	'''
	def sendSms( self ):
		pass

	'''
	@ 获取短信发送状态
	@ param int pid 项目ID
	@ param int mobile 手机号码 指定号码获取(可以不填写该参数，如填入格式不正确则获取新号码) 
	@ param int size 数量 (可以不填，默认为1，1<=size<=10)
	@ return
	@ todo 调用sendSms方法后，通过 getSmsStatus方法检查短信发送状态
	'''
	def getSmsStatus( self ):
		pass

	'''
	@ 已获取号码列表
	@ param int pid 项目ID （pid等于0的时候获取所有号码，pid不等于0的时候获取指定项目号码）
	@ return
	@ todo 调用sendSms方法后，通过 getSmsStatus方法检查短信发送状态
	'''
	def getRecvingInfo( self, pid ):
		url     = self.URL + 'getRecvingInfo&uid=%s&token=%s&pid=%s' % ( self.UID, self.TOKEN, pid )
		result  = self.Article.curl( url )

	def checkInLogin(self):
		if self.UID :
			return True
		return False


# a = AiMaService()
# b = a.loginIn('luohaoyan', '33575137')
# print b
if __name__=='__main__':
	pass