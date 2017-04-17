import sys
import os
import datetime
import Queue
import time
import json
import urllib
json.dumps(["aaa"])

total_time = 121212
http_code = 200
url = "www.http"
data = {"a":1}
msg = u"[URL] {} | [CODE] {} | [TOTAL_TIME] {} [PARAMS] {} | POST"\
                    .format(url, str(http_code), str(total_time), urllib.urlencode(data))

print msg