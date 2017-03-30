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
        if tag == 'li' and _attr(attrs, 'type') == 'price' and _attr(attrs, 'systime'):
            css_cls = _attr(attrs, 'class')
            ticket = {
                'productid': _attr(attrs, 'productid'),
                'ticketid': _attr(attrs, 'p'),
                'price': _attr(attrs, 'title'),
                'over': True if css_cls and isinstance(css_cls, str) and 'over' in css_cls else False
            }
            self.tickets.append(ticket)

