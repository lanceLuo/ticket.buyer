# -*- coding: utf-8 -*-
import csv
import time
import re
EVT_LOGIN = 1

class YongLe:

    def __init__(self, grid):
        self.grid = grid
        self.tickets = []

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
                        "begin_time": 0 if not row[6] else time.mktime(time.strptime(row[6][1:], '%Y-%m-%d %H:%M:%S')),
                    # 开抢时间
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
                    self.tickets.append(ticket)
                    ticket["id"] = self.ui_grid.add_one_row_data(ticket)
                    self.add_ticket_info(ticket["ticket_id"], ticket["ticket_url"])
                    self.worker_job_queue.put((ticket, EVT_LOGIN), False)  # 入队列准备登录
                except:
                    print u"数据格式有问题[第{}行]".format(str(i))
                f.close()
                return True
        except:
            f.close()
            return False
