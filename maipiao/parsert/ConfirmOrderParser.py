# -*- coding: utf-8

from HTMLParser import HTMLParser
import re


class ConfirmOrderParser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.in_form = False
        self.form_post_url = None
        self.form_post_dict = {}

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
            if name.find('['):
                k = re.findall(r"(.+)\[", name)
                v = re.findall(r".+\['(.+)'\]", name)
                if k:
                    self.form_post_dict[name][k[0]] = v[0]
            else:
                self.form_post_dict[name] = value
        else:
            pass

    def handle_endtag(self, tag):
        if tag == 'form' and self.in_form:
            self.in_form = False