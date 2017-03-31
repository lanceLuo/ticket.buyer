
$(function(){
	//-----------------------------------��֤�ֻ���ʼ---------------------------------------------------------//
	function validatePhone(phone){
		var phoneFlag = 0;//�����ֻ���֤��ʶ
		var phoneVal = phone;
		//var ph_re = /^(1(([35][0-9])|(47)|[8][012356789]))\d{8}$/;//��֤�ֻ�������ʽ
		var ph_re = /^[1][3-8]\d{9}$|^([5|6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;//��֤�ֻ�������ʽ
		var gotPhone_re=/^([5|6|9])\d{7}|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;//�۰�̨�ֻ���������ʽ
		if($.trim(phoneVal)==""){//�ǿ�
			phoneFlag = 1;
		}
		else if(!ph_re.test(phone)){
			phoneFlag = 2;
		}else if(gotPhone_re.test(phone)){
			phoneFlag = 3;
		}
		return phoneFlag;
	}
	//-----------------------------------��֤�ֻ�����---------------------------------------------------------//
	//-----------------------------------��֤֤���ſ�ʼ---------------------------------------------------------//
	//��֤���֤
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
	//��֤���պ�
	function validatePersonCard(card){
		var cardFlag = 0;//���û�����֤��ʶ
		var cardVal = card;
		//����������ʽ
		isIDCard=/(^[A-Za-z0-9]+$)/;
		if($.trim(cardVal)==""){//�ǿ�
			cardFlag = 1;
    	}else if(!isIDCard.test(cardVal)){
			cardFlag = 2;
		}
		return cardFlag;
	}
	//-----------------------------------��֤֤���ſ�ʼ---------------------------------------------------------//
	
	//������ȡ�û���ϢУ��ʧȥ���㿪ʼ
	$("#doorUserName").blur(function(){
		var doorUserName = $("#doorUserName").val();
		//�û���Ϊ��
		if($.trim(doorUserName) == ""){
			$('#selfGetNameTip').html("<span class='red'>��ʵ��������Ϊ��!</span>");
		}else if(verifyName(doorUserName)!=0){
			$('#selfGetNameTip').html("<span class='red'>������ʽ����!</span>");
		}else{
			$('#selfGetNameTip').html("");
		}
	});
	
	$("#doorUserPhone").blur(function(){
		var doorUserPhone = $("#doorUserPhone").val();
		var phoneFlag = validatePhone(doorUserPhone);
		if(phoneFlag == 1){
			$('#selfGetPhoneTip').html("<span class='red'>�ֻ����벻��Ϊ��!</span>");
		}else if(phoneFlag == 2){
			$('#selfGetPhoneTip').html("<span class='red'>�ֻ������ʽ����ȷ!</span>");
		}else{
			$('#selfGetPhoneTip').html("");
		}
	});
	
	//������ȡ�û���ϢУ��ʧȥ�������
	//��Ʊ�ֻ���ʧȥ����
	$("#userDigitalidPhone").blur(function(){
		var userDigitalidPhone = $("#userDigitalidPhone").val();
		var phoneFlag = validatePhone(userDigitalidPhone);
		if(phoneFlag == 1){
			$('#selfGetPhoneTipDigitalid').html("<span class='red' style='padding-left: 0px;'><i class='tsyy'>�ֻ����벻��Ϊ��!</i></span>");
		}else if(phoneFlag == 2){
			$('#selfGetPhoneTipDigitalid').html("<span class='red' style='padding-left: 0px;'><i class='tsyy'>�ֻ������ʽ����ȷ!</i></span>");
		}else{
			$('#selfGetPhoneTipDigitalid').html("");
		}
	});
	
	//����Ʊ�û���ϢУ��ʧȥ���㿪ʼ
	$("#eTicketPhone").blur(function(){
		var eTicketPhone = $("#eTicketPhone").val();
		var phoneFlag = validatePhone(eTicketPhone);
		if(phoneFlag == 1){
			$('#eTicketPhoneTip').html("<span class='red'>�ֻ����벻��Ϊ��!</span>");
		}else if(phoneFlag == 2){
			$('#eTicketPhoneTip').html("<span class='red'>�ֻ������ʽ����ȷ!</span>");
		}else{
			$('#eTicketPhoneTip').html("");
		}
	});
	
	$("#eTicketName").blur(function(){
		var eTicketName = $("#eTicketName").val();
		//�û���Ϊ��
		if($.trim(eTicketName) == ""){
			$('#eTicketNameTip').html("<span class='red'>��ʵ��������Ϊ��!</span>");
		}else{
			$('#eTicketNameTip').html("");
		}
	});
	
	$("#eTicketCard").blur(function(){
		var eTicketCard = $("#eTicketCard").val();
		var cardFlag = validateCard(eTicketCard);
    	if(cardFlag == 1){
    		$('#eTicketCardTip').html("<span class='red'>���֤�Ų���Ϊ��!</span>");
    	}else if(cardFlag == 2){
    		$('#eTicketCardTip').html("<span class='red'>���֤���벻��ȷ!</span>");
    	}else{
    		$('#eTicketCardTip').html("");
    	}
	});
	
	//����Ʊ�û���ϢУ��ʧȥ�������
	//����������
	$("#iAgreeClause").click(function(){
		if($(this).attr("checked") == undefined){
			$("#orderSureError").show();
			$("#errorMsg").html("�ݲ����ύ��������ͬ��������")
		}else if($(this).attr("checked") == "checked"){
			$("#orderSureError").hide();
			$("#errorMsg").html("")
		}
	});
	
	//�ύ���ɶ���
	$("#saveOrder").click(function(){
		var flag  = saleUsable();//��֤����
		if(flag == 0){
			//�������֤ʧ��
			return;
		}
		var discountdetailid = $('input:radio[name="bank"]:checked').val();
		$("#discountdetailid").val(discountdetailid);
		//��֤�Ƿ�ѡ�������ʼ
		if($("#iAgreeClause").attr("checked") == undefined){
			$("#orderSureError").show();
			$("#errorMsg").html("�ݲ����ύ��������ͬ��������")
			return;
		}
		//��֤�Ƿ�ѡ�����������
		
		//��֤ʵ������ʼ
		var truebuy = $("#truebuy").val(); //��ȡʵ��������� 0Ϊ���� 1Ϊ��
		//��֤����֤����Ϣ��ʼ
		var cardInfo = new Array();
		//�洢��Ϣ������
		var cardnos = "";
		if(truebuy == 1){
			var flagCardInfo=true;
			var flagCardInfos=true;
			var warninfo = true;
			var flagCardName = true; //֤����Ӧ�����Ƿ�Ϸ�
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
		        	$("#cardtypewarn"+num).html("<span class='red'>��������Ϊ��!</span>");
		        	flagCardName = false;     
		        }else if(verifyName(cardname) != 0){
	            	$("#cardtypewarn"+num).html("<span class='red'>������ʽ����!</span>");
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
			
			//�����Ϣ�Ƿ����
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
					$("#errorMsg").html("�ݲ����ύ��������������д��֤����Ϣ��");
				}else if(!flagCardInfos){
					$("#errorMsg").html("�ݲ����ύ����������ʹ����ͬ��֤�����롣");
				}
				return;
			}
			
			if(flagCardName){
				$("#orderSureError").hide();
				$("#errorMsg").html("");
			}else{
				$("#orderSureError").show();
				$("#errorMsg").html("�ݲ����ύ������֤����ʽ����")
				return;
			}
		}
		//��֤ʵ���������
		//�ύ����ǰ����֤��ʼ
		var val=$('input:radio[name="sendStyle"]:checked').val();
		//��֤�������
		if(val==1){
			var addressId = $("#addressId").val();
			if(addressId == null ||addressId == "" || addressId == undefined || addressId == 0){
				//δѡ�����͵�ַ
				$("#orderSureError").show();
				$("#errorMsg").html("�ݲ����ύ������������������ջ���ַ��");
				return;
			}
			if($('input:radio[name="address"]:checked').val()==undefined ){
				//δѡ�����͵�ַ
				$("#orderSureError").show();
				$("#errorMsg").html("�ݲ����ύ��������������д���ջ�����Ϣ��");
				return;
			}
		}//��֤������ȡ
		else if(val==2){
			var doorUserName = $("#doorUserName").val();
			var doorUserPhone = $("#doorUserPhone").val();
			var phoneFlag = validatePhone($("#doorUserPhone").val());
			//�û���Ϊ��
			if($.trim(doorUserName) == ""){
				$('#selfGetNameTip').html("<span class='red'>��ʵ��������Ϊ��!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("�ݲ����ύ��������������д���ջ�����Ϣ��");
				return;
			}else if(verifyName(doorUserName)!=0){
				$('#selfGetNameTip').html("<span class='red'>������ʽ����!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("�ݲ����ύ��������������д���ջ�����Ϣ��");
				return;
			}else{
				$('#selfGetNameTip').html("");
			}
        	if(phoneFlag == 1){
        		$('#selfGetPhoneTip').html("<span class='red'>�ֻ����벻��Ϊ��!</span>");
        		$("#orderSureError").show();
    			$("#errorMsg").html("�ݲ����ύ��������������д���ջ�����Ϣ��")
        		return;
        	}else if(phoneFlag == 2){
        		$('#selfGetPhoneTip').html("<span class='red'>�ֻ����벻��ȷ!</span>");
        		$("#orderSureError").show();
    			$("#errorMsg").html("�ݲ����ύ��������������д���ջ�����Ϣ��")
        		return;
        	}else{
        		$('#selfGetPhoneTip').html("");
        	}
			
		}//��֤����Ʊ
		else if(val==4){
			var eTicketPhone = $("#eTicketPhone").val();
			var eTicketName =  $("#eTicketName").val();
			var phoneFlag = validatePhone(eTicketPhone);
			//�û���Ϊ��
			if($.trim(eTicketName) == ""){
				$('#eTicketNameTip').html("<span class='red'>��ʵ��������Ϊ��!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("�ݲ����ύ��������������д���ջ�����Ϣ��");
				return;
			}else{
				$('#eTicketNameTip').html("");
			}
			
			if(phoneFlag == 1){
				$('#eTicketPhoneTip').html("<span class='red'>�ֻ����벻��Ϊ��!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("�ݲ����ύ��������������д���ջ�����Ϣ��");
				return;
			}else if(phoneFlag == 2){
				$('#eTicketPhoneTip').html("<span class='red'>�ֻ������ʽ����ȷ!</span>");
				$("#orderSureError").show();
				$("#errorMsg").html("�ݲ����ύ��������������д���ջ�����Ϣ��");
				return;
			}else{
				$('#eTicketPhoneTip').html("");
			}
		}
		//�ύ����ǰ����֤����
		var obj = {} ;
		obj.cityid = parseInt($("#fconfigid").val());
		obj.cityname = $("#cityname").val();
		obj.tickets = $("#products").val();
		obj.shipment = parseInt($('input:radio[name=sendStyle]:checked').val());
		//��Ʊ����
		if($('#insuredStatus').attr('checked')){
			obj.insurance = 1;
			//�����ѡ��Ʊ���� ���빴ѡ�����Ķ���ͬ�� ����������������֪
			if($('#insuredStatusAndZeRen').attr('checked') == undefined){
				$("#errorMsg").html("�ݲ����ύ��������ͬ�Ᵽ�����������֪");
				$("#orderSureError").show();
				return;
			}
		}else{
			obj.insurance = 0;
		}
		obj.cashno = $("#cashcouponinfoid").val();
		obj.renewal = parseFloat($("#useRenewal").val()).toFixed(2);
		//��������
		var cash=$('input:radio[name="sendSty1"]:checked').val();
		if(cash == 1){
			obj.shipment = 3;
		}
		//���������ȡ
		if(val == 2){
			obj.consignee = $("#doorUserName").val();
			obj.consignee_phone = $("#doorUserPhone").val();
		}else if(val == 4){ //����Ʊ
			obj.consignee = $("#eTicketName").val();
			obj.consignee_phone = $("#eTicketPhone").val();
			var dzType = $('input:radio[name=eticketname]:checked').val();
			if(dzType == 1){
				obj.consignee_idcard =  $("#eTicketCard").val();
			}
		}
		if(truebuy == 1){
			//ʵ����Ʊ���
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
		//��Ʊ�¿�ʼ
		if($("#getTicket").attr("checked") != undefined){
			    var getTicketVal = $("#getTicket").attr("disabled");
				var oInvoiceinfo;
				//��Ʊ��Ϊ��Ʊ��ʱ��
				if(getTicketVal == "disabled"){
					oInvoiceinfo = "��Ʊ��Ϊ��Ʊ";
				}
				else{	
						//��Ҫ����Ʊ��ʱ��	
						//���뷢Ʊ̧ͷ����Ϊ��
						oInvoiceinfo = $("#invoice").val();
						if(oInvoiceinfo == "" || oInvoiceinfo == "����д��˾��Ʊ̧ͷ"){
								$("#errorMsg").html("�ݲ����ύ���������鷢Ʊ��Ϣ��");
								$("#orderSureError").show();
								return;
						}
						//��ͬ����ȡ��ʽ
						var sendStyleDigitalid = $('input:radio[name="sendStyleDigitalid"]:checked').val();
						//û�����ͷ�ʽ
						if(sendStyleDigitalid==null || sendStyleDigitalid=="" ||sendStyleDigitalid==undefined){
								$("#errorMsg").html("�ݲ����ύ���������鷢Ʊ��ȡ��ʽ��");
								$("#orderSureError").show();
								return;
						}
						else if(sendStyleDigitalid==10){
							//�������
							var addressDigitalid=$('input:radio[name="addressDigitalid"]:checked').val();
							//û�����͵�ַ
							if(addressDigitalid==null || addressDigitalid=="" ||addressDigitalid==undefined){
								$("#errorMsg").html("�ݲ����ύ���������鷢Ʊ�ջ���Ϣ��");
								$("#orderSureError").show();
								return;
							}
							$("#deliveryid").val(sendStyleDigitalid);	
							$("#writecheckaddressid").val(addressDigitalid);
							$("#writecheckphone").val("");
						}
						else if(sendStyleDigitalid==20){
							//������ȡ
							var userDigitalidPhone= $("#userDigitalidPhone").val();
							var phoneFlag = validatePhone(userDigitalidPhone);
							if(phoneFlag == 1){
				        		$('#selfGetPhoneTipDigitalid').html("<span class='red' style='padding-left: 0px;'><i class='tsyy'>�ֻ����벻��Ϊ��!</i></span>");
				        		$("#orderSureError").show();
				    			$("#errorMsg").html("�ݲ����ύ��������������д�ķ�Ʊ��Ϣ��")
				        		return;
				        	}else if(phoneFlag == 2){
				        		$('#selfGetPhoneTipDigitalid').html("<span class='red' style='padding-left: 0px;'><i class='tsyy'>�ֻ������ʽ����ȷ!</i></span>");
				        		$("#orderSureError").show();
				    			$("#errorMsg").html("�ݲ����ύ��������������д�ķ�Ʊ��Ϣ��")
				        		return;
				        	}else{
				        		$('#selfGetPhoneTip').html("");
				        	}
							$("#deliveryid").val(sendStyleDigitalid);	
							$("#writecheckphone").val(userDigitalidPhone);
							$("#writecheckaddressid").val("");
						}
						//����Ʊ
						$("#writecheckflag").val($("#writecheckflagOld").val());	
				}
				$("#oInvoiceinfo").val(oInvoiceinfo);	
			}
		else{
			//������Ʊ
			$("#writecheckflag").val("0");
			$("#deliveryid").val("");	
			$("#writecheckaddressid").val("");
			$("#writecheckphone").val("");
			$("#oInvoiceinfo").val("");	
		}
		//��Ʊ�½���
		//��Ʊ
		//if($("#getTicket").attr("checked") != undefined){
		//	var oInvoice = $('input:radio[name="ticketType"]:checked').val();
		//	var oInvoiceinfo = $("#invoice").val();
		//	if(oInvoice == 0){
		//		oInvoiceinfo = "����";
		//	}
		//	//ѡ��˾��Ʊ��ʱ��
		//	if(oInvoice == 1){
		//		if(oInvoiceinfo == "" || oInvoiceinfo == "���뷢Ʊ̧ͷ"){
		//			$("#errorMsg").html("�ݲ����ύ���������鷢Ʊ��Ϣ��");
		//			$("#orderSureError").show();
		//			return false;
		//		}
		//	}
		//	//��Ʊ��Ϊ��Ʊ��ʱ��
		//	var getTicketVal = $("#getTicket").attr("disabled");
		//	if(getTicketVal == "disabled"){
		//		oInvoice = "";
		//		oInvoiceinfo = "��Ʊ��Ϊ��Ʊ";
		//	}
		//	$("#orderForm").append('<input type="hidden" name="o[\'invoice\']" id="oInvoice" value="'+oInvoice+'"/>');
		//	$("#orderForm").append('<input type="hidden" name="o[\'invoiceinfo\']" id="oInvoiceinfo" value="'+oInvoiceinfo+'"/>');
		//}
		//����
		if($("#ylquetion").attr("checked") != undefined){
			var message = $("#message").val();
			$("#orderForm").append('<input type="hidden" name="o[\'messageinfo\']" id="oMessageinfo" value="'+message+'"/>');
		}
		//΢���ж�
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
			//�������ж�
			var mask = $("#mask").val();
			if(mask!=0){
				$("#orderForm").append('<input type="hidden" name="o[\'mask\']" value="'+mask+'"/>');
			}
			//���������
			var shadeInfos = $("#shadeInfos").val();
			if(shadeInfos!=0){
				$("#orderForm").append('<input type="hidden" name="o[\'maskinfo\']" value="'+shadeInfos+'"/>');
			}
		}
		//�����ж�
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
		//���������ж�
		if(cash == 1){
			$("#callbackurl").val($("#cashUrl").val());
			$("#orderForm").submit();
			return;
		}
		//��ͨ���ж�
		var ltkFlag = $("#ltk").attr("class");
		//ѡ����ͨ��
		if(ltkFlag == "select"){
			$("#oPayid").val(300);
			var ltkno = $("#ltkno").val();
			var ltkpwd = $("#ltkpwd").val();
			if(ltkno == "" || ltkno == null || ltkpwd == "" || ltkpwd == null){
				$("#orderSureError").show();
				$("#errorMsg").html("��������ͨ����Ϣ��")
				return;
			}else{
				$("#orderForm").append('<input type="hidden" name="o[\'letongka\']" id="letongka" value="'+ltkno+':'+ltkpwd+'"/>');
			}
		}else{
			$("#oPayid").val($("#payId").val());
		}
		//��֤Ԥ���ʹ�ÿ�ʼ
		var inputRenewal = $("#inputRenewal").val() * 1;
		if(inputRenewal>0){
			var customerId = $("#customerId").val();
			var password = $("#passwordRenewal").val();
			if(password == "" || password == null || password == undefined){
				//����Ϊ��
				$("#renewalMsg").html("������Ԥ������룡");
				$("#orderSureError").show();
				$("#errorMsg").html("������Ԥ������룡")
				return;
			}
			var url = getPath()+"/ajax/findRenewal";
			$.post(url,{password:password,customerId:customerId},
				function(data){
					if(data == 0){
						//�������
						$("#renewalMsg").html("Ԥ����������");
						$("#orderSureError").show();
						$("#errorMsg").html("Ԥ����������")
						return;
					}else{
						//������ȷ
						$("#renewalMsg").html("Ԥ���������ȷ��");
						var endVal = $("#endVal").text()*1;
						//΢���ж�
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
								$("#errorMsg").html("��ѡ��֧����ʽ!");
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
				$("#errorMsg").html("��ѡ��֧����ʽ!");
				return;
			}
			$("#orderForm").submit();
			return;
		}
		//��֤Ԥ���ʹ�ý���
	});
});
function unClick(){
	$('#saveOrder').unbind("click");
}
//��֤���� STORY #2875::ʵ���ƺ�������ȡ�������ֶ�����У��
function verifyName(name){
	//flag 0���� 1 ��ʽ���� 2����
	var flag = 0;
	var reg = /^[\u4E00-\u9FFF\u2022]+$|^[A-Za-z\.]+$/;
	if(!reg.test(name)){
		flag = 1;
	}else if(name.length > 20){
		flag = 2;
	}
	return	flag;
}
