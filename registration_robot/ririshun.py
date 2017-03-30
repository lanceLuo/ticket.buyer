# -*- coding:utf-8
import wx,os,sys,re,math,socket,time
reload(sys)
sys.setdefaultencoding('utf-8')
import Queue,threading
import wx.richtext
from util.AiMaService import *
from util.NewGrid import *

import util.Config as Config

def getLocalIp() :
    html  = downHtml()
    res = html.curl("http://ip.chinaz.com/getip.aspx")
    if not res :
    	return '0.0.0.0';
    res = html.iconv('gb2312','utf-8',res)
    ip   = re.search('\d+\.\d+\.\d+\.\d+', res).group(0)
    return ip


class MyPage( wx.NotebookPage):
	def __init__(self, parent,Name):
		wx.NotebookPage.__init__(self, parent, -1)
		sizer = wx.BoxSizer(wx.VERTICAL)
		self.Box = wx.TextCtrl( self, wx.ID_ANY, u"", wx.DefaultPosition, (790,180),wx.TE_PROCESS_TAB|wx.TE_READONLY|wx.TE_MULTILINE|wx.TE_PROCESS_ENTER|wx.TE_RICH|wx.NO_BORDER)
		self.Box.SetMaxLength( 0 ) 
		self.Box.SetName(Name)
		self.Box.SetFont( wx.Font( 10, 70, 90, 90, False, wx.EmptyString ) )
		sizer.Add( self.Box, 0, wx.ALL, 0 )
		self.SetSizer(sizer)
 
		self.Fit()

class LogOut:
	def __init__(self,obj):
		self.obj=obj
		self.N=len(self.obj.Box.GetValue())
		self.name=obj.Box.Name
		self.stdout=Queue.Queue()
	def write(self,s):

		self.stdout.put(s)

	def output(self):
		while 1:
			if self.stdout.empty():
				time.sleep(1)
				continue
			s=self.stdout.get()
			if self.N>40960:
				self.N=0
				self.obj.Box.Clear()
			self.obj.Box.AppendText(s)
			self.N+=len(s)+2
			self.obj.Box.SetSelection(self.N,self.N)


class DashBoard ( wx.Frame ):

	'''
	@ 初始化
	'''
	def __init__(self, parent):
		wx.Frame.__init__ ( self, parent, id=wx.ID_ANY, title=Config.REGISTER_NAME , pos=wx.DefaultPosition, size=wx.Size( 900,600 ), style=wx.CAPTION|wx.CLOSE_BOX|wx.MINIMIZE_BOX|wx.SYSTEM_MENU|wx.TAB_TRAVERSAL)
		self.LOCK      = threading.Lock()
		self.COND      = threading.Condition()
		self.threading = threading
		self.InitUI()
		self.InitService()
		self.InitRegisterSeivice()
		self.Center()
		self.Show()
		self.SetFocus()

	def InitService(self):
		#爱码服务
		self.AiMaService   = AiMaService()
		self.PhoneNumPool  = Queue.Queue()
		self.IN_GET_MOBILE = False
		self.MOBILE        = threading.Thread( target=self.getMobile, name = "S_getMobile" )
		self.MOBILE.setDaemon(1)
		self.MOBILE.start()

	def getMobile(self):
		while 1:
			if self.IN_GET_MOBILE or not self.PhoneNumPool.empty():
				time.sleep(1)
				continue
			else:
				self.IN_GET_MOBILE = True
				numArr = self.AiMaService.getMobileNum()
				if numArr != False:
					for num in numArr:
						self.PhoneNumPool.put(num)
				self.IN_GET_MOBILE = False

	'''
	UI初始化
	'''
	def InitUI( self ):
		self.SetIcon(wx.Icon( os.path.dirname(sys.argv[0]) + Config.REGISTER_ICON, wx.BITMAP_TYPE_ICO))
		self.SetSizeHintsSz( wx.DefaultSize, wx.DefaultSize )
		self.SetBackgroundColour( wx.Colour( 236, 233, 216 ) )
		#表格
		self.grid = SimpleGrid(self)

		#帐号
		self.m_lable_name = wx.StaticText( self, wx.ID_ANY, u"账号", (10,320), wx.DefaultSize, 0 )
		self.m_name       = wx.TextCtrl( self, wx.ID_ANY, 'luohaoyan', (40,320), ( 100, 20 ) ,0)
		self.m_name.SetBackgroundColour( wx.Colour(245, 245, 245) )
		#密码
		self.m_lable_password = wx.StaticText( self, wx.ID_ANY, u"密码", (145,320), wx.DefaultSize, 0 )
		self.m_password       = wx.TextCtrl( self, wx.ID_ANY, '33575137', ( 175, 320 ), ( 100, 20 ) ,wx.TE_PASSWORD )
		self.m_password.SetBackgroundColour( wx.Colour(245, 245, 245) )
		#登录按钮
		self.m_login_btn  = wx.Button( self, wx.ID_ANY, u"登陆", ( 280, 320 ), ( 50, 20 ), 0 )
		self.m_login_btn.Bind( wx.EVT_BUTTON, self.handelLogin )

		self.m_lable_ip   = wx.StaticText( self, wx.ID_ANY, u"当前IP:", (10,360), wx.DefaultSize, 0 )
		self.m_ip         = wx.StaticText( self, wx.ID_ANY, getLocalIp(), (60,360), wx.DefaultSize, 0 )

		self.notebook     = wx.Notebook(self,wx.ID_ANY, ( 335, 320 ), ( 562, 255) , 0|wx.NO_BORDER)
		self.notebook.SetBackgroundColour( wx.Colour(236, 233, 216) )
		self.notebook_jindu = MyPage(self.notebook,'jindu')
		self.notebook_err   = MyPage(self.notebook,'err')
		self.notebook.AddPage(self.notebook_jindu, u"  提示信息  ")
		self.notebook.AddPage(self.notebook_err, u"  错误信息  ")

		self.ERR_Load    =  LogOut(self.notebook_err)
		sys.stderr       =  self.ERR_Load
		self.Jindu_Load  =  LogOut(self.notebook_jindu)
		sys.stdout       =  self.Jindu_Load
		self.SYSTh=[]
		for i in range(2):
			s=threading.Thread( target=self.output, name = "S_" + str(i) )
			s.setDaemon(1)
			s.start()
			self.SYSTh.append(s)

	'''
	@ 登录事件处理
	'''
	def handelLogin( self, event = False ) :
		if event:
			event.Skip()
		if self.AiMaService.checkInLogin() :
			print u'重复登录'
			return False

		self.m_login_btn.Disable()
		self.m_login_btn.SetLabel( u'登录中...' )

		username = self.m_name.GetValue()
		password = self.m_password.GetValue()
		if len( username ) < 5 or len( password ) < 5:
			self.m_login_btn.Enable()
			self.m_login_btn.SetLabel( u'登录' )
			print 'login err'
			return False
		status   = self.AiMaService.loginIn( username, password )
		if not status :
			self.m_login_btn.SetLabel( u'登录' )
			self.m_login_btn.Enable()
			print 'login fail'
			return False
		print u'登陆成功'
		self.m_login_btn.SetLabel( u'登陆成功' )
		self.m_name.Disable()
		self.m_password.Disable()
		return True

	'''
	@ 写日志
	'''
	def log(self, msg):

		pass

	def output(self):
		tName = threading.currentThread().getName()
		if tName=='S_0':
			return self.Jindu_Load.output()
		if tName=='S_1':
			return self.ERR_Load.output()

	def Errmsg(self,msg):
		dlg = wx.MessageDialog(None,msg,u'错误提示', wx.OK|wx.ICON_ERROR )
		result = dlg.ShowModal()
		dlg.Destroy()

	def outlog(self,msg):
		print msg

	def InitRegisterSeivice(self):
		self.RegisterService = []
		for i in range(Config.AIMA_REGISTER_T_NUM):
			s = threading.Thread(target=self.RegisterRobot, name='RegisterRobot' + str(i))
			s.setDaemon(1)
			s.start()
			self.RegisterService.append(s)

	def RegisterRobot(self):
		while 1:
			print self.PhoneNumPool.qsize()
			time.sleep(1)

class MyApp(wx.App):
	def OnInit(self) :
		self.frame = DashBoard(None)
		self.frame.Show(True)
		self.frame.SetFocus()
		return True

if __name__=='__main__':
		app = MyApp()
		app.MainLoop()