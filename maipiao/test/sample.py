# -*- coding:utf-8
import sys


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


red = Red()
green = Green()
xcolor = UnknownColor()

print 'red = ', Red.value()
print 'green = ', Green.value()
print 'xcolor =', UnknownColor.value()


