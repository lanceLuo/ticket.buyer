# -*- coding: utf-8 -*-

import wx
import os
import sys
from lib.YongleBuyer import YongleBuyer
from lib.BuyerGrid import *
from lib.MyPage import MyPage
from lib.LogOut import LogOut
import csv
import time
import Queue
import threading
import datetime
import re

MAX_WORKER_NUM = 5
EVT_LOGIN = 1
EVT_BUY_TICKET = 2


class MainFrame(wx.Frame):
    log_thread = []
    th_buyer = []  # 线程数
    filename = None
    worker_job_queue = Queue.Queue()

    def __init__(self, parent):
        self.stop_buy_ticket = False
        self.title = u"购票助手"
        self.tickets = []
        self.worker_poll = []
        wx.Frame.__init__(self, parent, wx.ID_ANY, self.title, size=(960, 600))
        self.SetMaxSize((960, 600))
        self.SetMinSize((960, 600))

        # 设置背景颜色
        self.SetBackgroundColour(wx.Colour(236, 233, 216))
        self.create_menu_bar()
        # 设置软件ICON
        self.SetIcon(wx.Icon(os.path.dirname(sys.argv[0]) + '/res/title.ico', wx.BITMAP_TYPE_ICO))
        self.ui_grid = SimpleGrid(self, self.tickets)
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
        sys.stdout = self.tip_log
        self.notebook_err = MyPage(self.notebook, 'err')
        self.notebook.AddPage(self.notebook_err, u"  错误信息  ")
        self.err_log = LogOut(self.notebook_err)
        sys.stderr = self.err_log
        for i in range(2):
            if i == 0:
                t = threading.Thread(target=self.tip_log.output, name="S_" + str(i))
            else:
                t = threading.Thread(target=self.err_log.output, name="S_" + str(i))
            t.setDaemon(1)
            t.start()
            self.log_thread.append(t)
        self.init_worker_poll()

    '''
    初始化线程池
    '''
    def init_worker_poll(self):
        for i in range(MAX_WORKER_NUM):
            worker = threading.Thread(target=self.do_worker, name="worker_" + str(i))
            worker.setDaemon(1)
            worker.start()
            self.worker_poll.append(worker)

    '''
    worker线程处理
    '''
    def do_worker(self):
        while True:
            if self.stop_buy_ticket:
                time.sleep(0.2)
                continue
            if self.worker_job_queue.qsize() > 0:
                try:
                    ticket, evt = self.worker_job_queue.get(False)
                    buyer = YongleBuyer(login_name=ticket["name"], password=ticket["password"], card_name=ticket["card_name"], id=ticket["id"],
                                        card_no=ticket["card_no"], self_name=ticket["self_take_name"], self_phone=ticket["self_take_phone"])
                    if evt == EVT_LOGIN:  # 登录
                        r = buyer.login()
                        self.login_callback(r, buyer.id)
                    elif evt == EVT_BUY_TICKET:  # 购票
                        if not ticket["begin_time"] or ticket["begin_time"] > time.time() - 0.05:  # 达到购票时间
                            r = buyer.buy(ticket["ticket_url"], ticket["price"])
                            self.after_buy_ticket(r, buyer.id)
                            time.sleep(0.4)
                        else:  # 未到购票时间重新入队列
                            self.worker_job_queue.put((ticket, evt), False)
                            time.sleep(0.05)
                    else:
                        pass
                except Queue.Empty:
                    time.sleep(0.1)
            else:
                time.sleep(0.1)


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
        print u"开始抢票了"
        exists_job = False
        for each in self.tickets:
            if not each["buy_status"]:
                self.worker_job_queue.put((each, EVT_BUY_TICKET))
                exists_job = True
        if exists_job:
            self.stop_buy_ticket = False
            self.btn_on_buy.Disable()
        else:
            print u"没有需要购票的信息"

    '''
    暂停购票按钮
    '''
    def off_buy(self, event):
        self.stop_buy_ticket = True
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
            # self.SetTitle(self.title + '--' + self.filename)
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

                    try:
                        ticket = {
                            "name": row[0],  # 账号
                            "password": row[1],  # 密码
                            "card_name": row[2],  # 身份证姓名
                            "card_no": row[3],  # 身份证卡号
                            "self_take_name": row[4],  # 自取姓名
                            "self_take_phone": row[5],  # 自取号码
                            "buy_times": 0,  # 购买次数
                            "ticket_url": row[6],  # 票务信息地址
                            "ticket_id": re.findall(r'ticket-(.+)\.html', row[6])[0],  # 票务ID
                            "price": [],  # 购买价格区间
                            "login_status": 0,  # 登录状态
                            "buy_times": 0,   # 购买次数
                            "buy_status": 0,  # 购买状态
                            "begin_time": 0,  # 开抢时间
                        }
                        if not ticket["name"]:
                            print u"账号不能为空[第{}行]".format(str(i))
                            continue
                        if not ticket["ticket_id"]:
                            print u"票务信息格式有错误[第{}行]".format(str(i))
                            continue
                        self.tickets.append(ticket)
                        ticket["id"] = self.ui_grid.add_one_row_data(ticket)
                        self.worker_job_queue.put((ticket, EVT_LOGIN), False)  # 入队列准备登录
                    except:
                        print u"数据格式有问题[第{}行]".format(str(i))

                f.close()
            except :
                wx.MessageBox(u"%s 文件格式错误"
                              % self.filename, "error tip",
                              style=wx.OK | wx.ICON_EXCLAMATION)

    '''
    登录后回调处理
    '''
    def login_callback(self, result, id):
        if result["code"] == 200:
            self.tickets[id]["login_status"] = 1
            self.ui_grid.set_login_status(id, True, None)
        else:
            self.ui_grid.set_login_status(id, False, result["msg"])

    '''
    抢票后回调处理
    '''
    def after_buy_ticket(self, result, id):
        self.ui_grid.set_buy_result(result)
        if result["code"] != 200:
            each = self.tickets[id]
            if result["code"] == 500:
                if not each.get("code_500", None):
                    each["code_500"] = 0
                each["code_500"] += 1
                if each["code_500"] >= 3:
                    each["code_500"] = 0
                    each["begin_time"] = time.time() + 1
            self.worker_job_queue.put((each, EVT_BUY_TICKET))  # 入队列准备购票
        else:
            self.tickets[id]["buy_status"] = 1

    def on_view(self, event):
        pass

    def on_close_window(self, event):
        self.Destroy()

