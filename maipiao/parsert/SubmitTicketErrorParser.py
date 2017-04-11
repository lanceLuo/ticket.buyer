# -*- coding: utf-8

from HTMLParser import HTMLParser


class SubmitTicketErrorParser(HTMLParser):

    def __init__(self):
        HTMLParser.__init__(self)
        self.error_div = False
        self.error_span = False
        self.error_msg = ''

    def handle_starttag(self, tag, attrs):
        def _attr(attrlist, attrname):
            for each in attrlist:
                if attrname == each[0]:
                    return each[1]

        if tag == 'span' and _attr(attrs, "class") == "f18":
            self.error_span = True
        else:
            self.error_span = False

    def handle_data(self, data):
        if self.error_span:
            self.error_msg = unicode(data.strip("\r\n"), 'utf-8')

    def handle_endtag(self, tag):
        if tag == 'span':
            self.error_span = False
