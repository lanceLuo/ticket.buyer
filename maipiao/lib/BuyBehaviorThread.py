# -*- coding: utf-8 -*-
import Queue
from threadpool import *

pool = ThreadPool(poolsize)
requests = makeRequests(some_callable, list_of_args, callback)
[pool.putRequest(req) for req in requests]
pool.wait()