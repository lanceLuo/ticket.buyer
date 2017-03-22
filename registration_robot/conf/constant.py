# -*- coding:utf-8
import sys, os
reload(sys)
sys.setdefaultencoding('utf-8')
ROOT_DIR  = os.path.dirname(sys.argv[0])
CACHE_DIR = ROOT_DIR+'/cache/'


REGISTER_NAME   = u'日日顺注册机'
REGISTER_ICON   = '/3.ico'
REGISTER_URL    = 'http://www.rrs.com/register'
REGISTER_INDEX  = 'http://www.rrs.com/'
REGISTER_VCODE_SEND = 'http://www.rrs.com/api/user/sms?mobile=%s'

AIMA_REGISTER_T_NUM = 1 #注册线程数
AIMA_REGISTER_PID   = 2729
AIMA_MOBILE_MAX_NUM = 1
AIMA_BASE_URL = 'http://api.f02.cn/http.do?'
AIMA_LOGIN_IN_URL  = AIMA_BASE_URL+'action=loginIn&uid=%s&pwd=%s'
AIMA_USER_INFO_URL = AIMA_BASE_URL+'action=getUserInfos&uid=%s&token=%s'
AIMA_GET_MOBILE_NUM_URL = AIMA_BASE_URL+'action=getMobilenum&uid=%s&token=%s&pid=%s&mobile=%s&size=%s'
AIMA_GET_VCODE_AND_RELEASE_MOBILE_URL = AIMA_BASE_URL+'action=getVcodeAndReleaseMobile&uid=%s&token=%s&mobile=%s&author_uid=%s'
AIMA_GET_VCODE_AND_HOLD_MOBILE_NUM_URL= AIMA_BASE_URL+'action=getVcodeAndHoldMobilenum&uid=%s&token=%s&mobile=%s&author_uid=%s&next_pid=%s'

AIMA_ADMIN_NAME = 'luohaoyan'
AIMA_ADMIN_PWD  = '33575137'
