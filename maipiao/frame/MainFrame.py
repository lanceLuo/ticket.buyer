# -*- coding: utf-8 -*-

import wx
import os
import sys
from lib.TicketBuyer import TicketBuyer
from lib.YongleBuyer import YongleBuyer
from lib.BuyerGrid import *
import csv
import time
import Queue
import threading
import datetime

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


class LogOut:
    def __init__(self, obj):
        self.obj = obj
        self.N = len(self.obj.Box.GetValue())
        self.name = obj.Box.Name
        self.stdout = Queue.Queue()

    def write(self, s):
        self.stdout.put(s)

    def output(self):
        while 1:
            if self.stdout.empty():
                time.sleep(1)
                continue
            s = self.stdout.get()
            if self.N > 40960:
                self.N = 0
                self.obj.Box.Clear()
            self.obj.Box.AppendText(s)
            cdate = datetime.datetime.now().strftime('%d-%m-%y')
            dirname = os.path.dirname(sys.argv[0]) + "/data/log"
            if threading.current_thread().getName() == "S_0":
                filename = dirname + "/info_" + cdate + ".log"
            else:
                filename = dirname + "/err_" + cdate + ".log"
            if not os.path.exists(dirname):
                os.mkdir(dirname)
            fp = open(filename, 'a+')
            fp.write(s + "\r")
            fp.close()
            self.N += len(s) + 2
            self.obj.Box.SetSelection(self.N, self.N)


class MainFrame(wx.Frame):
    log_thread = []
    th_buyer = []  # 线程数
    buyer_num = 2
    filename = None

    def __init__(self, parent):
        self.title = u"购票助手"
        self.ticket_queue = Queue.Queue()
        wx.Frame.__init__(self, parent, wx.ID_ANY, self.title, size=(900, 600))
        self.SetMaxSize((900, 600))
        self.SetMinSize((900, 600))

        # 设置背景颜色
        self.SetBackgroundColour(wx.Colour(236, 233, 216))
        self.create_menu_bar()
        # 设置软件ICON
        self.SetIcon(wx.Icon(os.path.dirname(sys.argv[0]) + '/res/title.ico', wx.BITMAP_TYPE_ICO))
        self.ui_grid = SimpleGrid(self)
        # 开始购票按钮
        self.btn_on_buy = wx.Button(self, wx.ID_ANY, u"开始购票", (660, 320), (80, 30), 0)
        self.btn_on_buy.Bind(wx.EVT_BUTTON, self.on_buy)
        # 暂停购票按钮
        self.btn_off_buy = wx.Button(self, wx.ID_ANY, u"暂停购票", (760, 320), (80, 30), 0)
        self.btn_off_buy.Bind(wx.EVT_BUTTON, self.off_buy)
        # 错误信息面板
        self.notebook = wx.Notebook(self, wx.ID_ANY, (2, 300), (650, 240), 0 | wx.NO_BORDER)
        self.notebook.SetBackgroundColour(wx.Colour(236, 233, 216))

        self.notebook_tip = MyPage(self.notebook, 'tip')
        self.notebook.AddPage(self.notebook_tip, u"  提示信息  ")
        self.tip_log = LogOut(self.notebook_tip)
        sys.stdout = self.tip_log
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
    开始购票按钮
    '''
    def on_buy(self, event):
        if self.ticket_queue.empty():
            print u"未导入购票人信息"
            return

        def th_buyer():
            while 1:
                if self.ticket_queue.empty():
                    break
                try:
                    item = self.ticket_queue.get()
                except ValueError, e:
                    item = None
                if not item:
                    continue
                s = YongleBuyer(login_name=item[0], password=item[1], card_name=item[2], card_no=item[3])
                s.buy(item[5])

        print u"抢票开始..."
        self.btn_on_buy.Disable()
        for i in range(self.buyer_num):
            t = threading.Thread(target=th_buyer, name="BUYER_" + str(i))
            t.setDaemon(1)
            t.start()
            self.th_buyer.append(t)

        def chk_btn():
            while 1:
                num = 0
                for b in self.th_buyer:
                    if not b.isAlive():
                        num += 1
                if num == self.buyer_num:
                    self.th_buyer = []
                    self.btn_on_buy.Enable()
                    break
                time.sleep(1)
        self.th_chk_btn = threading.Thread(target=chk_btn, name="T_CHK_BTN")
        self.th_chk_btn.setDaemon(1)
        self.th_chk_btn.start()

    '''
    暂停购票按钮
    '''
    def off_buy(self, event):
        self.ui_grid.add_one_empty_row()
        print self.ui_grid.GetNumberRows()
        self.btn_on_buy.Enable()
        print u"停止抢票了"

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
                i = 0
                for row in csv_reader:
                    i += 1
                    if i == 1:
                        continue
                    self.ticket_queue.put(row)
                    self.ui_grid.add_one_row_data(name=row[0], state=u'待购票', price='0.00', pay_time_left='', info=row[5])
                f.close()
            except :
                wx.MessageBox(u"%s 文件格式错误"
                              % self.filename, "error tip",
                              style=wx.OK | wx.ICON_EXCLAMATION)

    def on_view(self, event):
        pass

    def on_close_window(self, event):
        self.Destroy()

