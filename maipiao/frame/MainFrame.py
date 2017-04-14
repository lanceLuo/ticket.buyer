# -*- coding: utf-8 -*-

import wx
import os
import sys
from lib.YongleBuyer import YongleBuyer
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
    log_thread = []
    th_buyer = []  # 线程数
    filename = None
    worker_job_queue = Queue.Queue()

    def __init__(self, parent):
        self.stop_buy_ticket = False
        self.title = u"购票助手"
        self.tickets = []
        self.tickets_info = {}
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
        self.init_worker_poll()
        self.YongLe = YongLe(self.ui_grid)

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
                    buyer = YongleBuyer(ticket)
                    if evt == EVT_LOGIN:  # 登录
                        r = buyer.login()
                        self.login_callback(r, buyer.id)
                    elif evt == EVT_BUY_TICKET:  # 购票
                        if not ticket["begin_time"] or time.time() - ticket["begin_time"] > 0.05:  # 达到购票时间
                            r = buyer.buy(ticket["ticket_url"], ticket["price"], ticket["buy_num"], self.tickets_info[ticket['ticket_id']]['tickets'])
                            self.after_buy_ticket(r, buyer.id)
                            time.sleep(0.4)
                        else:  # 未到购票时间重新入队列
                            self.worker_job_queue.put((ticket, evt), False)
                            time.sleep(0.05)
                    elif evt == EVT_UPDATE_TICKET_INFO:  # 更新票务信息
                        if time.time() - ticket["update_time"] < 0:  # 未达到时间
                            self.worker_job_queue.put((ticket, evt), False)
                        else:
                            is_success, data = buyer.get_ticket_info(ticket["ticket_url"])
                            if is_success:
                                print u"票务信息已更新-{}".format(data["title"])
                                self.tickets_info[ticket["ticket_id"]]["tickets"] = data["tickets"]
                                self.tickets_info[ticket["ticket_id"]]["title"] = data["title"]
                            else:
                                print u"{}{}".format(data, ticket["ticket_url"])
                            ticket["update_time"] += 1
                            self.worker_job_queue.put((ticket, evt))
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
            file_path = dlg.GetPath()
            if not self.YongLe.open_file(file_path):
                wx.MessageBox(u"{} 文件格式错误".format(file_path), "error tip",
                              style=wx.OK | wx.ICON_EXCLAMATION)
        dlg.Destroy()

    def add_ticket_info(self, ticket_id, ticket_url):
        if not self.tickets_info.get(ticket_id, None):
            ticket = {
                "ticket_id": ticket_id,
                "ticket_url": ticket_url,
                "tickets": {},
                "title": None,
                "update_time": time.time()
            }
            self.tickets_info[ticket_id] = ticket
            self.worker_job_queue.put((ticket, EVT_UPDATE_TICKET_INFO), False)  # 入队列准备登录


    '''
    登录后回调处理
    '''
    def login_callback(self, result, id):
        if result["code"] == 200:
            self.tickets[id]["login_status"] = 1
            self.ui_grid.set_login_status(id, True, None)
        else:
            for i in self.tickets:
                if i['id'] == id:
                    self.worker_job_queue.put((i, EVT_LOGIN), False)
                    break
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
                    each["begin_time"] = time.time() + 0.2
            self.worker_job_queue.put((each, EVT_BUY_TICKET))  # 入队列准备购票
        else:
            self.tickets[id]["buy_status"] = 1
        print result["msg"]

    def on_view(self, event):
        pass

    def on_close_window(self, event):
        self.Destroy()

