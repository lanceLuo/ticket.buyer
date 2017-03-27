# -*- coding: utf-8 -*-

import wx
import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from frame.MainFrame import MainFrame


class TicketApp(wx.App):
    def OnInit(self):
        main_frame = MainFrame(None)
        main_frame.Show(True)
        main_frame.SetFocus()
        return True

if __name__ == '__main__':
    app = TicketApp()
    app.MainLoop()
