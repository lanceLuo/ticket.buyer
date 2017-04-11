# -*- coding:utf-8
import sys
import Queue

class Color(object):
    _color = (0, 0, 0);

    @classmethod
    def value(cls):
        if cls.__name__ == 'Red':
            cls._color = (255, 0, 0)

        elif cls.__name__ == 'Green':
            cls._color = (0, 255, 0)

        return cls._color


class Red(Color):
    pass


class Green(Color):
    pass


class UnknownColor(Color):
    pass


# red = Red()
# green = Green()
# xcolor = UnknownColor()
#
# print 'red = ', Red.value()
# print 'green = ', Green.value()
# print 'xcolor =', UnknownColor.value()

class A:
    a = {}
    def __init__(self):
        self.a = {}

a1 = A()
a2 = a1.a
a2["c"] = 1
print a1.a

