
$(function(){
	//-----------------------------------验证手机开始---------------------------------------------------------//
	function validatePhone(phone){
		var phoneFlag = 0;//设置手机验证标识
		var phoneVal = phone;
		//var ph_re = /^(1(([35][0-9])|(47)|[8][012356789]))\d{8}$/;//验证手机正则表达式
		var ph_re = /^[1][3-8]\d{9}$|^([5|6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;//验证手机正则表达式
		var gotPhone_re=/^([5|6|9])\d{7}|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;//港澳台手机号正则表达式
		if($.trim(phoneVal)==""){//非空
			phoneFlag = 1;
		}
		else if(!ph_re.test(phone)){
			phoneFlag = 2;
		}else if(gotPhone_re.test(phone)){
			phoneFlag = 3;
		}
		return phoneFlag;
	}
	//-----------------------------------验证手机结束---------------------------------------------------------//
	//-----------------------------------验证证件号开始---------------------------------------------------------//
	//验证身份证
	function validateCard(card){
		var str = card;
		var City = {11:"\u5317\u4eac", 12:"\u5929\u6d25", 13:"\u6cb3\u5317", 14:"\u5c71\u897f", 15:"\u5185\u8499\u53e4", 21:"\u8fbd\u5b81", 22:"\u5409\u6797", 23:"\u9ed1\u9f99\u6c5f ", 31:"\u4e0a\u6d77", 32:"\u6c5f\u82cf", 33:"\u6d59\u6c5f", 34:"\u5b89\u5fbd", 35:"\u798f\u5efa", 36:"\u6c5f\u897f", 37:"\u5c71\u4e1c", 41:"\u6cb3\u5357", 42:"\u6e56\u5317 ", 43:"\u6e56\u5357", 44:"\u5e7f\u4e1c", 45:"\u5e7f\u897f", 46:"\u6d77\u5357", 50:"\u91cd\u5e86", 51:"\u56db\u5ddd", 52:"\u8d35\u5dde", 53:"\u4e91\u5357", 54:"\u897f\u85cf ", 61:"\u9655\u897f", 62:"\u7518\u8083", 63:"\u9752\u6d77", 64:"\u5b81\u590f", 65:"\u65b0\u7586", 71:"\u53f0\u6e7e", 81:"\u9999\u6e2f", 82:"\u6fb3\u95e8", 91:"\u56fd\u5916 "};
		var iSum = 0;
		var cardFlag = 0;
		str = str.replace("\uff38", "X");
		str = str.replace("x", "X");
		
		if (str.length == 0 ){
			return cardFlag = 1;
   		}
		if (!/^\d{17}(\d|x)$/i.test(str)) {
			return cardFlag = 2;
		}
		str = str.replace(/x$/i, "a");
		if (City[parseInt(str.substr(0, 2))] == null) {
			return cardFlag = 2;
		}
		sBirthday = str.substr(6, 4) + "-" + Number(str.substr(10, 2)) + "-" + Number(str.substr(12, 2));
		var d = new Date(sBirthday.replace(/-/g, "/"));
		if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
			return cardFlag = 2;
		}
		for (var i = 17; i >= 0; i--) {
			iSum += (Math.pow(2, i) % 11) * parseInt(str.charAt(17 - i), 11);
		}
		if (iSum % 11 != 1) {
			return cardFlag = 2;
		}
		return cardFlag;
	}
	//验证护照号
	function validatePersonCard(card){
		var cardFlag = 0;//设置护照验证标识
		var cardVal = card;
		//护照正则表达式
		isIDCard=/(^[A-Za-z0-9]+$)/;
		if($.trim(cardVal)==""){//非空
			cardFlag = 1;
    	}else if(!isIDCard.test(cardVal)){
			cardFlag = 2;
		}
		return cardFlag;
	}
	//-----------------------------------验证证件号开始---------------------------------------------------------//
	
	//上门自取用户信息校验失去焦点开始
	$("#doorUserName").blur(function(){
		var doorUserName = $("#doorUserName").val();
		//用户名为空
		if($.trim(doorUserName) == ""){
			$('#selfGetNameTip').html("<span class='red'>真实姓名不能为空!</span>");
		}else if(verifyName(doorUserName)!=0){
			$('#selfGetNameTip').html("<span class='red'>姓名格式错误!</span>");
		}else{
			$('#selfGetNameTip').html("");
		}
	});
	
	$("#doorUserPhone").blur(function(){
		var doorUserPhone = $("#doorUserPhone").val();
		var phoneFlag = validatePhone(doorUserPhone);
		if(phoneFlag == 1){
			$('#selfGetPhoneTip').html("<span class='red'>手机号码不能为空!</span>");
		}else if(phoneFlag == 2){
			$('#selfGetPhoneTip').html("<span class='red'>手机号码格式不正确!</span>");
		}else{
			$('#selfGetPhoneTip').html("");
		}
	});
	
	//上门自取用户信息校验失去焦点结束
	//发票手机号失去焦点
	$("#userDigitalidPhone").blur(function(){
		var userDigitalidPhone = $("#userDigitalidPhone").val();
		var phoneFlag = validatePhone(userDigitalidPhone);
		if(phoneFlag == 1){
			$('#selfGetPhoneTipDigitalid').html("<span class='red' style='padding-left: 0px;'><i class='tsyy'>手机号码不能为空!</i></span>");
		}else if(phoneFlag == 2){
			$('#selfGetPhoneTipDigitalid').html("<span class='red' style='padding-left: 0px;'><i class='tsyy'>手机号码格式不正确!</i></span>");
		}else{
			$('#selfGetPhoneTipDigitalid').html("");
		}
	});
	
	//电子票用户信息校验失去焦点开始
	$("#eTicketPhone").blur(function(){
		var eTicketPhone = $("#eTicketPhone").val();
		var phoneFlag = validatePhone(eTicketPhone);
		if(phoneFlag == 1){
			$('#eTicketPhoneTip').html("<span class='red'>手机号码不能为空!</span>");
		}else if(phoneFlag == 2){
			$('#eTicketPhoneTip').html("<span class='red'>手机号码格式不正确!</span>");
		}else{
			$('#eTicketPhoneTip').html("");
		}
	});
	
	$("#eTicketName").blur(function(){
		var eTicketName = $("#eTicketName").val();
		//用户名为空
		if($.trim(eTicketName) == ""){
			$('#eTicketNameTip').html("<span class='red'>真实姓名不能为空!</span>");
		}else{
			$('#eTicketNameTip').html("");
		}
	});
	
	$("#eTicketCard").blur(function(){
		var eTicketCard = $("#eTicketCard").val();
		var cardFlag = validateCard(eTicketCard);
    	if(cardFlag == 1){
    		$('#eTicketCardTip').html("<span class='red'>身份证号不能为空!</span>");
    	}else if(cardFlag == 2){
    		$('#eTicketCardTip').html("<span class='red'>身份证号码不正确!</span>");
    	}else{
    		$('#eTicketCardTip').html("");
    	}
	});
	
	//电子票用户信息校验失去焦点结束
	//服务条款点击
	$("#iAgreeClause").click(function(){
		if($(this).attr("checked") == undefined){
			$("#orderSureError").show();
			$("#errorMsg").html("暂不能提交订单！请同意服务条款。")
		}else if($(this).attr("checked") == "checked"){
			$("#orderSureError").hide();
			$("#errorMsg").html("")
		}
	});
	
	//提交生成订单
	$("#saveOrder").click(function(){
		var flag  = saleUsable();//验证促销
		if(flag == 0){
			//促销活动验证失败
			return;
		}
		var discountdetailid = $('input:radio[name="bank"]:checked').val();
		$("#discountdetailid").val(discountdetailid);
		//验证是否勾选服务条款开始
		if($("#iAgreeClause").attr("checked") == undefined){
			$("#orderSureError").show();
			$("#errorMsg").html("暂不能提交订单！请同意服务条款。")
			return;
		}
		//验证是否勾选服务条款结束
		
		//验证实名购买开始
		var truebuy = $("#truebuy").val(); //获取实名购买参数 0为不是 1为是
		//验证多张证件信息开始
		var cardInfo = new Array();
		//存储信息的数组
		var cardnos = "";
		if(truebuy == 1){
			var flagCardInfo=true;
			var flagCardInfos=true;
			var warninfo = true;
			var flagCardName = true; //证件对应姓名是否合法
			var flag;
			var num;
			var cardtype;
			var cardno;
			var seatinfo;
			var seatinfoid;
			var cardname;
			var productId = $("#productid").val();
			$(".seatcardnumname").each(function(i){
				num = i;
				cardtype = $("#cardtype"+i).val();
				cardno = $("#cardno"+i).val();
				seatinfo = $("#seat").text();
				seatinfoid = $("#seatinfoid"+i).val();
				cardname = $("#cardname"+i).val();
		        if($.trim(cardname) == ""){
		        	$("#cardtypewarn"+num).html("<span class='red'>姓名不能为空!</span>");
		        	flagCardName = false;     
		        }else if(verifyName(cardname) != 0){
	            	$("#cardtypewarn"+num).html("<span class='red'>姓名格式错误!</span>");
	            	flagCardName = false;
	            }
	            if(flagCardName){
	            	var url = getPath()+"/ajax/findCardnoisExistNew?productId="+productId+"&cardno="+cardno+"&cardtype="+cardtype;
	            	$.ajax({
	        			type:"post",
	        			url:url,
	        			dataType:"json",
	        			async : false,
	        			success:function(data){
		    				if(data.flag == 0){
		            			$("#cardtypewarn"+num).html("<span class='red'>"+data.msg+"</span>");
		            			flagCardName = false;
		            		     return ;
		            		}else{
		            		     $("#cardtypewarn"+num).html("");
		            		     flagCardName = true;
		            		} 
		              	},
		    			error:function(){
		    				flagCardName = false;
	            		     return ;
		    			}
		            });
	            }				
					cardInfo[i] = cardno;
					cardnos+=cardtype+":"+cardno+":"+cardname+";";
			});
			
			//身份信息是否相等
			for(var i=0;i<cardInfo.length-1;i++){
				for(var j=i+1;j<cardInfo.length;j++){
					if(cardInfo[i]==cardInfo[j]){
						flagCardInfos = false;
					}
				}
			}
			flag = flagCardInfo && flagCardInfos;
			if(flag){
				$("#orderSureError").hide();
				$("#errorMsg").html("");
			}else{
				$("#orderSureError").show();
				if(!flagCardInfo){
					$("#errorMsg").html("暂不能提交订单！请检查您填写的证件信息。");
				}else if(!flagCardInfos){
					$("#errorMsg").html("暂不能提交订单！不能使用相同的证件号码。");
				}
				return;
			}
			
			if(flagCardName){
				$("#orderSureError").hide();
				$("#errorMsg").html("");
			}else{
				$("#orderSureError").show();
				$("#errorMsg").html("暂不能提交订单！证件格式有误。")
				return;
			}
		}
		//验证实名购买结束
		//提交订单前的验证开始
		var val=$('input:radio[name="sendStyle"]:checked').val();
		//验证快递配送
		if(val==1){
			var addressId = $("#addressId").val();
			if(addressId == null ||addressId == "" || addressId == undefined || addressId == 0){
				//未选中配送地址
				$("#orderSureError").show();
				$("#errorMsg").html("暂不能提交订单！请先添加您的收货地址。");
				return;
			}
			if($('input:radio[name="address"]:checked').val()==undefined ){
				//未选中配送地址
				$("#orderSureError").show();
				$("#errorMsg").html("暂不能提交订单！请检查您填写的收货人信息。");
				return;
			}
		}//验证上门自取
		else if(val==2){
			var doorUserName = $("#doorUserName").val();
			var doorUserPhone = $("#doorUserPhone").val();
			var phoneFlag = validatePhone($("#doorUserPhone").val());
			//用户名为空
			if($.trim(doorUserName) == ""){
				$('#selfGetNameTip').html("<span class='red'>真实姓名不能为空!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("暂不能提交订单！请检查您填写的收货人信息。");
				return;
			}else if(verifyName(doorUserName)!=0){
				$('#selfGetNameTip').html("<span class='red'>姓名格式错误!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("暂不能提交订单！请检查您填写的收货人信息。");
				return;
			}else{
				$('#selfGetNameTip').html("");
			}
        	if(phoneFlag == 1){
        		$('#selfGetPhoneTip').html("<span class='red'>手机号码不能为空!</span>");
        		$("#orderSureError").show();
    			$("#errorMsg").html("暂不能提交订单！请检查您填写的收货人信息。")
        		return;
        	}else if(phoneFlag == 2){
        		$('#selfGetPhoneTip').html("<span class='red'>手机号码不正确!</span>");
        		$("#orderSureError").show();
    			$("#errorMsg").html("暂不能提交订单！请检查您填写的收货人信息。")
        		return;
        	}else{
        		$('#selfGetPhoneTip').html("");
        	}
			
		}//验证电子票
		else if(val==4){
			var eTicketPhone = $("#eTicketPhone").val();
			var eTicketName =  $("#eTicketName").val();
			var phoneFlag = validatePhone(eTicketPhone);
			//用户名为空
			if($.trim(eTicketName) == ""){
				$('#eTicketNameTip').html("<span class='red'>真实姓名不能为空!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("暂不能提交订单！请检查您填写的收货人信息。");
				return;
			}else{
				$('#eTicketNameTip').html("");
			}
			
			if(phoneFlag == 1){
				$('#eTicketPhoneTip').html("<span class='red'>手机号码不能为空!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("暂不能提交订单！请检查您填写的收货人信息。");
				return;
			}else if(phoneFlag == 2){
				$('#eTicketPhoneTip').html("<span class='red'>手机号码格式不正确!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("暂不能提交订单！请检查您填写的收货人信息。");
				return;
			}else{
				$('#eTicketPhoneTip').html("");
			}
		}
		//提交订单前的验证结束
		var obj = {} ;
		obj.cityid = parseInt($("#fconfigid").val());
		obj.cityname = $("#cityname").val();
		obj.tickets = $("#products").val();
		obj.shipment = parseInt($('input:radio[name=sendStyle]:checked').val());
		//退票保险
		if($('#insuredStatus').attr('checked')){
			obj.insurance = 1;
			//如果勾选退票保险 必须勾选我已阅读并同意 保险条款及免除责任须知
			if($('#insuredStatusAndZeRen').attr('checked') == undefined){
				$("#errorMsg").html("暂不能提交订单！请同意保险条款及免责须知");
				$("#orderSureError").show();
				return;
			}
		}else{
			obj.insurance = 0;
		}
		obj.cashno = $("#cashcouponinfoid").val();
		obj.renewal = parseFloat($("#useRenewal").val()).toFixed(2);
		//货到付款
		var cash=$('input:radio[name="sendSty1"]:checked').val();
		if(cash == 1){
			obj.shipment = 3;
		}
		//如果上门自取
		if(val == 2){
			obj.consignee = $("#doorUserName").val();
			obj.consignee_phone = $("#doorUserPhone").val();
		}else if(val == 4){ //电子票
			obj.consignee = $("#eTicketName").val();
			obj.consignee_phone = $("#eTicketPhone").val();
			var dzType = $('input:radio[name=eticketname]:checked').val();
			if(dzType == 1){
				obj.consignee_idcard =  $("#eTicketCard").val();
			}
		}
		if(truebuy == 1){
			//实名购票相关
			var idCardObj = {};
			idCardObj.tickets = $("#products").val();
			idCardObj.cardnos = cardnos;
			var idCardArr = [];
			idCardArr.push(idCardObj);
			obj.idcardverified = idCardArr;				
		}
		
		var arr = []; 
		arr.push(obj);
		$("#purchases").val(JSON.stringify(arr));
		
		$("#oAddressId").val($("#addressId").val());
		//发票新开始
		if($("#getTicket").attr("checked") != undefined){
			    var getTicketVal = $("#getTicket").attr("disabled");
				var oInvoiceinfo;
				//门票即为发票的时候
				if(getTicketVal == "disabled"){
					oInvoiceinfo = "门票即为发票";
				}
				else{	
						//需要开发票的时候	
						//输入发票抬头不能为空
						oInvoiceinfo = $("#invoice").val();
						if(oInvoiceinfo == "" || oInvoiceinfo == "请填写公司发票抬头"){
								$("#errorMsg").html("暂不能提交订单！请检查发票信息。");
								$("#orderSureError").show();
								return;
						}
						//不同的收取方式
						var sendStyleDigitalid = $('input:radio[name="sendStyleDigitalid"]:checked').val();
						//没有配送方式
						if(sendStyleDigitalid==null || sendStyleDigitalid=="" ||sendStyleDigitalid==undefined){
								$("#errorMsg").html("暂不能提交订单！请检查发票收取方式。");
								$("#orderSureError").show();
								return;
						}
						else if(sendStyleDigitalid==10){
							//快递配送
							var addressDigitalid=$('input:radio[name="addressDigitalid"]:checked').val();
							//没有配送地址
							if(addressDigitalid==null || addressDigitalid=="" ||addressDigitalid==undefined){
								$("#errorMsg").html("暂不能提交订单！请检查发票收货信息。");
								$("#orderSureError").show();
								return;
							}
							$("#deliveryid").val(sendStyleDigitalid);	
							$("#writecheckaddressid").val(addressDigitalid);
							$("#writecheckphone").val("");
						}
						else if(sendStyleDigitalid==20){
							//上门自取
							var userDigitalidPhone= $("#userDigitalidPhone").val();
							var phoneFlag = validatePhone(userDigitalidPhone);
							if(phoneFlag == 1){
				        		$('#selfGetPhoneTipDigitalid').html("<span class='red' style='padding-left: 0px;'><i class='tsyy'>手机号码不能为空!</i></span>");
				        		$("#orderSureError").show();
				    			$("#errorMsg").html("暂不能提交订单！请检查您填写的发票信息。")
				        		return;
				        	}else if(phoneFlag == 2){
				        		$('#selfGetPhoneTipDigitalid').html("<span class='red' style='padding-left: 0px;'><i class='tsyy'>手机号码格式不正确!</i></span>");
				        		$("#orderSureError").show();
				    			$("#errorMsg").html("暂不能提交订单！请检查您填写的发票信息。")
				        		return;
				        	}else{
				        		$('#selfGetPhoneTip').html("");
				        	}
							$("#deliveryid").val(sendStyleDigitalid);	
							$("#writecheckphone").val(userDigitalidPhone);
							$("#writecheckaddressid").val("");
						}
						//开发票
						$("#writecheckflag").val($("#writecheckflagOld").val());	
				}
				$("#oInvoiceinfo").val(oInvoiceinfo);	
			}
		else{
			//不开发票
			$("#writecheckflag").val("0");
			$("#deliveryid").val("");	
			$("#writecheckaddressid").val("");
			$("#writecheckphone").val("");
			$("#oInvoiceinfo").val("");	
		}
		//发票新结束
		//发票
		//if($("#getTicket").attr("checked") != undefined){
		//	var oInvoice = $('input:radio[name="ticketType"]:checked').val();
		//	var oInvoiceinfo = $("#invoice").val();
		//	if(oInvoice == 0){
		//		oInvoiceinfo = "个人";
		//	}
		//	//选公司发票的时候
		//	if(oInvoice == 1){
		//		if(oInvoiceinfo == "" || oInvoiceinfo == "输入发票抬头"){
		//			$("#errorMsg").html("暂不能提交订单！请检查发票信息。");
		//			$("#orderSureError").show();
		//			return false;
		//		}
		//	}
		//	//门票即为发票的时候
		//	var getTicketVal = $("#getTicket").attr("disabled");
		//	if(getTicketVal == "disabled"){
		//		oInvoice = "";
		//		oInvoiceinfo = "门票即为发票";
		//	}
		//	$("#orderForm").append('<input type="hidden" name="o[\'invoice\']" id="oInvoice" value="'+oInvoice+'"/>');
		//	$("#orderForm").append('<input type="hidden" name="o[\'invoiceinfo\']" id="oInvoiceinfo" value="'+oInvoiceinfo+'"/>');
		//}
		//留言
		if($("#ylquetion").attr("checked") != undefined){
			var message = $("#message").val();
			$("#orderForm").append('<input type="hidden" name="o[\'messageinfo\']" id="oMessageinfo" value="'+message+'"/>');
		}
		//微信判断
		if($("#payId").val() == 57120812){
			var endVal = $("#endVal").text()*1;
			if(endVal>0){
				$("#callbackurl").val($("#weiUrl").val());
			}
		}else{
			$("#callbackurl").val($("#payUrl").val());
		}
		var isShade = $("#isShade").val();
		if(isShade == 1){
			//遮罩码判断
			var mask = $("#mask").val();
			if(mask!=0){
				$("#orderForm").append('<input type="hidden" name="o[\'mask\']" value="'+mask+'"/>');
			}
			//遮罩码调整
			var shadeInfos = $("#shadeInfos").val();
			if(shadeInfos!=0){
				$("#orderForm").append('<input type="hidden" name="o[\'maskinfo\']" value="'+shadeInfos+'"/>');
			}
		}
		//联盟判断
		var unionId = $("#unionIdVal").val();
		var orderSource = $("#orderSourceVal").val();
		var unionname = $("#unionnameVal").val();
		var companyinfo = $("#companyinfoVal").val();
		var tge = $("#tgeVal").val();
		if(unionId !=null && unionId != 0){
			$("#orderForm").append('<input type="hidden" name="o[\'unionId\']" value="'+unionId+'"/>');
		}
		if(orderSource !=null && orderSource != 0){
			$("#orderForm").append('<input type="hidden" name="o[\'orderSource\']" value="'+orderSource+'"/>');
		}
		if(unionname !=null && unionname != 0){
			$("#orderForm").append('<input type="hidden" name="o[\'unionname\']" value="'+unionname+'"/>');
		}
		if(companyinfo !=null && companyinfo != 0){
			$("#orderForm").append('<input type="hidden" name="o[\'companyinfo\']" value="'+companyinfo+'"/>');
		}
		if(tge !=null && tge != 0){
			$("#orderForm").append('<input type="hidden" name="o[\'tge\']" value="'+tge+'"/>');
		}
		//货到付款判断
		if(cash == 1){
			$("#callbackurl").val($("#cashUrl").val());
			$("#orderForm").submit();
			return;
		}
		//乐通卡判断
		var ltkFlag = $("#ltk").attr("class");
		//选中乐通卡
		if(ltkFlag == "select"){
			$("#oPayid").val(300);
			var ltkno = $("#ltkno").val();
			var ltkpwd = $("#ltkpwd").val();
			if(ltkno == "" || ltkno == null || ltkpwd == "" || ltkpwd == null){
				$("#orderSureError").show();
				$("#errorMsg").html("请输入乐通卡信息！")
				return;
			}else{
				$("#orderForm").append('<input type="hidden" name="o[\'letongka\']" id="letongka" value="'+ltkno+':'+ltkpwd+'"/>');
			}
		}else{
			$("#oPayid").val($("#payId").val());
		}
		//验证预存款使用开始
		var inputRenewal = $("#inputRenewal").val() * 1;
		if(inputRenewal>0){
			var customerId = $("#customerId").val();
			var password = $("#passwordRenewal").val();
			if(password == "" || password == null || password == undefined){
				//密码为空
				$("#renewalMsg").html("请输入预存款密码！");
				$("#orderSureError").show();
				$("#errorMsg").html("请输入预存款密码！")
				return;
			}
			var url = getPath()+"/ajax/findRenewal";
			$.post(url,{password:password,customerId:customerId},
				function(data){
					if(data == 0){
						//密码错误
						$("#renewalMsg").html("预存款密码错误！");
						$("#orderSureError").show();
						$("#errorMsg").html("预存款密码错误！")
						return;
					}else{
						//密码正确
						$("#renewalMsg").html("预存款密码正确！");
						var endVal = $("#endVal").text()*1;
						//微信判断
						if($("#payId").val() == 57120812){
							var endVal = $("#endVal").text()*1;
							if(endVal>0){
								$("#callbackurl").val($("#weiUrl").val());
							}
						}else{
							$("#callbackurl").val($("#payUrl").val());
						}
						if(endVal<=0){
							var cashNo = $("#cashcouponinfoid").val();
							if(cashNo != 0 && cashNo != "" && cashNo != null){
								$("#oPayid").val(100);
							}else{
								$("#oPayid").val(200);
							}
							$("#orderForm").submit();
							return;
						}else{
							var oPayid = $("#oPayid").val();
							if(oPayid== 0 ||oPayid == ""){
								$("#orderSureError").show();
								$("#errorMsg").html("请选择支付方式!");
								return;
							}
							$("#orderForm").submit();
							return;
						}
					}
			});		
		}else{
			var endVal = $("#endVal").text()*1;
			if(endVal<=0){
				var cashNo = $("#cashcouponinfoid").val();
				if(cashNo != 0 && cashNo != "" && cashNo != null){
					$("#oPayid").val(100);
					$("#orderForm").submit();
					return;
				}
			}
			var oPayid = $("#oPayid").val();
			if(oPayid== 0 ||oPayid == ""){
				$("#orderSureError").show();
				$("#errorMsg").html("请选择支付方式!");
				return;
			}
			$("#orderForm").submit();
			return;
		}
		//验证预存款使用结束
	});
});
function unClick(){
	$('#saveOrder').unbind("click");
}
//验证姓名 STORY #2875::实名制和上门自取，姓名字段增加校验
function verifyName(name){
	//flag 0正常 1 格式不对 2超长
	var flag = 0;
	var reg = /^[\u4E00-\u9FFF\u2022]+$|^[A-Za-z\.]+$/;
	if(!reg.test(name)){
		flag = 1;
	}else if(name.length > 20){
		flag = 2;
	}
	return	flag;
}
