$(function(){
	$("input[name=sendStyle]:eq(0)").attr("checked",'checked'); //Ĭ��ѡ�е�һ�����ͷ�ʽ
	$("input[name=sendStyle]:eq(0)").click();
	//�ж��Ƿ�֧����Ʊ����
	isInsured();
	//����û������͵�ַ
	var cusAddressId = $("input[name=address]:eq(0)").val();
	var val=$('input:radio[name="sendStyle"]:checked').val();
	if(cusAddressId!=null && cusAddressId != "" && cusAddressId != undefined){
		//���Ĭ�Ͽ�����ͣ������˷�
		if(val == 1){
			//getFreightByCusAdd(cusAddressId);//Ȼ������˷�
		}
	}else{
		//����û�û�����͵�ַ��ʼ��ʡ��
		ajaxProvinces()
	}
	//����֧���б�
	$("li[name=pay_class]:eq(0)").attr("class","select");
	$("li[name=pay_class]:eq(0)").click();//Ĭ��ѡ�е�һ��֧���б�
	//-------------------------------��ַ�л���ʼ--------------------------------------------//
	//$(".orderSure-address li").click(function(e){
	//	var aid;
	//	if($(this).hasClass('select')){
	//		$(this).click(function(e){
	//			aid = $(this).attr("aid");
	//			//ֻ�п�����Ͳż����˷� BUG #9831::����Ʊ��Ʒ��ȷ�϶���ҳ���а����˷�
	//			if(val == 1){
	//				getFreightByCusAdd(aid);
	//			}
	//			stopBubble(e);
	//		});
	//	}
	//	stopBubble(e);
	//}).trigger("click");
	//$('.orderSure-address li').eq(0).trigger("click");
	//-------------------------------��ַ�л�����--------------------------------------------//
	//-------------------------------��Ʊ��ʼ--------------------------------------------//
	$(".invoices h4 input").click(function(){
			if($("#getTicket").attr("checked") == undefined){
				$(".ask-invoices").attr("style","display:none;");
				$('input:radio[name="getTicket"]:checked').attr("checked",false); 
			}else{
				//��Ʊ���ͷ�ʽĬ��ѡ�е�һ��
				$("input[name=sendStyleDigitalid]:eq(0)").attr("checked",'checked');
				$("input[name=sendStyleDigitalid]:eq(0)").parent().addClass('active');
				$("input[name=sendStyleDigitalid]:eq(0)").click();
				$(".ask-invoices").attr("style","display:block;");
			}
	});
	//-------------------------------��Ʊ����--------------------------------------------//
	
	//-------------------------------����ʡ������ʼ--------------------------------------------//
	//����ʡ����Ϣ
	function ajaxProvinces(){
		var url = getPath()+'/ajax/loadRangeNew';
		$.post(url,{type:'provinces', typeId:'0'},function(data){
			if(data.ajaxResponse == 1){//ajax��Ӧ�ɹ�
				$.each(data.rangeList,function(i,o){
					$("#provinceId").append("<option value="+o.provinceId+">"+o.name+"</option>");
				});
			}else{
				return false;
			}
		});
	}
	//��������Ϣ
	$("#provinceId").change(function(){
		$("#addressInfo").html("");
		////���� ���� ����ϣ����ʼ����һ��
		$(".changefiled").each(function (){ this.selectedIndex=0;});
		$("#cityId").empty().append("<option value=\"0\">ѡ����</option>");
		$("#areaId").empty().append("<option value=\"0\">ѡ����</option>");
		$("#codeId").empty().append("<option value=\"0\">ѡ������</option>");
		var provinceId = this.value;//ʡID 
		$.ajaxSettings.async = false;
		var url = getPath()+'/ajax/loadRangeNew';
		$.post(url,{type:'cities', typeId:provinceId},function(data){
			if(data.ajaxResponse == 1){//ajax��Ӧ�ɹ�
				var provincebak = [];
				$.each(data.rangeList,function(i,o){
					if(o.provinceId == provinceId){//ʡID���
						provincebak.push("<option value="+o.cityId+">"+o.name+"</option>");
					}
				});
				if(provincebak.length>0){//��ʱ��������
					$("#cityId").append(provincebak.join(''));
				}
			}else{
				return false;
			}
		});
	});
	//��������Ϣ
	$("#cityId").change(function(){
		$("#areaId").empty().append("<option value=\"0\">ѡ����</option>");
		$("#codeId").empty().append("<option value=\"0\">ѡ������</option>");
		var cityId = this.value;//����ID 
		$.ajaxSettings.async = false;
		var url = getPath()+'/ajax/loadRangeNew';
		$.post(url,{type:'areas', typeId:cityId},function(data){
			if(data.ajaxResponse == 1){//ajax��Ӧ�ɹ�
				var citybak = [];
				$.each(data.rangeList,function(i,o){
					if(o.cityId == cityId){//����ID���
						citybak.push("<option value="+o.areaId+">"+o.name+"</option>");
					}
				});
				if(citybak.length>0){//��ʱ��������
					$("#areaId").append(citybak.join(''));
				}
			}else{
				return false;
			}
		});
	});
	//����������Ϣ
	$("#areaId").change(function(){
		var areaId = this.value;//��ID 
		$("#codeId").show();
		var codeId = "";
		if(areaId==0){
			$("#codeId").empty().hide();
		}else{
			$("#codeId").empty();
			var url = getPath()+'/ajax/loadRangeNew';
			$.post(url,{type:'codes', typeId:areaId},function(data){
				if(data.ajaxResponse == 1){//ajax��Ӧ�ɹ�
					var areabak = [];
					$.each(data.rangeList,function(i,o){
						if(o.areaId == areaId){//��ID���
							if(o.name != null){
								$("#codeId").css('visibility','visible');//��ʾ��Χ��ص���Ϣ
								$("#codeId").empty().append("<option value=\"0\">ѡ������</option>");	
								areabak.push("<option value="+o.codeId+" >" + o.name + "</option>");
							}else{
								codeId = o.codeId;
							}
						}
					});
					if(areabak.length > 0){//��ʱ��������
						$("#codeId").append(areabak.join(''));
						$('#expAddressTip').html("");
					}else{ //û������Ļ�
						$("#codeId").append("<option value=" + codeId + "></option>");	
						$('#expAddressTip').html("");
						$("#codeId").css('visibility','hidden');//���ػ����� ��Χ��ص���Ϣ
					}
					getFreight();
					//����������Ϣ
				    $("div[class='orderSure-orderDetail']").each(function(){
				    	$(this).find("td[name='buyCarsendstyle']").show();
				    });
					
				}else{
					return false;
				}
			});
		}
	});
	//�ı�����
	$("#codeId").change(function(){
		getFreight();
	});
	
//---------------------------------����ʡ���������˷���ؿ�ʼ-------------------------------------------------//	
function getFreight(){
	
}
//---------------------------------����ʡ���������˷���ؽ���-------------------------------------------------//
//---------------------------------����ȡƱ��֤����֤��ؿ�ʼ-------------------------------------------------//

$("#selfVoucher").blur(function(){
	var cardtype = $("#voucherType option:selected").val();
	var selfVoucher = $("#selfVoucher").val();
	if(cardtype == "0"){
		var cardFlag = validateCard(selfVoucher);
		if(cardFlag == 1){
			$('#selfVoucherTip').html("<span class='red'>���֤�Ų���Ϊ��!</span>");
		}else if(cardFlag == 2){
			$('#selfVoucherTip').html("<span class='red'>���֤���벻��ȷ!</span>");
		}else{
			$('#selfVoucherTip').html("");
		}
	}else if(cardtype == "1"){
		var cardFlag = validatePersonCard(selfVoucher); 
		if(cardFlag == 1){
			$('#selfVoucherTip').html("<span class='red'>���պŲ���Ϊ��!</span>");
		}else if(cardFlag == 2){
			$('#selfVoucherTip').html("<span class='red'>���պ��벻��ȷ!</span>");
		}else{
			$('#selfVoucherTip').html("");
		}
	};

});
//---------------------------------����ȡƱ��֤����֤��ؽ���-------------------------------------------------//
//----------------------------��ѯ��ȯ��ز�����ʼ---------------------------------------------//
	//��ѯ�ֽ�ȯ����ز���
	$('#queryCashCoup').bind('click', queryCashCoup);//����ѯ�ֽ�ȯ��ť���¼�
	function queryCashCoup(){
		var cashCouponNo = $('#cashCouponNo').val();
		var productId = $("#productid").val();
		var subtotalval = $("#subtotalval").val();
		var fconfigid = $("#fconfigid").val();
		if(productId == null || subtotalval == null || fconfigid == null){
			$("#cashCoupInfo").hide();
			$('#useCashCoupSb').hide();
			$('#cashCoupTip').html("<span class='red' >�Ƿ�������</span>");
			return false;
		}
		if($.trim(cashCouponNo) == null || $.trim(cashCouponNo) == ""){
			$("#cashCoupInfo").hide();
			$('#useCashCoupSb').hide();
			$('#cashCoupTip').html("<span class='red' >�������ֽ�ȯ���룡</span>");
			return false;
		}else{
			var url = getPath()+"/ajax/findCashCoupon";
			$.post(url,{cashCouponNo:$.trim(cashCouponNo), productId:productId,subTotalVal:subtotalval,fconfigId:fconfigid},function(data){
				if(data.ajaxResponse == 1){//ajax��Ӧ�ɹ�
					$('#cashCoupTip').html("");
					if(data.flag == -2){//�ж��ֽ�ȯ�Ƿ��ѯ�쳣
						$('#cashCoupTip').html("<span class='red' >��������ֽ�ȯ�����ڣ����������벦�����ֿͷ��绰4006-228-228ѯ�ʣ�</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == -1){//�ж��ֽ�ȯ�Ƿ��ѯ�쳣
						$('#cashCoupTip').html("<span class='red' >�ֽ�ȯ��ѯ�쳣�����������벦�����ֿͷ��绰4006-228-228ѯ�ʣ�</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 0){//�ж��ֽ�ȯ��״̬�Ƿ�Ϊ�Ѿ�ָ��
						$('#cashCoupTip').html("<span class='red' >�����ֽ�ȯ����Ч�����������벦�����ֿͷ��绰4006-228-228ѯ�ʣ�</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 1){ //�ж��ֽ�ȯ�Ƿ��Ѿ�ʹ��
						$('#cashCoupTip').html("<span class='red' >��������ֽ�ȯ����"+data.beUsedTime+"��ʹ�ã����������벦�����ֿͷ��绰4006-228-228ѯ�ʣ�</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 2){//�ж��ֽ�ȯ�Ƿ��Ѿ�����
						$('#cashCoupTip').html("<span class='red' >�����ֽ�ȯ����"+ data.endDate +"ʧЧ��</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 3){//�ж��ֽ�ȯ�Ƿ����������ֹ���ʹ��
						$('#cashCoupTip').html("<span class='red' >��������ֽ�ȯ���������ֹ���ʹ�ã����������벦�����ֿͷ��绰4006-228-228ѯ�ʡ�</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 4){//�ж��½�Ȫ�Ƿ������ڸ÷�վ
						$('#cashCoupTip').html("<span class='red' >��������ֽ�ȯ���������ڹ���ǰ��վ����Ʒ��</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 5){//�ж���Ʒ�Ƿ����ڲ������ֽ�ȯ����Ʒ�еı�ʶ
						$('#cashCoupTip').html("<span class='red' >��������ֽ�ȯ���������ڹ���ǰ��Ʒ��</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 6){//�ж��Ƿ��������Ʊ������ѽ��
						$('#cashCoupTip').html("<span class='red' >��������ֽ�ȯ���������"+ data.lowestExpense +"Ԫ�ſ�ʹ�ã�</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 7){//�ж��ֽ�ȯ�Ƿ��Ѿ���ѯ������
						$('#cashCoupTip').html("<span class='red' >��������ֽ�ȯ�Ѿ������ڡ������ֽ�ȯ���У���ֱ��ʹ�ã�</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 8){//�ж��Ƿ����ڲ���ʹ���ֽ�ȯ����Ʒ����ı�ʶ
						$('#cashCoupTip').html("<span class='red' >��������ֽ�ȯ���������ڹ���ǰ��Ʒ��</span>");
						$("#cashCoupInfo").hide();
						$('#useCashCoupSb').hide();
						return false;
					}
					else if(data.flag == 9){//�ж��ֽ�ȯ�Ƿ�ʹ������
						$('#cashCoupTip').html("<span class='red' >�ֽ�ȯ��ʱ����ʹ�ã�</span>");
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
	//----------------------------��ѯ��ȯ��ز�������---------------------------------------------//
	
	//----------------------------�ж��Ƿ�����Ʊ���տ�ʼ-------------------------------------------//
	$("#insuredStatus").click(function(){
		if($("#insuredStatus").attr("checked") == undefined){
			//���ر���������������֪
			$("#insuredStatusAndZeRenDiv").slideUp(300);
			//����ѡ��Ʊ����Ĭ�ϲ�ͬ��
			$("#insuredStatusAndZeRen").removeAttr('checked');
			//���ȡ��
			$("#returnEnsured").hide();
			$(".font-taho").hide();
			sumExpense();
			useCashCouponAndRenewal();
			$("#returnTicketSureAgree").hide();
			$("#insuredStatus").val(0);
			var cusAddressId=$('input:radio[name="address"]:checked').val();
			isCashOnDelivery(cusAddressId);//ȡ����Ʊ������֤�Ƿ�֧�ֻ�������
		}else{
			//��ʾ����������������֪
			$("#insuredStatusAndZeRenDiv").slideDown(300);
			//Ĭ�Ϲ�ѡͬ��
			$("#insuredStatusAndZeRen").attr('checked','checked');
			//���ѡ��
			$("#returnEnsured").show();
			$(".font-taho").show();
			sumExpense();
			useCashCouponAndRenewal();
			//$("#returnTicketSureAgree").show();
			$("#returnTicketSureAgree").hide();
			$("#insuredStatus").val(1);
			
			$(".cashOnDelivery").attr("style","display:none;"); //���ػ�������
			$(".cashOnDelivery").each(function(index, obj) {
				$(".cashOnDelivery").attr("style","display:none;");
			});
			$("#hdfkInptRadio").attr("checked",false);
			$("#hdfkInptRadio").removeAttr("checked");
			
			
		}
	})
	//----------------------------�ж��Ƿ�����Ʊ���ս���----------------------------------------//
	//----------------------------ʹ���ֽ�ȯ��ѡ��ʼ-------------------------------------------//
	$("input[name='cashcouponid']").click(function(){
		//���ֽ��ȯ��ʹ��
		$("#cashCouponNo").val("");
		$("#cashCoupInfo").attr("style","display:none;");
		$("#useCashCoup").attr("style","display:none;");
		var parvalue = $('input:radio[name="cashcouponid"]:checked').val(); //���
		var cashNo = $('input:radio[name="cashcouponid"]:checked').attr("cash"); //�ֽ�ȯID
		$("#cashCouponVal").val(parvalue);
		$("#cashcouponinfoid").val(cashNo);
		//����յ�Ԥ����Ԥ�������
		$("#inputRenewal").val(0);
		$("#useRenewal").val(0);
		$("#passwordRenewal").val("");
		useCashCouponAndRenewal();
		
	})	
	//----------------------------ʹ���ֽ�ȯ��ѡ����-------------------------------------------//
	//----------------------------ʹ���ֽ�ȯ��ť��ʼ-------------------------------------------//
	$("#useCashCoup").click(function(){
		$('input:radio[name="cashcouponid"]:checked').attr("checked",false);//�����ѡ�ֽ�ȯ��ѡ����ʽ
		var cashCoupMoney = $("#cashCoupMoney").html() * 1; //���
		var cashNo = $('#cashCouponNo').val();//�ֽ�ȯ��
		$("#cashCouponVal").val(cashCoupMoney);
		$("#cashcouponinfoid").val(cashNo);
		//����յ�Ԥ����Ԥ�������
		$("#inputRenewal").val(0);
		$("#useRenewal").val(0);
		$("#passwordRenewal").val("");
		useCashCouponAndRenewal();
		
	})
	//----------------------------ʹ���ֽ�ȯ��ť����-------------------------------------------//
	//----------------------------ȡ��ʹ���ֽ�ȯ��ʼ-------------------------------------------//
	$("#ticketuse").click(function(){
		if($("#ticketuse").attr("checked") == undefined){
			//����Ѿ�ʹ�õ��ֽ�ȯ
			$('input:radio[name="cashcouponid"]:checked').attr("checked",false); 
			$("#cashCouponNo").val("");
			$("#cashCoupInfo").attr("style","display:none;");
			$("#useCashCoup").attr("style","display:none;");
			$("#cashCouponVal").val(0);
			$("#cashcouponinfoid").val(0);
			useCashCouponAndRenewal();
			$(this).parent().parent().next().slideUp(300);
		}else{
			//���ѡ��
			$(this).parent().parent().next().slideDown(300);
		}
	})	
	//----------------------------ȡ��ʹ���ֽ�ȯ����-------------------------------------------//
	//----------------------------ʹ��Ԥ��ʼ-------------------------------------------//
	$("#inputRenewal").change(function(){
		var inputRenewal = $("#inputRenewal").val()*1; //�û������Ԥ���
		var cusRenewal = $("#cusRenewal").text()*1; //�û�ʣ���Ԥ���
		var dealWith = $("#dealWith").html()*1; //Ӧ���ܶ�
		var cashCouponVal = $("#cashCouponVal").val()*1; //�ֽ�ȯ���
		var renewal = $("#useRenewal").val()*1; //Ԥ�����
		var endVal = (parseFloat(dealWith)-parseFloat(cashCouponVal)).toFixed(2);
		//����û�����Ľ������Լ���Ԥ���
		if(inputRenewal > cusRenewal){
			inputRenewal = cusRenewal;
		}
		//����û�����Ľ����ڶ������
		if(inputRenewal > endVal){
			inputRenewal = endVal;
		}
		//�������Ԥ���������֧����������Ϊ0
		if(inputRenewal <= 0){
			inputRenewal = 0;
		}
		$("#useRenewal").val(inputRenewal);
		$("#inputRenewal").val(inputRenewal);
		useCashCouponAndRenewal();
		
	})	
	//----------------------------ʹ��Ԥ������-------------------------------------------//	
	//----------------------------��֤Ԥ������뿪ʼ-------------------------------------------//
	$("#passwordRenewal").change(function(){
		var customerId = $("#customerId").val();
		var password = $("#passwordRenewal").val();
		var url = getPath()+"/ajax/findRenewal";
		$.post(url,{password:password,customerId:customerId},
			function(data){
				if(data == 0){
					//�������
					$("#renewalMsg").html("Ԥ����������");
					return false;
				}else{
					//������ȷ
					$("#renewalMsg").html("Ԥ���������ȷ��");
				}
		});		
	})	
	//----------------------------��֤Ԥ����������-------------------------------------------//		
	//----------------------------��ѡ֧����ʽ��ʼ-------------------------------------------//
	$("input[name='bank']").click(function(){
		var payId = $('input:radio[name="bank"]:checked').val(); //֧��ID
		$("#payId").val(payId); //�����
	})	
	//----------------------------��ѡ֧����ʽ����-------------------------------------------//
	//----------------------------����Ч����ʼ-------------------------------------------//
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
			//ѡ���Ż�
			var forms = promoDis.attr("forms");
			salecalculate(forms);
			$("#activeNo").val(promoDis.val());
			//��ȡ���е�֧����ʽ
			var payCode = promoDis.attr("payCode");
			if(payCode){
				$('input:radio[name="bank"]').each(function(index, obj) {
					if(obj.value!=payCode){
						//֧����ʽ�û� �Ƴ�ѡ��
						obj.setAttribute("disabled","disabled");
						obj.checked=false;
					}
				});
			}else{
				$('input:radio[name="bank"]').each(function(index, obj) {
					//֧����ʽ����
					obj.removeAttribute("disabled");
				});
			}
		});
		$(".cancelpromo").click(function(){
			$(".salshow-box").hide();
			$(".sale-link-border").show();

		});
		//----------------------------����Ч������-------------------------------------------//
});
//----------------------------ѡ�������ͼ����˷�----------------------------------------//
function clickExpress(){
	//ѡ�е����͵�ַ
	var cusAddressId=$('input:radio[name="address"]:checked').val();
	//û���ջ���ַ
	if(cusAddressId == undefined || cusAddressId == null || cusAddressId ==""){
		//��������ջ���ַ
		addAddress();
	}else{
		//������� 
		getFreightByCusAdd(cusAddressId);
		//isCashOnDelivery(cusAddressId);
	}
	isInsured();
}
//----------------------------ѡ�������ͼ����˷�----------------------------------------//
//----------------------------ѡ��������ȡȡ���˷�----------------------------------------//
function clickDoor(){
	$("#freightVal").val(0);
	$(".cashOnDelivery").attr("style","display:none;"); //���ػ�������
	$("#editCustomerAddr").hide(); //���ر༭��ַ
	sumExpense();
	isInsured();
	useCashCouponAndRenewal();
	$("#addressId").val(0);
}
//----------------------------ѡ��������ȡȡ���˷�----------------------------------------//
//----------------------------ѡ�����Ʊȡ���˷�----------------------------------------//
function eTicket(){
	$("#freightVal").val(0);
	$(".cashOnDelivery").attr("style","display:none;"); //���ػ�������
	$("#editCustomerAddr").hide(); //���ر༭��ַ
	sumExpense();
	isInsured();
	useCashCouponAndRenewal();
	$("#addressId").val(0);
	//ȡ����ʾ��Ʊ
	$("#returnEnsured").hide();
	$(".font-taho").hide();
	$(".insPrice").hide();
	sumExpense();
	useCashCouponAndRenewal();
	$("#returnTicketSureAgree").hide();
	$("#insuredStatus").val(0);
	var cusAddressId=$('input:radio[name="address"]:checked').val();
	isCashOnDelivery(cusAddressId);//ȡ����Ʊ������֤�Ƿ�֧�ֻ�������
}
//----------------------------ѡ�����Ʊȡ���˷�----------------------------------------//
//----------------------------�������͵�ַID�����˷�----------------------------------------//
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
	//��֤�Ƿ�֧�ֻ�������
	//isCashOnDelivery(cusAddressId);
	//�ж��Ƿ�����Ʊ����
	checkInsuredStatus();
	//����ַID�ŵ���
	$("#addressId").val(cusAddressId);
}
//----------------------------�������͵�ַID�����˷�----------------------------------------//
//----------------------------���㱣�ѣ��˷ѣ���Ʒ�����ܺ�----------------------------------------//
function sumExpense(){
	var subTotal = $("#subtotalval").val()*1;//�������
	var premiumVal = $("#premiumVal").val()*1;//��ǰ����
	var freightVal = $("#freightVal").val()*1; //�˷�
	//δ��ѡ��Ʊ��ť,���Ѽ���Ϊ0
	if($("#insuredStatus").attr("checked") == undefined){
		premiumVal = 0;
	}
	//��ѡ������ȡ���˷�Ϊ0
	if($("#doorRadio").attr("checked") != undefined){
		freightVal = 0;
	}
	//�ֽ�ȯ���
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
//�ж��Ƿ�֧�ֻ�������
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
			//�Ƿ�֧�ֻ�������     0��֧�� 1 ֧��
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
//ʹ���ֽ�ȯ��Ԥ���֮��ļ���
function useCashCouponAndRenewal(){
	var cashCouponVal = $("#cashCouponVal").val()*1; //�ֽ�ȯ���
	var renewal = $("#useRenewal").val()*1; //Ԥ�����
	$("#alreadyVal").html(cashCouponVal+renewal); //��Ʒ��֧��
	//���㻹��֧���Ľ�� Ӧ����-�ֽ�ȯ-Ԥ���
	var dealWith = $("#dealWith").html()*1; //Ӧ֧��
	var endVal = (parseFloat(dealWith)-parseFloat(cashCouponVal)-parseFloat(renewal)).toFixed(2);
	var activeNo = $("#activeNo").val();
	var promoDis=$("input:radio[name='promoDis'][value="+activeNo+"]");
	var formula = promoDis.attr("forms");
	salecalculate(formula);
	//�����ڵ�����֧���Ľ��
//	if(endVal <= 0){
//		$("#endVal").html("0");
//	}else{
//		$("#endVal").html(endVal);
//	}
//	
}
//�ж��Ƿ���ʾ��Ʊ����
function isInsured(){
	//��Ʒ���ã��ݳ�ǰ��������Ʊ����֧����Ʊ���� 
	//��Ʒ����
	var isInsured = $("#isInsured").val();
	//�Ƿ��ݳ�ǰ���� 0�� 1��
	var isDifferTime = $("#isDifferTime").val();
	//��ǰѡ�е����ͷ�ʽ 1������� 2������ȡ 4����Ʊ
	var val=$('input:radio[name="sendStyle"]:checked').val();
	if(isDifferTime == 1||val == 4 ||isInsured == 0){
		//��֧����Ʊ����
		$("#insuredStatus").attr("checked",false);
		//����ѡ��Ʊ����Ĭ�ϲ�ͬ��
		$("#insuredStatusAndZeRen").removeAttr('checked');
		$("#insuredDiv").hide();
		$("#insuredStatusAndZeRenDiv").hide();
	}else{
		//֧����Ʊ����
		$("#insuredDiv").show();
	}
}
//��ֹ�¼�ð�ݵ�ͨ�ú���  
function stopBubble(e){  
    // ����������¼�������ô���Ƿ�ie�����  
    if(e&&e.stopPropagation){  
        //�����֧��W3C��stopPropagation()����  
        e.stopPropagation();  
    }else{  
        //��������ʹ��ie�ķ�����ȡ���¼�ð��  
        window.event.cancelBubble = true;  
    }  
}  


//�ж��Ƿ�����Ʊ����
function checkInsuredStatus(){
	if($("#insuredStatus").attr("checked") == undefined){
		//���ȡ��
		$("#returnEnsured").hide();
		$(".font-taho").hide();
		sumExpense();
		useCashCouponAndRenewal();
		$("#returnTicketSureAgree").hide();
		$("#insuredStatus").val(0);
		var cusAddressId=$('input:radio[name="address"]:checked').val();
		isCashOnDelivery(cusAddressId);//ȡ����Ʊ������֤�Ƿ�֧�ֻ�������
	}else{
		//���ѡ��
		$("#returnEnsured").show();
		$(".font-taho").show();
		sumExpense();
		useCashCouponAndRenewal();
		//$("#returnTicketSureAgree").show();
		$("#returnTicketSureAgree").hide();
		$("#insuredStatus").val(1);
		$(".cashOnDelivery").attr("style","display:none;"); //���ػ�������
		$(".cashOnDelivery").each(function(index, obj) {
			$(".cashOnDelivery").attr("style","display:none;");
		});
		$("#hdfkInptRadio").attr("checked",false);
		$("#hdfkInptRadio").removeAttr("checked");
		$("#hdfkInptRadio").attr("checked",false);
		$("#hdfkInptRadio").removeAttr("checked");
	}
}
//��Ʊ������ȡ��ʼ������
function selfGetDigitalidNew(c){
	//��ǰ�ڵ����class=active �����ֵܽڵ��Ƴ�
	$(c).parent().addClass("active").siblings().removeClass("active");
	if($(c).val()==20){
		//��ʾ������ȡ
		$("#selfGetDigitalidShow").attr("style","display:block;");
		//���ؿ������
		$("#cashOnDeliveryDigitalidShow").attr("style","display:none;");
	}
	else if($(c).val()==10){
		//����������ȡ
		$("#selfGetDigitalidShow").attr("style","display:none;");
		//��ʾ�������
		$("#cashOnDeliveryDigitalidShow").attr("style","display:block;");
		//ѡ��Ĭ�Ͽ�����͵�ַ
		$("input[name=addressDigitalid]:eq(0)").click();
	}
}

//���չ�ʽ������
function salecalculate(formula){
	if(formula == null || formula == "" || formula == undefined){
		return false;
	}
	var bPrice = 0;//�����ܽ��
	if($("#insuredStatus").attr("checked") != undefined){
		//��ѡ��Ʊ���գ���ֵ
		bPrice = $("#premiumVal").val()*1;
	}
	
	var yPrice = 0;//�˷��ܽ��
	if($('input:radio[name="sendStyle"]:checked').val() == 1){
		//��ѡ��Ʊ���գ���ֵ
		bPrice = $("#freightVal").val()*1;
	}
	//���ۺ����������ϲ�Ӧ�ó���
	var sPrice = 0;//���� 
	var ticNum = $("#countNum").val();//����
	var sysTime= new Date().getTime();
	var cPrice = $("#cashCouponVal").val();//�ֽ�ȯ���
	var ePrice = $("#useRenewal").val();//Ԥ�����
	var zPrice = eval($("#dealWith").html()*1-cPrice-ePrice);//�ۺ��ܽ��
	//���㻹��֧���Ľ��
	var endPrice = eval(formula);
	//�����Żݽ��
	var salePrice = eval(zPrice-endPrice);
	if(salePrice <= 0){
		salePrice = 0;
	}
	$("#promoVal").html(salePrice);
	$("#promoDisVal").val(salePrice); //����ѡ�е��Żݽ��
	
	if(endPrice <= 0){
		$("#endVal").html("0");
	}else{
		$("#endVal").html(endPrice);
	}
	
	
}

//�жϻ�Ƿ����
function saleUsable(){
	var bPrice = 0;//�����ܽ��
	if($("#insuredStatus").attr("checked") != undefined){
		//��ѡ��Ʊ���գ���ֵ
		bPrice = $("#premiumVal").val()*1;
	}
	
	var yPrice = 0;//�˷��ܽ��
	if($('input:radio[name="sendStyle"]:checked').val() == 1){
		//��ѡ��Ʊ���գ���ֵ
		bPrice = $("#freightVal").val()*1;
	}
	//���ۺ����������ϲ�Ӧ�ó���
	var sPrice = 0;//���� 
	var ticNum = $("#countNum").val();//����
	var sysTime= new Date().getTime();
	var cPrice = $("#cashCouponVal").val()*1;//�ֽ�ȯ���
	var ePrice = $("#useRenewal").val()*1;//Ԥ�����
	var zPrice = eval($("#dealWith").html()*1-cPrice-ePrice);//�ۺ��ܽ��
	var activeNo = $("#activeNo").val();
	var promoDis=$("input:radio[name='promoDis'][value="+activeNo+"]");
	var promoDisVal = promoDis.val();
	var flag = 1;//�Ƿ����ʹ�ô���� 0������1����
	if(promoDisVal&&promoDisVal != -1){
		var rules = promoDis.attr("rules").replace("[","").replace("]","");
		var flag = 1 ; //�����Ƿ����� 0�� 1 ��
		if(rules !=null && rules != ""){
			var rulesArr = rules.split(",");
			for ( var i = 0; i < rulesArr.length; i++) {
				if(!eval(rulesArr[i])){
					alert("�����㵱ǰ�������������");
					flag = 0;
					break;
				}
			}	
		}
		var payCode = $("input:radio[name='promoDis']:checked").attr("payCode");
		var payId = $('input:radio[name="bank"]:checked').val(); //֧��ID
		var payName = $("input:radio[name='bank']:checked").attr("payName");
		if(payId!=null && payId != "" && payId != undefined){
			if(payCode != payId){
				alert("��ѡ��Ĵ����ֻ֧��"+payName+"֧����ʽ");
				flag = 0;
				return flag;
			}
		}
	}
	//�������֤ʧ��
	return flag;
	
}
