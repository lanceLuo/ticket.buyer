# -*- coding:utf-8
# import urlparse
# import urllib
#
# def compose_debug_url(input_url):
#     input_url_parts = urlparse.urlsplit(input_url)
#     input_query = input_url_parts.query
#     input_query_dict = urlparse.parse_qsl(input_query)
#     print input_query_dict
#     modified_query_dict = dict(input_query_dict.items() + [('debug', 'sp')])
#     modified_query = urllib.urlencode(modified_query_dict)
#     modified_url_parts = (
#       input_url_parts.scheme,
#       input_url_parts.netloc,
#       input_url_parts.path,
#       modified_query,
#       input_url_parts.fragment
#     )
#
#     modified_url = urlparse.urlunsplit(modified_url_parts)
#
#     return modified_url
#
#
#
# print compose_debug_url('http://www.example.com/content/page?name=john&age=35')
# print compose_debug_url('http://www.example.com/')
a = [1,2,3]
t = a.pop(0)
print t
print a