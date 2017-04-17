# -*- coding: utf-8 -*-

import wx
import os
import sys
from lib.BuyerGrid import *
from lib.MyPage import MyPage
from lib.LogOut import LogOut
from lib.YongLe import *
import csv
import time
import Queue
import threading
import datetime
import re


MAX_WORKER_NUM = 20
EVT_LOGIN = 1
EVT_BUY_TICKET = 2
EVT_UPDATE_TICKET_INFO = 3


class MainFrame(wx.Frame):

    def __init__(self, parent):
        self.title = u"购票助手"
        wx.Frame.__init__(self, parent, wx.ID_ANY, self.title, size=(960, 600))
        self.SetMaxSize((960, 600))
        self.SetMinSize((960, 600))
        self.log_thread = []
        # 设置背景颜色
        self.SetBackgroundColour(wx.Colour(236, 233, 216))
        self.create_menu_bar()
        # 设置软件ICON
        self.SetIcon(wx.Icon(os.path.dirname(sys.argv[0]) + '/res/title.ico', wx.BITMAP_TYPE_ICO))
        self.ui_grid = SimpleGrid(self)
        self.YongLe = YongLe(self.ui_grid)
        # 开始购票按钮
        self.btn_on_buy = wx.Button(self, wx.ID_ANY, u"开始购票", (760, 320), (80, 30), 0)
        self.btn_on_buy.Bind(wx.EVT_BUTTON, self.on_buy)
        # 暂停购票按钮
        self.btn_off_buy = wx.Button(self, wx.ID_ANY, u"暂停购票", (860, 320), (80, 30), 0)
        self.btn_off_buy.Bind(wx.EVT_BUTTON, self.off_buy)
        # 错误信息面板
        self.notebook = wx.Notebook(self, wx.ID_ANY, (2, 300), (750, 240), 0 | wx.NO_BORDER)
        self.notebook.SetBackgroundColour(wx.Colour(236, 233, 216))

        self.notebook_tip = MyPage(self.notebook, 'tip')
        self.notebook.AddPage(self.notebook_tip, u"  提示信息  ")
        self.tip_log = LogOut(self.notebook_tip)
        # sys.stdout = self.tip_log
        self.notebook_err = MyPage(self.notebook, 'err')
        self.notebook.AddPage(self.notebook_err, u"  错误信息  ")
        self.err_log = LogOut(self.notebook_err)
        # sys.stderr = self.err_log
        for i in range(2):
            if i == 0:
                t = threading.Thread(target=self.tip_log.output, name="S_" + str(i))
            else:
                t = threading.Thread(target=self.err_log.output, name="S_" + str(i))
            t.setDaemon(1)
            t.start()
            self.log_thread.append(t)


    '''
    菜单数据
    '''
    def menu_data(self):
        # 格式：菜单数据的格式现在是(标签, (项目))，其中：项目组成为：标签, 描术文字, 处理器, 可选的kind
        # 标签长度为2，项目的长度是3或4
        return [(u"&文件", (             # 一级菜单项
                           (u"&导入购票人", u"打开购票名单", self.on_open),             # 二级菜单项
                           (u"&查询购票记录", u"查看购票记录", self.on_view),
                           ("", "", ""),                                       # 分隔线
                           (u"&退出", "Quit", self.on_close_window)))
       ]

    '''
    创建菜单栏
    '''
    def create_menu_bar(self):
        menu_bar = wx.MenuBar()
        for menu_data in self.menu_data():
            menu_label = menu_data[0]
            menu_item = menu_data[1]
            menu = self.create_menu(menu_item)
            menu_bar.Append(menu, menu_label)
        self.SetMenuBar(menu_bar)

    '''
    创建菜单
    '''
    def create_menu(self, menu_data):
        menu = wx.Menu()
        for each_item in menu_data:
            if len(each_item) == 2:
                label = each_item[0]
                sub_menu = self.create_menu(each_item[1])
                menu.AppendMenu(wx.NewId(), label, sub_menu)  # 递归创建菜单项
            else:
                self.create_menu_item(menu, *each_item)
        return menu

    def create_menu_item(self, menu, label, status, handler, kind=wx.ITEM_NORMAL):
        if not label:
            menu.AppendSeparator()
            return
        menu_item = menu.Append(-1, label, status, kind)
        self.Bind(wx.EVT_MENU, handler,menu_item)

    '''
    开始抢票
    '''
    def on_buy(self, event):
        if self.YongLe.on_buy():
            self.btn_on_buy.Disable()

    '''
    暂停购票按钮
    '''
    def off_buy(self, event):
        self.YongLe.off_buy()
        self.btn_on_buy.Enable()

    '''
    打开开文件对话框
    '''
    def on_open(self, event):
        file_wildcard = u"帐号(*.csv)|*.csv|All files(*.*)|*.*"
        dlg = wx.FileDialog(self, u'请选择',
                            os.getcwd(),
                            style=wx.OPEN,
                            wildcard=file_wildcard)
        if dlg.ShowModal() == wx.ID_OK:
            file_path = dlg.GetPath()
            if not self.YongLe.open_file(file_path):
                wx.MessageBox(u"{} 文件格式错误".format(file_path), "error tip",
                              style=wx.OK | wx.ICON_EXCLAMATION)
        dlg.Destroy()

    def on_view(self, event):
        pass

    def on_close_window(self, event):
        self.Destroy()

