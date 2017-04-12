# -*- coding: utf-8
from HTMLParser import HTMLParser


class TicketInfoParser(HTMLParser):

    def __init__(self):
        HTMLParser.__init__(self)
        self.tickets = []
        self.title = ''
        self.in_title = False
        self.exist_error = False
        self.in_error = False
        self.error_msg = ""

    def handle_starttag(self, tag, attrs):
        def _attr(attrlist, attrname):
            for each in attrlist:
                if attrname == each[0]:
                    return each[1]
            return None
        if tag == 'li' and _attr(attrs, 'type') == 'price' and _attr(attrs, 'systime'):
            css_cls = _attr(attrs, 'class')
            ticket = {
                'productid': _attr(attrs, 'productid'),
                'ticketid': _attr(attrs, 'p'),
                'price': _attr(attrs, 'rel'),
                'over': True if css_cls and isinstance(css_cls, str) and 'over' in css_cls else False
            }
            self.tickets.append(ticket)
        elif tag == 'title':
            self.in_title = True
        elif tag == 'div' and _attr(attrs, 'id') == 'error':
            self.exist_error = True
        elif self.exist_error and tag == 'span':
            self.in_error = True

    def handle_data(self, data):
        if self.in_title:
            self.title = data
        elif self.in_error:
            if not isinstance(data, unicode):
                data = unicode(data, "utf-8")
            self.error_msg = data

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        elif self.in_error and tag == 'span':
            self.in_error = False
