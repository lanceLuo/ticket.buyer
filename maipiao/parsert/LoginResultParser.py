# -*- coding: utf-8

from HTMLParser import HTMLParser


class LoginResultParser(HTMLParser):

    def __init__(self):
        HTMLParser.__init__(self)
        self.login_err_msg = ""
        self.in_err_box = False

    def handle_starttag(self, tag, attrs):
        def _attr(attrlist, attrname):
            for each in attrlist:
                if attrname == each[0]:
                    return each[1]

        if tag == 'span' and _attr(attrs, 'id') == 'msg':
            val = _attr(attrs, 'class')
            if val and isinstance(val, str) and val.find('login_error') != -1:
                self.in_err_box = True

    def handle_data(self, data):
        if self.in_err_box:
            if not isinstance(data, unicode):
                data = unicode(data.strip("\r\n"), "utf-8")
            self.login_err_msg = data

    def handle_endtag(self, tag):
        if self.in_err_box and tag == 'span':
            self.in_err_box = False
