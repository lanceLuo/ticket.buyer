# -*- coding: utf-8 -*-
import codecs
import csv
import time
import re
import os
import sys
import Queue
import threading
import datetime
from lib.YongleBuyer import YongleBuyer

EVT_LOGIN = 1
EVT_BUY_TICKET = 2
EVT_UPDATE_TICKET_INFO = 3
MAX_WORKER_NUM = 10


class YongLe(object):

    def __init__(self, grid):
        self.grid = grid
        self.tickets = []
        self.stop_buy_ticket = False
        self.worker_job_queue = Queue.Queue()
        self.worker_login_queue = Queue.Queue()
        self.worker_ticket_update_queue = Queue.Queue()
        self.worker_poll = []
        self.tickets_info = {}
        self.init_worker_poll()
        self.worker_login = threading.Thread(target=self.do_login, name="worker_login")
        self.worker_login.setDaemon(1)
        self.worker_login.start()
        self.worker_update_ticket = threading.Thread(target=self.do_update_ticket, name="worker_update_ticket")
        self.worker_update_ticket.setDaemon(1)
        self.worker_update_ticket.start()

    def do_login(self):
        while True:
            if self.worker_login_queue.empty():
                time.sleep(0.5)
                continue
            try:
                row_id = self.worker_login_queue.get(False)
                ticket = self.tickets[row_id]
                result = YongleBuyer(ticket).login()
                if result["code"] == 200:
                    ticket["login_status"] = 1
                    self.grid.set_login_status(row_id, True, None)
                else:
                    self.grid.set_login_status(row_id, False, result["msg"])
                    self.worker_login_queue.put(row_id)
            except Queue.Empty:
                pass

    def do_update_ticket(self):
        while True:
            if self.worker_ticket_update_queue.empty():
                time.sleep(0.5)
                continue
            try:
                ticket_id,update_time = self.worker_ticket_update_queue.get(False)
                if time.time() >= update_time:
                    status, data = YongleBuyer.get_ticket_info(ticket_id)
                    if status:
                        self.tickets_info[ticket_id] = data
                        self.worker_ticket_update_queue.put((ticket_id, update_time + 1))
                    else:
                        print u"获取不到票务信息--{}".format(data)
                        time.time(0.2)
                        self.worker_ticket_update_queue.put((ticket_id, update_time))
                else:
                    self.worker_ticket_update_queue.put((ticket_id,update_time))

            except Queue.Empty:
                pass

    '''
    '''
    def open_file(self, file_path):
        try:
            f = open(file_path)
        except:
            return False
        try:
            csv_reader = csv.reader(f)
            i = 0
            for row in csv_reader:
                i += 1
                if i == 1:
                    continue
                try:
                    ticket = {
                        "name": row[0][1:],  # 账号
                        "password": row[1][1:],  # 密码
                        "card_name": row[2][1:],  # 身份证姓名
                        "card_no": row[3][1:],  # 身份证卡号
                        "price": [] if len(row[4][1:].split(",")) != 2 else row[4][1:].split(","),  # 购买价格区间
                        "buy_num": 1 if not row[5][1:] else row[5][1:],  # 购票张数
                        "begin_time": 0 if not row[6] else time.mktime(time.strptime(row[6][1:], '%Y-%m-%d %H:%M:%S')), # 开抢时间
                        "ticket_url": row[7][1:],  # 票务信息地址
                        "ticket_id": re.findall(r'ticket-(.+)\.html', row[7][1:])[0],  # 票务ID
                        "self_take_name": None,  # 自取姓名
                        "self_take_phone": None,  # 自取号码
                        "buy_times": 0,  # 购买次数
                        "login_status": 0,  # 登录状态
                        "buy_status": 0,  # 购买状态
                    }

                    if not ticket["name"]:
                        continue
                    if not ticket["ticket_id"]:
                        print u"票务信息格式有错误[第{}行]".format(str(i))
                        continue
                    # 去重
                    for o in self.tickets:
                        if o["name"] == ticket["name"] and o["ticket_id"] == ticket["ticket_id"]:
                            continue
                    ticket["id"] = self.grid.add_one_row_data(ticket)
                    self.tickets.append(ticket)
                    self.worker_ticket_update_queue.put((ticket["ticket_id"], time.time()))  # 添加票务信息
                    self.worker_login_queue.put(ticket["id"])
                except:
                    print u"数据格式有问题[第{}行]".format(str(i))
                f.close()
                return True
        except:
            f.close()
            return False

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
                time.sleep(0.1)
                continue
            if self.worker_job_queue.qsize() > 0:
                try:
                    ticket = self.worker_job_queue.get(False)
                    if not ticket["begin_time"] or time.time() - ticket["begin_time"] > 0.05:  # 达到购票时间
                        buyer = YongleBuyer(ticket)
                        r = buyer.buy(ticket["ticket_url"], ticket["price"], ticket["buy_num"], self.tickets_info[ticket['ticket_id']]["tickets"])
                        self.after_buy_ticket(r, buyer.id)
                        time.sleep(0.2)
                    else:  # 未到购票时间重新入队列
                        self.worker_job_queue.put(ticket, False)
                        time.sleep(0.05)
                except Queue.Empty:
                    time.sleep(0.1)
            else:
                time.sleep(0.1)

    '''

    '''
    def on_buy(self):
        print u"开始抢票了"
        exists_job = False
        for each in self.tickets:
            if not each["buy_status"]:
                self.worker_job_queue.put(each)
                exists_job = True
        if exists_job:
            self.stop_buy_ticket = False
            return True
        else:
            print u"没有需要购票的信息"
            return False

    def off_buy(self):
        pass

    def save(self):
        csvfile = file(os.path.dirname(sys.argv[0]) + u'/data/购票成功记录-{}.csv'.format(datetime.datetime.now().strftime('%y_%m_%d_%H_%M_%S')), 'wb')
        csvfile.write(codecs.BOM_UTF8)
        writer = csv.writer(csvfile)
        writer.writerow([u'账号', u'密码'])
        data = []
        for i in self.tickets:
            if i["buy_status"]:
                data.append([i["name"], i["password"]])
        if data:
            writer.writerows(data)
        csvfile.close()

    '''
    抢票后回调处理
    '''
    def after_buy_ticket(self, result, id):
        self.grid.set_buy_result(result)
        if result["code"] != 200:
            each = self.tickets[id]
            if result["code"] == 500:
                if not each.get("code_500", None):
                    each["code_500"] = 0
                each["code_500"] += 1
                if each["code_500"] >= 3:
                    each["code_500"] = 0
                    each["begin_time"] = time.time() + 0.2
            self.worker_job_queue.put(each)  # 入队列准备购票
        else:
            self.tickets[id]["buy_status"] = 1
        print result["msg"]