#coding=utf-8
from distutils.core import setup
import py2exe
import glob
#
libRootPath = r'D:\Python27'

data_files = [
        # 'D:/buy.ico',
          ]

setup(
    windows=[
        {
            "script": 'D:/code/python/ticket.buyer/maipiao/TicketApp.py',
            # "icon_resources": [(1, "buy.ico")]
        }],
    options={
        'py2exe':
                   {
                       'dll_excludes':['MSVCP90.dll', 'numpy-atlas.dll'],
                        "includes": [],
                        'excludes': ['_gtkagg', '_tkagg', '_agg2', '_cairo', '_cocoaagg', '_fltkagg', '_gtk', '_gtkcairo', ]
                   }
    },
    data_files=data_files
)
