# -*- coding:utf-8
import sys,wx
from core.dashboard import dashboard

class App(wx.App):
	def OnInit(self) :
		# self.frame = dashboard(None)
		# self.frame.Show(True)
		# self.frame.SetFocus()
		return True

if __name__ == '__main__':
	app = App()
	frame = dashboard(None)
	frame.Show(True)
	frame.SetFocus()
	app.MainLoop()