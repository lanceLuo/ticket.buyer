# -*- coding:utf-8
import json

ORDER_CREATE_DATA={
  "tid":"b5ea296998d91b1c7ebed3cd8c2cc0bd",
  "orderId":0,
  "groupId":"852-2-3-1-27",
  "projectId":118744,
  "performId":8938097,
  "deliveryType":2,
  "payKind":1,
  "trader":{
    "userName":"luo",
    "prefix":86,
    "nation":"",
    "mobilePhone":"13164702267",
    "tel":"",
    "email":"",
    "postcode":"",
    "idCard":"",
    "provinceName":u"北京",
    "cityName":u"北京市",
    "countyName":u"东城区",
    "districtName":u"东城区 全境",
    "address":u"无详细地址",
    "provinceId":"851",
    "cityId":"852",
    "countyId":"853",
    "districtId":"281104",
    "idType":0,
  },
  "sKULimit":[],
  "frontPivilege":{
    "groupId":"",
    "limitBank":0,
    "privilegeAmount":0,
    "privilegeId":0,
    "privilegeName":"",
    "privilegeType":0,
    "providerId":"",
    "usable":0,
    "flag":False,
  },
  "insurance":None,
  "invoice":None,
  "note":None,
  "buyCommodityList":[
  	{
  		"batchID":"8938097",
  		"buyNum":1,
  		"cityID":852,
  		"commodityGUID":"405013036"
  	}
  ],
  "commodityParams":"1|405013036^1^8938097",
  "payMethod":0,
  "businessType":"107001",
  "businessSubType":"1",
  "tradePlatform":106002,
  "tradeSubPlatform":0,
  "tradeThreePlatfrom":0,
  "isVerification":"0"
}

# print json.dumps(ORDER_CREATE_DATA)