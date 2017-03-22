# -*- coding: utf-8
import sys,os,types,pycurl,StringIO,random,re,copy,urllib

class downHtml:

    def __init__(self):
        self.REFERER= ''
        self.USERAGENT="Mozilla/5.0 (Windows NT 6.1; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0"
        self.HEADER=False
        self.COOKIE="D:/registration_robot/cookie.txt"
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
    
    def postCurl(self):
        self.POST=True
        self.DATA=""
        tmp={"token":1489469981706,"nationPerfix":86,"login_email":13040866253,"login_pwd":"Qaz123456"}
        for k in tmp:
            self.DATA = self.DATA + (k+"="+str(tmp[k])+"&")
        res = self.curl("https://secure.damai.cn/login.aspx?ru=https://www.damai.cn/sz/")


    def curl(self,url,errnum=0, jsonData=False):
        self.header=False
        
        try:
            c = pycurl.Curl()
        except:
            return False
        self.bh.truncate()
        c.setopt(pycurl.URL, url)    

        c.setopt(pycurl.HEADERFUNCTION, self.headerw)
        if jsonData:
            header=['Content-Type:application/json;charset=utf-8']
        else:
            header=["Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"]
        c.setopt(pycurl.HTTPHEADER, header)
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
            # print Data
            # return False
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


orderComfir="http://trade.damai.cn/multi/confirm?bef=&businessType=107001&cityId=906&commodity=2|11632542^1^8926022&oid=0&projectId=116632&ref=&sign=FC4B67D16E94C14E88CA58B98FEE068A&tid=53e383165d31ee459da90090cd5c739f31b4d87c9439ecfc23e54709f947469f38ca02e724df5cca04a7c1413387175b&tradePlatform=106002&tradeSubPlatform=0&tradeThreePlatfrom=0"
orderCreate="http://trade.damai.cn/multi/trans/submitOrderInfo"
url1="http://shopping.damai.cn/order.aspx?_action=Immediately&info=%2bb0inMKF1n2S9vl%2ffq9I1agfYzebN35Q";
if __name__=='__main__':
    handler = downHtml()
    # handler.curl(orderComfir)
    print handler.curl(url1)
    # handler.postCurl();
    # 确认订单
    # handler.DATA='{"sKULimit": [], "payKind": 1, "invoice": null, "insurance": null, "buyCommodityList": [{"batchID": "8938097", "cityID": 852, "buyNum": 1, "commodityGUID": "405013036"}], "tradeSubPlatform": 0, "commodityParams": "1|405013036^1^8938097", "projectId": 118744, "note": null, "frontPivilege": {"privilegeId": 0, "privilegeAmount": 0, "privilegeType": 0, "privilegeName": "", "providerId": "", "limitBank": 0, "flag": false, "groupId": "", "usable": 0}, "tid": "b5ea296998d91b1c7ebed3cd8c2cc0bd", "tradeThreePlatfrom": 0, "isVerification": "0", "orderId": 0, "businessType": "107001", "deliveryType": 2, "groupId": "852-2-3-1-27", "performId": 8938097, "tradePlatform": 106002, "payMethod": 0, "trader": {"userName": "luo", "idType": 0, "tel": "", "mobilePhone": "13164702267", "districtId": "281104", "countyName": "\u4e1c\u57ce\u533a", "idCard": "", "cityName": "\u5317\u4eac\u5e02", "countyId": "853", "nation": "", "cityId": "852", "prefix": 86, "provinceId": "851", "postcode": "", "districtName": "\u4e1c\u57ce\u533a \u5168\u5883", "email": "", "address": "\u65e0\u8be6\u7ec6\u5730\u5740", "provinceName": "\u5317\u4eac"}, "businessSubType": "1"}'
    # handler.POST=True
    # print handler.curl(orderCreate,0,True)
    # 