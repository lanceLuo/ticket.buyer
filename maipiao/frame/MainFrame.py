# -*- coding: utf-8 -*-

import wx
import os
import sys
from lib.TicketBuyer import TicketBuyer
from lib.YongleBuyer import YongleBuyer

class MainFrame(wx.Frame):
    def __init__(self, parent):
        self.title = u"购票助手"
        wx.Frame.__init__(self, parent, -1, self.title, size=(800, 600))

        self.create_menu_bar()
        # 设置软件ICON
        self.SetIcon(wx.Icon(os.path.dirname(sys.argv[0]) + '/res/title.ico', wx.BITMAP_TYPE_ICO))
        # 设置背景颜色
        # self.SetBackgroundColour(wx.Colour(236, 233, 216))

        YongleBuyer('13040866253', 'Qaz123456', 13040866253)
    '''
    菜单数据
    '''
    def menu_data(self):
        # 格式：菜单数据的格式现在是(标签, (项目))，其中：项目组成为：标签, 描术文字, 处理器, 可选的kind
        # 标签长度为2，项目的长度是3或4
        return [(u"&文件", (             # 一级菜单项
                           (u"&导入购票人", "New paint file", self.on_new),             # 二级菜单项
                           (u"&查询购票记录", "Open paint file", self.on_open),
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

    def on_new(self, event):
        pass

    def on_open(self, event):
        pass

    def on_close_window(self, event):
        pass

