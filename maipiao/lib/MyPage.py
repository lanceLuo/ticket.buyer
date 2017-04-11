# -*- coding: utf-8 -*-
import wx


class MyPage(wx.NotebookPage):
    def __init__(self, parent, Name):
        wx.NotebookPage.__init__(self, parent, -1)
        sizer = wx.BoxSizer(wx.VERTICAL)
        self.Box = wx.TextCtrl(self, wx.ID_ANY, u"", wx.DefaultPosition, (0, 0),
                               wx.TE_PROCESS_TAB | wx.TE_READONLY | wx.TE_MULTILINE | wx.TE_PROCESS_ENTER | wx.TE_RICH | wx.NO_BORDER)
        self.Box.SetMaxLength(0)
        self.Box.SetName(Name)
        self.Box.SetFont(wx.Font(10, 70, 90, 90, False, wx.EmptyString))
        sizer.Add(self.Box, 0, wx.ALL, 0)
        self.SetSizer(sizer)
        self.Fit()