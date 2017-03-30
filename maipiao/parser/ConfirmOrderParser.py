# -*- coding: utf-8

from HTMLParser import HTMLParser
import re


class ConfirmOrderParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.in_form = False
        self.form_post_url = None
        self.form_post_dict = {}
        self.order_source_val = None
        self.address_id_list = []
        self.in_address_tag = False

    def handle_starttag(self, tag, attrs):
        def _attr(attrlist, attrname):
            for each in attrlist:
                if attrname == each[0]:
                    return each[1]
            return None
        if tag == 'form' and _attr(attrs, 'id') == 'orderForm':
            self.in_form = True
            self.form_post_url = _attr(attrs, 'action')
        elif self.in_form and tag == 'input':
            name = _attr(attrs, 'name')
            value = _attr(attrs, 'value')
            self.form_post_dict[name] = value
        elif tag == 'input' and _attr(attrs, 'id') == 'orderSourceVal':
            self.order_source_val = _attr(attrs, 'value')
        elif tag == 'ul' and _attr(attrs, 'id') == 'cusAddress':
            self.in_address_tag = True
        elif tag == 'li' and _attr(attrs, 'aid'):
            self.address_id_list.append({'addressid': _attr(attrs, 'aid')})
        else:
            pass

    def handle_endtag(self, tag):
        if tag == 'form' and self.in_form:
            self.in_form = False
        elif tag == 'ul' and self.in_address_tag:
            self.in_address_tag = False
