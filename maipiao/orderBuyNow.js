$(function(){
	$("input[name=sendStyle]:eq(0)").attr("checked",'checked'); //默认选中第一个配送方式
	$("input[name=sendStyle]:eq(0)").click();
	//判断是否支持退票保险
	isInsured();
	//如果用户有配送地址
	var cusAddressId = $("input[name=address]:eq(0)").val();
	var val=$('input:radio[name="sendStyle"]:checked').val();
	if(cusAddressId!=null && cusAddressId != "" && cusAddressId != undefined){
		//如果默认快递配送，计算运费
		if(val == 1){
			//getFreightByCusAdd(cusAddressId);//然后计算运费
		}
	}else{
		//如果用户没有配送地址初始化省份
		ajaxProvinces()
	}
	//加载支付列表
	$("li[name=pay_class]:eq(0)").attr("class","select");
	$("li[name=pay_class]:eq(0)").click();//默认选中第一组支付列表
	//-------------------------------地址切换开始--------------------------------------------//
	//$(".orderSure-address li").click(function(e){
	//	var aid;
	//	if($(this).hasClass('select')){
	//		$(this).click(function(e){
	//			aid = $(this).attr("aid");
	//			//只有快递配送才计算运费 BUG #9831::电子票商品在确认订单页面中包含运费
	//			if(val == 1){
	//				getFreightByCusAdd(aid);
	//			}
	//			stopBubble(e);
	//		});
	//	}
	//	stopBubble(e);
	//}).trigger("click");
	//$('.orderSure-address li').eq(0).trigger("click");
	//-------------------------------地址切换结束--------------------------------------------//
	//-------------------------------发票开始--------------------------------------------//
	$(".invoices h4 input").click(function(){
			if($("#getTicket").attr("checked") == undefined){
				$(".ask-invoices").attr("style","display:none;");
				$('input:radio[name="getTicket"]:checked').attr("checked",false); 
			}else{
				//发票配送方式默认选中第一个
				$("input[name=sendStyleDigitalid]:eq(0)").attr("checked",'checked');
				$("input[name=sendStyleDigitalid]:eq(0)").parent().addClass('active');
				$("input[name=sendStyleDigitalid]:eq(0)").click();
				$(".ask-invoices").attr("style","display:block;");
			}
	});
	//-------------------------------发票结束--------------------------------------------//
	
	//-------------------------------加载省市区开始--------------------------------------------//
	//加载省份信息
	function ajaxProvinces(){
		var url = getPath()+'/ajax/loadRangeNew';
		$.post(url,{type:'provinces', typeId:'0'},function(data){
			if(data.ajaxResponse == 1){//ajax响应成功
				$.each(data.rangeList,function(i,o){
					$("#provinceId").append("<option value="+o.provinceId+">"+o.name+"</option>");
				});
			}else{
				return false;
			}
		});
	}
	//加载市信息
	$("#provinceId").change(function(){
		$("#addressInfo").html("");
		////城市 区县 区域希腊初始化第一条
		$(".changefiled").each(function (){ this.selectedIndex=0;});
		$("#cityId").empty().append("<option value=\"0\">选择市</option>");
		$("#areaId").empty().append("<option value=\"0\">选择区</option>");
		$("#codeId").empty().append("<option value=\"0\">选择区域</option>");
		var provinceId = this.value;//省ID 
		$.ajaxSettings.async = false;
		var url = getPath()+'/ajax/loadRangeNew';
		$.post(url,{type:'cities', typeId:provinceId},function(data){
			if(data.ajaxResponse == 1){//ajax响应成功
				var provincebak = [];
				$.each(data.rangeList,function(i,o){
					if(o.provinceId == provinceId){//省ID相等
						provincebak.push("<option value="+o.cityId+">"+o.name+"</option>");
					}
				});
				if(provincebak.length>0){//临时区缓冲区
					$("#cityId").append(provincebak.join(''));
				}
			}else{
				return false;
			}
		});
	});
	//加载区信息
	$("#cityId").change(function(){
		$("#areaId").empty().append("<option value=\"0\">选择区</option>");
		$("#codeId").empty().append("<option value=\"0\">选择区域</option>");
		var cityId = this.value;//城市ID 
		$.ajaxSettings.async = false;
		var url = getPath()+'/ajax/loadRangeNew';
		$.post(url,{type:'areas', typeId:cityId},function(data){
			if(data.ajaxResponse == 1){//ajax响应成功
				var citybak = [];
				$.each(data.rangeList,function(i,o){
					if(o.cityId == cityId){//城市ID相等
						citybak.push("<option value="+o.areaId+">"+o.name+"</option>");
					}
				});
				if(citybak.length>0){//临时区缓冲区
					$("#areaId").append(citybak.join(''));
				}
			}else{
				return false;
			}
		});
	});
	//加载区域信息
	$("#areaId").change(function(){
		var areaId = this.value;//区ID 
		$("#codeId").show();
		var codeId = "";
		if(areaId==0){
			$("#codeId").empty().hide();
		}else{
			$("#codeId").empty();
			var url = getPath()+'/ajax/loadRangeNew';
			$.post(url,{type:'codes', typeId:areaId},function(data){
				if(data.ajaxResponse == 1){//ajax响应成功
					var areabak = [];
					$.each(data.rangeList,function(i,o){
						if(o.areaId == areaId){//区ID相等
							if(o.name != null){
								$("#codeId").css('visibility','visible');//显示范围相关的信息
								$("#codeId").empty().append("<option value=\"0\">选择区域</option>");	
								areabak.push("<option value="+o.codeId+" >" + o.name + "</option>");
							}else{
								codeId = o.codeId;
							}
						}
					});
					if(areabak.length > 0){//临时区缓冲区
						$("#codeId").append(areabak.join(''));
						$('#expAddressTip').html("");
					}else{ //没有区域的话
						$("#codeId").append("<option value=" + codeId + "></option>");	
						$('#expAddressTip').html("");
						$("#codeId").css('visibility','hidden');//隐藏或重置 范围相关的信息
					}
					getFreight();
					//遍历订单信息
				    $("div[class='orderSure-orderDetail']").each(function(){
				    	$(this).find("td[name='buyCarsendstyle']").show();
				    });
					
				}else{
					return false;
				}
			});
		}
	});
	//改变区域
	$("#codeId").change(function(){
		getFreight();
	});
	
//---------------------------------根据省市区计算运费相关开始-------------------------------------------------//	
function getFreight(){
	
}
//---------------------------------根据省市区计算运费相关结束-------------------------------------------------//
//---------------------------------自助取票机证件验证相关开始-------------------------------------------------//

$("#selfVoucher").blur(function(){
	var cardtype = $("#voucherType option:selected").val();
	var selfVoucher = $("#selfVoucher").val();
	if(cardtype == "0"){
		var cardFlag = validateCard(selfVoucher);
		if(cardFlag == 1){
			$('#selfVoucherTip').html("<span class='red'>身份证号不能为空!</span>");
		}else if(cardFlag == 2){
			$('#selfVoucherTip').html("<span class='red'>身份证号码不正确!</span>");
		}else{
			$('#selfVoucherTip').html("");
		}
	}else if(cardtype == "1"){
		var cardFlag = validatePersonCard(selfVoucher); 
		if(cardFlag == 1){
			$('#selfVoucherTip').html("<span class='red'>护照号不能为空!</span>");
		}else if(cardFlag == 2){
			$('#selfVoucherTip').html("<span class='red'>护照号码不正确!</span>");
		}else{
			$('#selfVoucherTip').html("");
		}
	};

});
//---------------------------------自助取票机证件验证相关结束-------------------------------------------------//
//----------------------------查询礼券相关操作开始---------------------------------------------//
	//查询现金券的相关操作
	$('#queryCashCoup').bind('click', queryCashCoup);//给查询现金券按钮绑定事件
	function queryCashCoup(){
		var cashCouponNo = $('#cashCouponNo').val();
		var productId = $("#productid").val();
		var subtotalval = $("#subtotalval").val();
		var fconfigid = $("#fconfigid").val();
		if(productId == null || subtotalval == null || fconfigid == null){
			$("#cashCoupInfo").hide();
			$('#useCashCoupSb').hide();
			$('#cashCoupTip').html("<span class='red' >非法操作！</span>");
			return false;
		}
		if($.trim(cashCouponNo) == null || $.trim(cashCouponNo) == ""){
			$("#cashCoupInfo").hide();
			$('#useCashCoupSb').hide();
			$('#cashCoupTip').html("<span class='red' >请输入现金券号码！</span>");
			return false;
		}else{
			var url = getPath()+"/ajax/findCashCoupon";
			$.post(url,{cashCouponNo:$.trim(cashCouponNo), productId:productId,subTotalVal:subtotalval,fconfigId:fconfigid},function(data){
				if(data.ajaxResponse == 1){//ajax响应成功
					$('#cashCoupTip').html("");
					if(data.flag == -2){//判断现金券是否查询异常
						$('#cashCoupTip').html("<span class='red' >您输入的现金券不存在，若有疑问请拨打永乐客服电话4006-228-228询问！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == -1){//判断现金券是否查询异常
						$('#cashCoupTip').html("<span class='red' >现金券查询异常，若有疑问请拨打永乐客服电话4006-228-228询问！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 0){//判断现金券的状态是否为已经指派
						$('#cashCoupTip').html("<span class='red' >您的现金券已无效，若有疑问请拨打永乐客服电话4006-228-228询问！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 1){ //判断现金券是否已经使用
						$('#cashCoupTip').html("<span class='red' >您输入的现金券已于"+data.beUsedTime+"被使用，若有疑问请拨打永乐客服电话4006-228-228询问！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 2){//判断现金券是否已经过期
						$('#cashCoupTip').html("<span class='red' >您的现金券已于"+ data.endDate +"失效！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 3){//判断现金券是否适用于永乐官网使用
						$('#cashCoupTip').html("<span class='red' >您输入的现金券不能在永乐官网使用！若有疑问请拨打永乐客服电话4006-228-228询问。</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 4){//判断新金泉是否适用于该分站
						$('#cashCoupTip').html("<span class='red' >您输入的现金券，不能用于购买当前分站的商品！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 5){//判断商品是否属于不能用现金券的商品中的标识
						$('#cashCoupTip').html("<span class='red' >您输入的现金券，不能用于购买当前商品！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 6){//判断是否满足最低票面款消费金额
						$('#cashCoupTip').html("<span class='red' >您输入的现金券最低消费满"+ data.lowestExpense +"元才可使用！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 7){//判断现金券是否已经查询出来了
						$('#cashCoupTip').html("<span class='red' >您输入的现金券已经存在于‘您的现金券’中，请直接使用！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 8){//判断是否属于不能使用现金券的商品分类的标识
						$('#cashCoupTip').html("<span class='red' >您输入的现金券，不能用于购买当前商品！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 9){//判断现金券是否到使用日期
						$('#cashCoupTip').html("<span class='red' >现金券暂时不能使用！</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else{
						$('#cashCoupTip').html("");
						$('#cashCoupInfo').attr("style","display:block;");
						$("#useCashCoup").attr("style","display:block;");
						$('#cashCoupMoney').html(data.ticket);
						$('#cashCoupEndDate').html(data.endDate);
						$('#useCashCoupSb').show();
						//$('#queryCashCoup').unbind('click', queryCashCoup);
						$('#cashCoupInfo').attr("cash",data.cashcouponinfoid);
					}
				}else{
					return false;
				}
			});
		}
	}
	//----------------------------查询礼券相关操作结束---------------------------------------------//
	
	//----------------------------判断是否购买退票保险开始-------------------------------------------//
	$("#insuredStatus").click(function(){
		if($("#insuredStatus").attr("checked") == undefined){
			//隐藏保险条款及免除责任须知
			$("#insuredStatusAndZeRenDiv").slideUp(300);
			//不勾选退票保险默认不同意
			$("#insuredStatusAndZeRen").removeAttr('checked');
			//点击取消
			$("#returnEnsured").hide();
			$(".font-taho").hide();
			sumExpense();
			useCashCouponAndRenewal();
			$("#returnTicketSureAgree").hide();
			$("#insuredStatus").val(0);
			var cusAddressId=$('input:radio[name="address"]:checked').val();
			isCashOnDelivery(cusAddressId);//取消退票保险验证是否支持货到付款
		}else{
			//显示保险条款及免除责任须知
			$("#insuredStatusAndZeRenDiv").slideDown(300);
			//默认勾选同意
			$("#insuredStatusAndZeRen").attr('checked','checked');
			//点击选中
			$("#returnEnsured").show();
			$(".font-taho").show();
			sumExpense();
			useCashCouponAndRenewal();
			//$("#returnTicketSureAgree").show();
			$("#returnTicketSureAgree").hide();
			$("#insuredStatus").val(1);
			
			$(".cashOnDelivery").attr("style","display:none;"); //隐藏货到付款
			$(".cashOnDelivery").each(function(index, obj) {
				$(".cashOnDelivery").attr("style","display:none;");
			});
			$("#hdfkInptRadio").attr("checked",false);
			$("#hdfkInptRadio").removeAttr("checked");
			
			
		}
	})
	//----------------------------判断是否购买退票保险结束----------------------------------------//
	//----------------------------使用现金券单选开始-------------------------------------------//
	$("input[name='cashcouponid']").click(function(){
		//清除纸质券的使用
		$("#cashCouponNo").val("");
		$("#cashCoupInfo").attr("style","display:none;");
		$("#useCashCoup").attr("style","display:none;");
		var parvalue = $('input:radio[name="cashcouponid"]:checked').val(); //金额
		var cashNo = $('input:radio[name="cashcouponid"]:checked').attr("cash"); //现金券ID
		$("#cashCouponVal").val(parvalue);
		$("#cashcouponinfoid").val(cashNo);
		//先清空掉预存款和预存款密码
		$("#inputRenewal").val(0);
		$("#useRenewal").val(0);
		$("#passwordRenewal").val("");
		useCashCouponAndRenewal();
		
	})	
	//----------------------------使用现金券单选结束-------------------------------------------//
	//----------------------------使用现金券按钮开始-------------------------------------------//
	$("#useCashCoup").click(function(){
		$('input:radio[name="cashcouponid"]:checked').attr("checked",false);//清掉单选现金券的选中样式
		var cashCoupMoney = $("#cashCoupMoney").html() * 1; //金额
		var cashNo = $('#cashCouponNo').val();//现金券码
		$("#cashCouponVal").val(cashCoupMoney);
		$("#cashcouponinfoid").val(cashNo);
		//先清空掉预存款和预存款密码
		$("#inputRenewal").val(0);
		$("#useRenewal").val(0);
		$("#passwordRenewal").val("");
		useCashCouponAndRenewal();
		
	})
	//----------------------------使用现金券按钮结束-------------------------------------------//
	//----------------------------取消使用现金券开始-------------------------------------------//
	$("#ticketuse").click(function(){
		if($("#ticketuse").attr("checked") == undefined){
			//清空已经使用的现金券
			$('input:radio[name="cashcouponid"]:checked').attr("checked",false); 
			$("#cashCouponNo").val("");
			$("#cashCoupInfo").attr("style","display:none;");
			$("#useCashCoup").attr("style","display:none;");
			$("#cashCouponVal").val(0);
			$("#cashcouponinfoid").val(0);
			useCashCouponAndRenewal();
			$(this).parent().parent().next().slideUp(300);
		}else{
			//点击选中
			$(this).parent().parent().next().slideDown(300);
		}
	})	
	//----------------------------取消使用现金券结束-------------------------------------------//
	//----------------------------使用预存款开始-------------------------------------------//
	$("#inputRenewal").change(function(){
		var inputRenewal = $("#inputRenewal").val()*1; //用户输入的预存款
		var cusRenewal = $("#cusRenewal").text()*1; //用户剩余的预存款
		var dealWith = $("#dealWith").html()*1; //应付总额
		var cashCouponVal = $("#cashCouponVal").val()*1; //现金券金额
		var renewal = $("#useRenewal").val()*1; //预存款金额
		var endVal = (parseFloat(dealWith)-parseFloat(cashCouponVal)).toFixed(2);
		//如果用户输入的金额大于自己的预存款
		if(inputRenewal > cusRenewal){
			inputRenewal = cusRenewal;
		}
		//如果用户输入的金额大于订单金额
		if(inputRenewal > endVal){
			inputRenewal = endVal;
		}
		//如果算完预存款金额无需支付，将其置为0
		if(inputRenewal <= 0){
			inputRenewal = 0;
		}
		$("#useRenewal").val(inputRenewal);
		$("#inputRenewal").val(inputRenewal);
		useCashCouponAndRenewal();
		
	})	
	//----------------------------使用预存款结束-------------------------------------------//	
	//----------------------------验证预存款密码开始-------------------------------------------//
	$("#passwordRenewal").change(function(){
		var customerId = $("#customerId").val();
		var password = $("#passwordRenewal").val();
		var url = getPath()+"/ajax/findRenewal";
		$.post(url,{password:password,customerId:customerId},
			function(data){
				if(data == 0){
					//密码错误
					$("#renewalMsg").html("预存款密码错误！");
					return false;
				}else{
					//密码正确
					$("#renewalMsg").html("预存款密码正确！");
				}
		});		
	})	
	//----------------------------验证预存款密码结束-------------------------------------------//		
	//----------------------------勾选支付方式开始-------------------------------------------//
	$("input[name='bank']").click(function(){
		var payId = $('input:radio[name="bank"]:checked').val(); //支付ID
		$("#payId").val(payId); //放入表单
	})	
	//----------------------------勾选支付方式结束-------------------------------------------//
	//----------------------------促销效果开始-------------------------------------------//
	 $(".sale-link").on("click",function(){
		 	$(this).children("i").toggleClass("sale-linki-up");
		 	$(".salshow-box").slideToggle();
		 	$(".sale-link-border").toggle();
		 });
		$(".submitpromo").click(function(){
			var promoDis=$("input:radio[name='promoDis']:checked");
			var promoname = promoDis.attr("promoname");
			$(".sale-span").html(promoname);
			$(".salshow-box").hide();
			$(".sale-link-border").show();
			//选中优惠
			var forms = promoDis.attr("forms");
			salecalculate(forms);
			$("#activeNo").val(promoDis.val());
			//获取所有的支付方式
			var payCode = promoDis.attr("payCode");
			if(payCode){
				$('input:radio[name="bank"]').each(function(index, obj) {
					if(obj.value!=payCode){
						//支付方式置灰 移除选中
						obj.setAttribute("disabled","disabled");
						obj.checked=false;
					}
				});
			}else{
				$('input:radio[name="bank"]').each(function(index, obj) {
					//支付方式点亮
					obj.removeAttribute("disabled");
				});
			}
		});
		$(".cancelpromo").click(function(){
			$(".salshow-box").hide();
			$(".sale-link-border").show();

		});
		//----------------------------促销效果结束-------------------------------------------//
});
//----------------------------选择快递配送计算运费----------------------------------------//
function clickExpress(){
	//选中的配送地址
	var cusAddressId=$('input:radio[name="address"]:checked').val();
	//没有收货地址
	if(cusAddressId == undefined || cusAddressId == null || cusAddressId ==""){
		//加载添加收货地址
		addAddress();
	}else{
		//计算费用 
		getFreightByCusAdd(cusAddressId);
		//isCashOnDelivery(cusAddressId);
	}
	isInsured();
}
//----------------------------选择快递配送计算运费----------------------------------------//
//----------------------------选择上门自取取消运费----------------------------------------//
function clickDoor(){
	$("#freightVal").val(0);
	$(".cashOnDelivery").attr("style","display:none;"); //隐藏货到付款
	$("#editCustomerAddr").hide(); //隐藏编辑地址
	sumExpense();
	isInsured();
	useCashCouponAndRenewal();
	$("#addressId").val(0);
}
//----------------------------选择上门自取取消运费----------------------------------------//
//----------------------------选择电子票取消运费----------------------------------------//
function eTicket(){
	$("#freightVal").val(0);
	$(".cashOnDelivery").attr("style","display:none;"); //隐藏货到付款
	$("#editCustomerAddr").hide(); //隐藏编辑地址
	sumExpense();
	isInsured();
	useCashCouponAndRenewal();
	$("#addressId").val(0);
	//取消显示退票
	$("#returnEnsured").hide();
	$(".font-taho").hide();
	$(".insPrice").hide();
	sumExpense();
	useCashCouponAndRenewal();
	$("#returnTicketSureAgree").hide();
	$("#insuredStatus").val(0);
	var cusAddressId=$('input:radio[name="address"]:checked').val();
	isCashOnDelivery(cusAddressId);//取消退票保险验证是否支持货到付款
}
//----------------------------选择电子票取消运费----------------------------------------//
//----------------------------根据配送地址ID计算运费----------------------------------------//
function getFreightByCusAdd(cusAddressId){
	var subTotal = $("#subtotalval").val();
	var fconfigId =  $("#fconfigid").val();
	var productid = $("#productid").val();
	var url = getPath()+"/ajax/getFreightNew";
	$.post(url,{cusAddressId:cusAddressId,subTotal:subTotal,fconfigId:fconfigId,productid:productid},
		    function(data){
				var freight = data.transportFee*1;
				$("#freightVal").val(data.transportFee);
				sumExpense();
				useCashCouponAndRenewal();
	});
	//验证是否支持货到付款
	//isCashOnDelivery(cusAddressId);
	//判断是否购买退票保险
	checkInsuredStatus();
	//将地址ID放到表单
	$("#addressId").val(cusAddressId);
}
//----------------------------根据配送地址ID计算运费----------------------------------------//
//----------------------------计算保费，运费，商品金额的总和----------------------------------------//
function sumExpense(){
	var subTotal = $("#subtotalval").val()*1;//订单金额
	var premiumVal = $("#premiumVal").val()*1;//当前保费
	var freightVal = $("#freightVal").val()*1; //运费
	//未勾选退票按钮,保费计算为0
	if($("#insuredStatus").attr("checked") == undefined){
		premiumVal = 0;
	}
	//勾选上门自取，运费为0
	if($("#doorRadio").attr("checked") != undefined){
		freightVal = 0;
	}
	//现金券金额
	var cashVal = $("#cashCouponVal").val()*1;
	var total = (parseFloat(subTotal) + parseFloat(premiumVal) + parseFloat(freightVal)).toFixed(2);
	$("#total").text(total);
	$("#dealWith").text(total);
	$("#premium").text(premiumVal);
	$("#freight").text(freightVal);
	if(total-cashVal <= 0){
		$("#endVal").html("0");
	}else{
		$("#endVal").html(total-cashVal);
	}
}
//判断是否支持货到付款
function isCashOnDelivery(addressId){
	if($("#doorRadio").attr("checked")){ 
		$(".cashOnDelivery").each(function(index, obj) {
			$(".cashOnDelivery").attr("style","display:none;");
		});
		$("#hdfkInptRadio").attr("checked",false);
		$("#hdfkInptRadio").removeAttr("checked");

	}else{
		var url = getPath()+'/ajax/isCashOnDelivery';
		var productId = $("#productid").val();
		var cityId = $("#cityid").val();
		var playDate= $("#playDate").val();
		$.post(url,{productId:productId,addressId:addressId,cityId:cityId,playDate:playDate},function(data){
			//是否支持货到付款     0不支持 1 支持
			if(data.flag == 0){
				$(".cashOnDelivery").each(function(index, obj) {
					$(".cashOnDelivery").attr("style","display:none;");
				});
				$("#hdfkInptRadio").attr("checked",false);
				$("#hdfkInptRadio").removeAttr("checked");

			}else{
				//$(".cashOnDelivery").attr("style","");
				$(".cashOnDelivery").each(function(index, obj) {
			        $(obj).removeAttr("style");
			        $(obj).show();
			    });
			}
		});
	}
	
}
//使用现金券和预存款之后的计算
function useCashCouponAndRenewal(){
	var cashCouponVal = $("#cashCouponVal").val()*1; //现金券金额
	var renewal = $("#useRenewal").val()*1; //预存款金额
	$("#alreadyVal").html(cashCouponVal+renewal); //商品已支付
	//计算还需支付的金额 应付款-现金券-预存款
	var dealWith = $("#dealWith").html()*1; //应支付
	var endVal = (parseFloat(dealWith)-parseFloat(cashCouponVal)-parseFloat(renewal)).toFixed(2);
	var activeNo = $("#activeNo").val();
	var promoDis=$("input:radio[name='promoDis'][value="+activeNo+"]");
	var formula = promoDis.attr("forms");
	salecalculate(formula);
	//金额大于等于需支付的金额
//	if(endVal <= 0){
//		$("#endVal").html("0");
//	}else{
//		$("#endVal").html(endVal);
//	}
//	
}
//判断是否显示退票保险
function isInsured(){
	//商品配置，演出前三天或电子票，不支持退票保险 
	//商品配置
	var isInsured = $("#isInsured").val();
	//是否演出前三天 0否 1是
	var isDifferTime = $("#isDifferTime").val();
	//当前选中的配送方式 1快递配送 2上门自取 4电子票
	var val=$('input:radio[name="sendStyle"]:checked').val();
	if(isDifferTime == 1||val == 4 ||isInsured == 0){
		//不支持退票保险
		$("#insuredStatus").attr("checked",false);
		//不勾选退票保险默认不同意
		$("#insuredStatusAndZeRen").removeAttr('checked');
		$("#insuredDiv").hide();
		$("#insuredStatusAndZeRenDiv").hide();
	}else{
		//支持退票保险
		$("#insuredDiv").show();
	}
}
//阻止事件冒泡的通用函数  
function stopBubble(e){  
    // 如果传入了事件对象，那么就是非ie浏览器  
    if(e&&e.stopPropagation){  
        //因此它支持W3C的stopPropagation()方法  
        e.stopPropagation();  
    }else{  
        //否则我们使用ie的方法来取消事件冒泡  
        window.event.cancelBubble = true;  
    }  
}  


//判断是否购买退票保险
function checkInsuredStatus(){
	if($("#insuredStatus").attr("checked") == undefined){
		//点击取消
		$("#returnEnsured").hide();
		$(".font-taho").hide();
		sumExpense();
		useCashCouponAndRenewal();
		$("#returnTicketSureAgree").hide();
		$("#insuredStatus").val(0);
		var cusAddressId=$('input:radio[name="address"]:checked').val();
		isCashOnDelivery(cusAddressId);//取消退票保险验证是否支持货到付款
	}else{
		//点击选中
		$("#returnEnsured").show();
		$(".font-taho").show();
		sumExpense();
		useCashCouponAndRenewal();
		//$("#returnTicketSureAgree").show();
		$("#returnTicketSureAgree").hide();
		$("#insuredStatus").val(1);
		$(".cashOnDelivery").attr("style","display:none;"); //隐藏货到付款
		$(".cashOnDelivery").each(function(index, obj) {
			$(".cashOnDelivery").attr("style","display:none;");
		});
		$("#hdfkInptRadio").attr("checked",false);
		$("#hdfkInptRadio").removeAttr("checked");
		$("#hdfkInptRadio").attr("checked",false);
		$("#hdfkInptRadio").removeAttr("checked");
	}
}
//发票上门自取初始化数据
function selfGetDigitalidNew(c){
	//当前节点添加class=active 其他兄弟节点移除
	$(c).parent().addClass("active").siblings().removeClass("active");
	if($(c).val()==20){
		//显示上门自取
		$("#selfGetDigitalidShow").attr("style","display:block;");
		//隐藏快递配送
		$("#cashOnDeliveryDigitalidShow").attr("style","display:none;");
	}
	else if($(c).val()==10){
		//隐藏上门自取
		$("#selfGetDigitalidShow").attr("style","display:none;");
		//显示快递配送
		$("#cashOnDeliveryDigitalidShow").attr("style","display:block;");
		//选中默认快递配送地址
		$("input[name=addressDigitalid]:eq(0)").click();
	}
}

//按照公式计算金额
function salecalculate(formula){
	if(formula == null || formula == "" || formula == undefined){
		return false;
	}
	var bPrice = 0;//保费总金额
	if($("#insuredStatus").attr("checked") != undefined){
		//勾选退票保险，赋值
		bPrice = $("#premiumVal").val()*1;
	}
	
	var yPrice = 0;//运费总金额
	if($('input:radio[name="sendStyle"]:checked').val() == 1){
		//勾选退票保险，赋值
		bPrice = $("#freightVal").val()*1;
	}
	//单价和数量理论上不应该出现
	var sPrice = 0;//单价 
	var ticNum = $("#countNum").val();//数量
	var sysTime= new Date().getTime();
	var cPrice = $("#cashCouponVal").val();//现金券金额
	var ePrice = $("#useRenewal").val();//预存款金额
	var zPrice = eval($("#dealWith").html()*1-cPrice-ePrice);//折后总金额
	//计算还需支付的金额
	var endPrice = eval(formula);
	//计算优惠金额
	var salePrice = eval(zPrice-endPrice);
	if(salePrice <= 0){
		salePrice = 0;
	}
	$("#promoVal").html(salePrice);
	$("#promoDisVal").val(salePrice); //现在选中的优惠金额
	
	if(endPrice <= 0){
		$("#endVal").html("0");
	}else{
		$("#endVal").html(endPrice);
	}
	
	
}

//判断活动是否可用
function saleUsable(){
	var bPrice = 0;//保费总金额
	if($("#insuredStatus").attr("checked") != undefined){
		//勾选退票保险，赋值
		bPrice = $("#premiumVal").val()*1;
	}
	
	var yPrice = 0;//运费总金额
	if($('input:radio[name="sendStyle"]:checked').val() == 1){
		//勾选退票保险，赋值
		bPrice = $("#freightVal").val()*1;
	}
	//单价和数量理论上不应该出现
	var sPrice = 0;//单价 
	var ticNum = $("#countNum").val();//数量
	var sysTime= new Date().getTime();
	var cPrice = $("#cashCouponVal").val()*1;//现金券金额
	var ePrice = $("#useRenewal").val()*1;//预存款金额
	var zPrice = eval($("#dealWith").html()*1-cPrice-ePrice);//折后总金额
	var activeNo = $("#activeNo").val();
	var promoDis=$("input:radio[name='promoDis'][value="+activeNo+"]");
	var promoDisVal = promoDis.val();
	var flag = 1;//是否可以使用促销活动 0不可以1可以
	if(promoDisVal&&promoDisVal != -1){
		var rules = promoDis.attr("rules").replace("[","").replace("]","");
		var flag = 1 ; //规则是否都满足 0否 1 是
		if(rules !=null && rules != ""){
			var rulesArr = rules.split(",");
			for ( var i = 0; i < rulesArr.length; i++) {
				if(!eval(rulesArr[i])){
					alert("不满足当前促销活动的条件！");
					flag = 0;
					break;
				}
			}	
		}
		var payCode = $("input:radio[name='promoDis']:checked").attr("payCode");
		var payId = $('input:radio[name="bank"]:checked').val(); //支付ID
		var payName = $("input:radio[name='bank']:checked").attr("payName");
		if(payId!=null && payId != "" && payId != undefined){
			if(payCode != payId){
				alert("你选择的促销活动只支持"+payName+"支付方式");
				flag = 0;
				return flag;
			}
		}
	}
	//促销活动验证失败
	return flag;
	
}
