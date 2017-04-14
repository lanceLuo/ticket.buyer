# -*- coding:utf-8
import time
import Queue
import datetime
import threading
import os
import sys
import copy


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
            s = self.stdout.get(False)
            if self.N > 40960:
                self.N = 0
                self.obj.Box.Clear()
            # self.obj.Box.AppendText(s)
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