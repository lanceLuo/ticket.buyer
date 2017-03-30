# -*- coding: utf-8 -*-

import wx
import os
import sys
from lib.TicketBuyer import TicketBuyer
from lib.YongleBuyer import YongleBuyer
import csv
import time

class MainFrame(wx.Frame):

    buyer_pool = []

    def __init__(self, parent):
        self.title = u"购票助手"
        wx.Frame.__init__(self, parent, -1, self.title, size=(800, 600))

        self.create_menu_bar()
        # 设置软件ICON
        self.SetIcon(wx.Icon(os.path.dirname(sys.argv[0]) + '/res/title.ico', wx.BITMAP_TYPE_ICO))
        # 设置背景颜色
        # self.SetBackgroundColour(wx.Colour(236, 233, 216))
        ticket_url = 'http://www.228.com.cn/ticket-234938278.html'
        ticket_url = 'http://www.228.com.cn/ticket-213495681.html'
        # s = YongleBuyer('13040866253', 'Qaz123456', 13040866253)
        # s.buy(ticket_url)
    '''
    菜单数据
    '''
    def menu_data(self):
        # 格式：菜单数据的格式现在是(标签, (项目))，其中：项目组成为：标签, 描术文字, 处理器, 可选的kind
        # 标签长度为2，项目的长度是3或4
        return [(u"&文件", (             # 一级菜单项
                           (u"&导入购票人", u"打开购票名单", self.on_open),             # 二级菜单项
                           (u"&查询购票记录", u"查看购票记录", self.on_view),
                           ("", "", ""),  # 分隔线
                           (u"&开始购票", u"开始购票", self.on_buy),
                           (u"&暂停购票", u"暂停购票", self.off_buy),
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
                menu.AppendMenu(wx.NewId(), label, sub_menu) #递归创建菜单项
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
    开始购票按钮
    '''
    def on_buy(self, event):
        print u"开始购票"
        item = self.buyer_pool.pop()
        s = YongleBuyer(item[0], item[1], 13040866253)
        s.buy(item[4])
        time.sleep(2)
        s = YongleBuyer(item[0], item[1], 13040866253)
        s.buy(item[4])
        print u"购票完毕"

    '''
    暂停购票按钮
    '''
    def off_buy(self, event):
        print u"停止购票"

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
            self.filename = dlg.GetPath()
            self.read_file()
            self.SetTitle(self.title + '--' + self.filename)
        dlg.Destroy()

    def read_file(self):
        if self.filename:
            try:
                f = open(self.filename)
                csv_reader = csv.reader(f)
                for row in csv_reader:
                    self.buyer_pool.append(row)
                f.close()
                self.buyer_pool.pop(0)
            except :
                wx.MessageBox("%s is not a paint file."
                              % self.filename, "error tip",
                              style=wx.OK | wx.ICON_EXCLAMATION)

    def on_view(self, event):
        print self.buyer_pool

    def on_close_window(self, event):
        self.Destroy()

