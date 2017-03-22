# -*- coding: utf-8
import sys,os,types,pycurl,StringIO,random,re,copy,urllib

class downHtml:

    def __init__(self):
        self.REFERER= ''
        self.USERAGENT="Mozilla/5.0 (Windows NT 6.1; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0"
        self.HEADER=False
        self.COOKIE=False
        self.POST=False
        self.DATA=False
        self.HEADERCONTENT=False
        self.FILETYPE=False 
        self.bh=StringIO.StringIO()


    def read(self,path,mod='r'):
        if not path:
            return False
        file=open(path,mod)
        strline=file.read()
        return strline
    
    def headerw(self,buf):
        self.bh.truncate()
        self.bh.write(str(buf))
    def replace(self,ReString,ArrList,StrCode=False):
    
        if len(ReString)==0:
            return ''
        ReString=ReString.strip()
        if len(ArrList)==0:
            return ReString
        
        if len(ArrList)==2:
            if 'str' in str(type(ArrList[0])) and 'str' in str(type(ArrList[1])):
    
                r=re.compile(ArrList[0],re.I|re.S|re.M)
                return r.sub(ArrList[1],ReString)
                
        for i in ArrList:
    
            r=re.compile(i[0],re.I|re.S|re.M)
            ReString=r.sub(i[1],ReString)
    
        return ReString

    def writes(self,strA,filename,mod='wb'):
        try:
            if not filename:
                return False
            file=open(filename,mod)
            file.write(strA)
           
            file.close()
            
        except:
            return False
        return True
    def iconv(self,code,newcode,str):
        try:
            out=unicode(str,code,'ignore')
            outgbk=out.encode(newcode,'ignore')
            return outgbk
        except:
            return str
    
    def curl(self,url,errnum=0):
        self.header=False
        
        try:
            c = pycurl.Curl()
        except:
            return False
        self.bh.truncate()
        c.setopt(pycurl.URL, url)    
     

        c.setopt(pycurl.HEADERFUNCTION, self.headerw)
        c.setopt(pycurl.HTTPHEADER, ["Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"])
        b = StringIO.StringIO()
        c.setopt(pycurl.WRITEFUNCTION, b.write)
        c.setopt(pycurl.FOLLOWLOCATION, 1)

        c.setopt(pycurl.SSL_VERIFYPEER, 0)   
        c.setopt(pycurl.SSL_VERIFYHOST, 0)
        
        c.setopt(pycurl.ENCODING, "gzip,deflate,sdch")
 
        c.setopt(pycurl.USERAGENT, self.USERAGENT)
        if self.REFERER:
            c.setopt(pycurl.REFERER, self.REFERER)   
 
 
        if self.COOKIE:
            c.setopt(pycurl.COOKIEFILE, self.COOKIE)
            c.setopt(pycurl.COOKIEJAR, self.COOKIE)
        if self.POST:        
            if self.DATA:
                Data=self.DATA
            else: 
                Links=url.split('?',1)
                if len(Links)==2:
                    Data=Links[1]
                else:
                    Data=''
            c.setopt(pycurl.POST, 1)
            c.setopt(pycurl.POSTFIELDS, Data)
            self.POST=0
        try:
            c.perform()
        except:
            return False
 
        self.HEADERCONTENT=self.bh.getvalue()
        try:
           
            head=c.getinfo(c.HTTP_CODE) 
            self.header=head
            C_TYPE=c.getinfo(c.CONTENT_TYPE)
            self.C_TYPE=C_TYPE
            
            value=b.getvalue()
            #print value
            c.close()
            if head>=400:
                return False
        
        except pycurl.error, e:

            head=c.getinfo(c.HTTP_CODE)
            self.header=head
 
            try:
                c.close()
            except:
                pass
 
 
            return False
            
        self.Html=value
        return value
    
 
if __name__=='__main__':
    pass