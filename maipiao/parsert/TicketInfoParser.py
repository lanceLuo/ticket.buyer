# -*- coding: utf-8

from HTMLParser import HTMLParser


class TicketInfoParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.tickets = []

    def handle_starttag(self, tag, attrs):
        def _attr(attrlist, attrname):
            for each in attrlist:
                if attrname == each[0]:
                    return each[1]
            return None
        if tag == 'li' and _attr(attrs, 'type') == 'price':
            self.tickets.append(attrs)

