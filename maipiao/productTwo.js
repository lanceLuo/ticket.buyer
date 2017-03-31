/*
 * jQuery product v0.4
 * Copyright (c) 2014-10-11 16:00 Jensen & C.lm
 * ˵������ƷҳЧ������
 */

		
//Ʊ��ͼ
Shadowbox.init({
	overlayOpacity : 0.8
});

//΢����������ر�
$('#JiKnow').click(function(){
	$('.weibo-box').hide();
});	

//�ݳ���Ϣѡ��л�
$('#liveNav').accordion({
    childId: '.lives-info',
    linkA: true
});
//�̶������˵������
var scrollFixed = function(params){ 
 	var opts = $.extend({
 		scrollParent: params.scrollParent,     //�����ڵ������ĸ��ڵ�
 		scrollChild: params.scrollChild        //�����ڵ�
 	},params)
 	
 	$(opts.scrollParent).css({'position':'relative','z-index':'4800'});    
 	var bomHeight = $(opts.scrollChild).offset().top;
 	var winHeight = $(window).height();
 	//����������Χ�󸡶�
    $(window).scroll(function(){
    	var leftWid = $(opts.scrollParent).offset().left;
    	var scrollHeight = $(document).scrollTop();
	    if(scrollHeight > bomHeight){
	    	if(!ie6){
	    		$(opts.scrollChild).css({'position':'fixed','top':'0','z-index':'4600','left':leftWid+1});
	    	}else{
	    		$(opts.scrollChild).css({'position':'absolute','top':scrollHeight-bomHeight,'z-index':'4600','left':'1px'});
	    	}
	    	$(opts.scrollParent).css('padding-top','50px');
	    }else{
	    	if(ie6 )$(opts.scrollChild).hide();
	    	$(opts.scrollChild).css('position','static');
	    	$(opts.scrollParent).css('padding-top','0');
	    	if(ie6 )$(opts.scrollChild).show();
	    }
    });
    //����˵���λ��ʾ�����Ӧ����ʾ��
    $(opts.scrollChild+' li').click(function(){
		var scrollHeight = $(document).scrollTop();
		if(scrollHeight > bomHeight){	   //�������ƶ����л���ǩ��ʱ��
			if(ie6) $(opts.scrollChild).hide();    //ie6��BUG���,�����غ���ʾ,�����ǩѡ�е�ɫ���ƫ��
			$(document).scrollTop(bomHeight-1);
			if(ie6) $(opts.scrollChild).show();
		}
	});
};

$(function(){
	
	//ϲ����ťλ������
	var loveBtnLeft = $('#JsPos').position().left + 20;
	var loveBtnTop  = $('#JsPos').position().top - 3;
	$('#JloveBtn').css({left:loveBtnLeft,top:loveBtnTop}).show(); //����ajaxӰ����λ�ö�λ
	if(ie6){
		$('#JloveBtn').hover(function() {
			$('#JloveBtn').addClass('love-red');
		}, function() {
			$('#JloveBtn').removeClass('love-red');
		});
	};
	$('#JloveBtn').click(function(){
		var count  = $(this).data('count');
		var url = $(this).data('url');
		var id  = $(this).data('id');
		var _this = this;
		$.post(url, {productid: id}, function(data){
			if (data.status == 0) {
				var newcount = Number(count) + 1;
				$(_this).addClass('love-red').data('count', newcount).find("s").text('(' + newcount + ')');
				// �ղ�׷�ٴ���
				try{ylpw_adwq_love(id);}catch(e){}
			} else if (data.status == 1){
				$('#jump-login').minBox1({});
			} else if (data.status == 2){
				alert_sussnew("��ʾ��","�ף����Ѿ�ϲ����ඣ�");
			}
		});
	})
	
	//ͼƬ�ӳټ���
    $("img.lazy").lazyload({
         placeholder : "${qstatic}/images/lazy-mini.gif", //����ͼƬǰ��ռλͼƬ
         effect      : "fadeIn" //����ͼƬʹ�õ�Ч��(����)
    });
	
	//---------- Ѳ����Ϣ  start----------
    function tourShow(){
		var snub = 0;
		var lookNum = 6;    //�м�ɼ��ĸ���
		var lens = $('#JtourMid li').length - lookNum;
		var istrue = $('#JtourMid li').length > lookNum;    //�жϸ����Ƿ񳬳�
		
		var productid=$("#productid").val();
    	var li = $('#JtourMid li');
    	var num=li.find("a").length;
		
		$('#JtourMid li').each(function(j){    //�������ʾ
			var _firYear = 0;
			var _nextYear = 0;
			if($(this).children().next().hasClass('over')) $(this).css('color','#a5a5a5');    //���Թ��ڵ�ʱ��ڵ���
			_firYear  = parseInt($(this).attr('rel'));
			if($(this).next() != undefined)
			    _nextYear = parseInt($(this).next().attr('rel'));
			if(_nextYear > _firYear) $(this).append('<em class="year">'+_nextYear+'</em>');
		});
		if(!istrue) {
			$('.tour-prev,.tour-next').css('visibility','hidden');
			//������ǰվ��
			for(var i=0;i<num;i++){
				var station=li.find("a")[i].href;
	    		var begin=station.indexOf("ticket-");
	    		var end=station.indexOf(".html");
	    		station=station.substring(begin+7,end);
	    		if(station==productid){
	    			$('#JtourMid li').find("a").eq(i).addClass("on");
	      		}
	    	}
			return false;
		}else{
			$('.tour-prev,.tour-next').css('visibility','visible');
		};
		$('.tour-next').addClass('next-red');    //����ʱ���Ҳ�İ�ťΪ��ɫ���Ե��
		$('.tour-prev').click(function(){
		    if (snub != 0)  slide(-1);
		    $('.tour-next').addClass('next-red');
		});
		$('.tour-next').click(function(){
			slide(1);
			$('.tour-prev').addClass('prev-red');
		});
		//��������
		var slide = function(n){
		    if($('#JtourMid').is(":animated") == false){
				snub += n;
				if(snub != -1 && snub <= lens){
					if(snub == lens) $('.tour-next').removeClass('next-red');
					$('#JtourMid').animate({'marginLeft':-112*snub+'px'},500);
				}else if(snub == -1){
					$('#JtourMid').animate({'marginLeft':-112*(snub-1)+'px'},500);
				}else if(snub >= lens){
					$('.tour-next').removeClass('next-red');
					snub = lens;
				};
				if(snub <= 0){
					$('.tour-prev').removeClass('prev-red');
					$('.tour-next').addClass('next-red');
				}; 
		   };
		};
		
	    	//������ǰվ�㣬���жϵ�ǰվ���Ƿ���Ѳ����Ϣ��ĵ�һҳ��������ڣ����Զ���ҳ
	    	
	    	for(var i=0;i<num;i++){
	    		var station=li.find("a")[i].href;
	    		var begin=station.indexOf("ticket-");
	    		var end=station.indexOf(".html");
	    		station=station.substring(begin+7,end);
	    		if(station==productid){
	    			$('#JtourMid li').find("a").eq(i).addClass("on");
	    			if(i>5){
	    				slide(i-5);
	    				$('.tour-prev').addClass('prev-red');
	    			}
	      		}
	    	}
		
    }
    if($('#JtourInfo')[0]) {//�ж��Ƿ���Ѳ����һ��������ִ��
    	tourShow();
    	
    }  
	//---------- Ѳ����Ϣ end ----------
	
	//�ݳ���Ϣģ��Ч��
	$('#liveNav li').click(function(){
		$('#JonlineAsk').show();
	});
	
	//�����ʴ���
	//var _askHtml = $('#JonlineAll').clone();
	$('#JnavAsk').click(function(){
		//$('#JlivesCont').html(_askHtml);
		$("#JlivesCont").show();
		$('#JlivesCont').find('.online-hd').css({'margin-left':'15px','margin-top':'0'});
		$('#JonlineAsk').hide();
	});
	
	//�ݳ���Ϣͷ������
    scrollFixed({
       scrollParent: '#Jlives',
       scrollChild: '#JlivesHd'
    });
	
  //���빺�ﳵ
    $('.btn-buycar').click(function(){
    	var params = initOrders();
    	if (params === false) {
    		return false;
    	}
    	if (null == params || '^' == params) {
    		alert_sussnew("��ʾ��", "����ѡ��Ʊ�ۣ�");
    	} else {
    		var param = params.split('^');
    		var keys = param[0].split(',');
    		// buylimit�������Ʒ�������Ϳ��
    		$.ajaxSetup({async : false});
    		$.post(getPath() + '/ajax/checkLimit', {sd: params }, function(d){
    			if (d.status == 0) {
    				// save shopcart, ���¹��ﳵ���˴�����Ϊ��ӵ����Լ���һ��Ƕ��ajax
    				shopCart(param[0], param[1], arrayParams('0', keys.length, ','), arrayParams('0', keys.length, ','), function(data){
    					$("#shopchat-num").html(data.znum);
    					$(".yl-shopcart-num").text(data.znum);
    					$('.cart-switch').text("���ﳵ(" + data.znum + ")");
    					$('.product-amount').show();
    					$('.cart-count').text(data.znum);
    		 			$("#shopchat-ylprices").html(data.prices);
    		 			$(".yl-shopcart-prices").text(data.prices);
    		 			$("#yl-shopcart-msg").hide();
    		 			$(".yl-shopcart-total").show();
    		 			$('.yl-shopcart-total').siblings('.fr').show();
    		 			$(".shopProductName").text();
    		 			// ����
    		 			$("#JtoByCar").minBox();
    		 			//���ﳵ���ж��ټ���Ʒ
    		 			$('#box-shopcar-count').text(data.znum);
    		 			//�ϼƶ���Ԫ
    		 			//С���㴦��--start--
    					var totalPrice1=data.prices;
    					var dstNumber = parseFloat(totalPrice1);
    					����if (isNaN(dstNumber)) {
    					��������return totalPrice1;
    					����}
    					����if (dstNumber >= 0) {
    					��������dstNumber = parseInt(dstNumber * Math.pow(10, 2) + 0.5) / Math.pow(10, 2);//�ؼ���
    					����} else {
    					��������var tmpDstNumber = -dstNumber; dstNumber = parseInt(tmpDstNumber * Math.pow(10, 2) + 0.5) / Math.pow(10, 2);
    					����}
    					����var totalPrice = dstNumber.toString();
    					����var dotIndex = totalPrice.indexOf('.');
    					����if (dotIndex < 0) {
    					��������dotIndex = totalPrice.length; totalPrice += '.';
    					����}

    					����while (totalPrice.length <= dotIndex + 2) {
    					��������totalPrice += '0';
    					����}
    						�� //С���㴦��--end--
    		 			$('#box-shopcar-pirce').text(totalPrice);
    		 			// box-shopcar-count
    		 			// box-shopcar-pirce
    					// TODO L.cm ȥ����2�� ���ﳵ
    					// ���б���ͬ����
    					// ʹ��ģ�壿or ��
    				});
    			} else if (d.status == 1) {
    				alert_sussnew("��ʾ��", "û���ҵ��ó��Σ�");
    			}else if (d.status == 2) {
    				var $lacks = d.lacks, dds = [];
    				for ( var i = 0; i < $lacks.length; i++) {
    					var $li = $('li[p="' + $lacks[i] + '"]').eq(0);
    					dds.push($li.attr('d') + ' ' + $li.attr('title'));
    				}
    				dds.join(',');
    				alert_sussnew("��ʾ��", "��ѡ������Ʒ " + dds + " ���Σ�����Ѳ��㣡");
    			}
    		});
    	}
    	
    	
    }) 
    
	//---------- �Ҳม���� start ----------
	//�Ҳม��-���ﳵ����
    
	 //���ﳵ������Ʒ������
	//if(buyCarNum == 0){    //���ﳵΪ��
	/*	$('#Jfbox .buycar').hover(function(){
			$(this).find('.l-dot').show();
			$('#Jfbox .buycar-no').show();
		},function(){
			$(this).find('.l-dot').hide();
			$('#Jfbox .buycar-no').hide();
		});*/
	//};
	
	//�Ҳม��-���ﳵ���
    var boxShow;
	$('#Jfbox .buycar').click(function(e){
		stopEvent(e);
		var _shopCart_a = $(this).find('a').eq(0);
		var _shopCart_a_tip = $(this).find('.l-dot');
		var _shopCart_a_class = _shopCart_a.attr("class");
		if(_shopCart_a_class == "" || _shopCart_a_class==undefined){
			_shopCart_a_tip.show();
			_shopCart_a.addClass('on');
			var shopCatNum = $.trim($("#cart-count").text());
			$( ('.buycar-' + ((shopCatNum!=(''||0)) ? 'yes' : 'no')) ).show();
			boxShow = 1;
			$(this).attr("rel",1);
		}else{
			_shopCart_a_tip.hide();
			_shopCart_a.removeClass('on');
			//-------------------------------
			$('#Jfbox .buycar-yes').hide();
			$('.buycar-yes').hide();
			var shopCatNum = $.trim($("#cart-count").text());
			$( ('.buycar-' + ((shopCatNum!=(''||0)) ? 'yes' : 'no')) ).hide();
			boxShow = "none";
			$(this).attr("rel",0);
		}
		
	});
		
	//�Ҳม��li�������������ʾ��
	$('#JfboxUl li').hover(function(e){
		e.stopPropagation();
		if($("li.buycar[rel='1']").length == 1){
			$("#Jfbox .buycar").find('a').addClass("on");
			$('#Jfbox .buycar').find('.l-dot').show();
		}
	},function(){
//		var _class = $(this).eq(0);
//		console.log(_class);
//		
//		var _shopcat_box = $('#Jfbox .buycar-no');
//		var _weixin_box = $('#Jfbox .weixin-box');
//		
//		
//		
//		//if( _shopcat_box ) return;
//		
//		if( _weixin_box ){
//			_weixin_box.hide();
//			console.log("-----weixin-----"+$('#Jfbox .weixin-box').css("display"));
//			if($('#Jfbox .weixin-box').css("display") == 'block'){
//				 _shopcat_box.hide();
//			}
//		}
	});
	
	$('#Jfbox .idea,#Jfbox .italk,#Jfbox .gotop').hover(function(){
		$('#Jfbox .buycar-yes').hide();
		$('#Jfbox .buycar').find('.l-dot').hide();
		$('#Jfbox .buycar a').eq(0).removeClass();
		boxShow = 0;
	});
	
	//�Ҳม��-΢�Ż�����ʾ
	$('#Jfbox .weixin-li').hover(function(){
		$('#Jfbox .weixin-box').show();
		$(this).find('.l-dotb').show();
		
		//------------------------------
		$(".buycar").attr("rel",0);
		$("#Jfbox .buycar").find('a').removeClass("on");
		$('#Jfbox .buycar').find('.l-dot').hide();
	},function(){
		$('#Jfbox .weixin-box').hide();
		$(this).find('.l-dotb').hide();
		$('.buycar-no').hide();
		
	});
	
	//���Ե�����ﳵ���Ŀ�
//	$('#Jfbox').mouseout(function(e){  
//		stopEvent(e);
//	});
	
	//����հ׵ط�ȥ�����ﳵ��
//	$(document).click(function(e){
//		$('#Jfbox .buycar-yes').hide();
//		$('#Jfbox .buycar').find('.l-dot').hide();
//		$('#Jfbox .buycar a').eq(0).removeClass();
//		boxShow = 0;
//	});
	
	//ê�������ض���
	$('#Jfbox .gotop').mailTo();
	
	$(window).scroll(function(){
		mailFunc();
		if(ie6) windowResize();
	});
	
	function mailFunc(){
		var scrollTop = $(document).scrollTop();
		var screenHeight = $(window).height();
		scrollTop > screenHeight ? $('#Jfbox .gotop').show() : $('#Jfbox .gotop').hide();
	};
	
	//���ڱ仯ʱ���Ҳ�Сͼ�����λ�ñ仯
	$(window).resize(function(){
		windowResize();
	});
	
	//�Ҳ�Сͼ�궨λ
	var windowWidth,priceWidth,_posLeft,_posTop;
	function windowResize(){
		windowWidth = $(window).width();
		priceWidth = $('.main').width();
		_posLeft = (windowWidth + priceWidth) / 2 + 30;
		_posTop = $('.main').offset().top + 60;
		$('#Jfbox').css({'left':_posLeft,'top':_posTop}).show();
		if(ie6){
			var scrollTop = $(document).scrollTop();
		    $('#Jfbox').css({position:'absolute',left:_posLeft,top:_posTop+scrollTop});
		};
	};
	
	windowResize();
	//---------- �Ҳม���� end ----------
});

/*��ȡ���� ���충��...[45308942,45308941,45308943^1,1,1] */
function initOrders() {
	var $orders = $('.yl-order');
	var ppids = [], counts = [], error = [], ylprices = 0;
	if ($orders.length === 1) {
		return null;
	} else {
		var temp = true;
		$orders.each(function(){
			// ���ppid�Ƿ���� ���г����� ������ظ�
			var ppid = $(this).attr('ppid'), count = $(this).val(), n = $(this).attr('n');
			if (n && n != '' && (count * 1) > n) {
				alert_sussnew("��ʾ��", "��ѡ����Ʊ�ۣ���ǰ��治�㣬���޸Ĺ���������");
				temp = false;
				return false;
			}
			if ($.inArray(ppid, ppids) < 0) {
				ppids.push(ppid);
				counts.push(count);
				ylprices += Number(count);
			}
		});
		if (!temp) {
			return false;
		}
		if (1000 < ylprices) {
			return false;
		}
		return ppids.join(',') + '^' + counts.join(',');
	}
}
/*���浽���ﳵ*/
function shopCart(productplayids, nums, types, fatherids, cb) {
	$.post(getPath() + '/ajax/addshopcart', {
		productplayids: productplayids,
 		nums: nums,
 		types: types,
 		fatherids: fatherids
 	}, function(data){
 		if (data.status == 1) {
 			alert_sussnew("��ʾ��", "����ѡ����Ʒ��");
 		}
 		if (data.status == 0) {
 			try{ylpw_adwq(productplayids,nums);}catch(e){}
 			cb(data);
 		}
	}, 'json');
	
}
function ylpw_adwq(productplayids,nums) {
	var pid = null,name=null,price=null,typeid=null,type=null;
	var $price = null;
	var ppid = productplayids.split(",")[0];
	var num = nums.split(',')[0];
//	$.each(productplayids.split(","),function(i,ppid){
		_adwq.push([ '_setDataType','cart']); 
		if($("#customer_loginYn").val() == 'Y') {
			_adwq.push([ '_setCustomer',"'"+$("#customer_login_id").val()+"'"]);
		}
		$price = $('li[p=\"'+ppid+'"\]');
		pid = $price.attr("productid");
		name = $price.attr("name");
		price = $price.attr("rel");
		typeid = $price.attr("typeid");
		type = $price.attr("type");
		/*_adwq.push(['_setItem', 
		    "'"+pid+"'", // ��������Ʒ��� - ������
		    "'"+name+"'", // ��������Ʒ���� - ������
		    "'"+price+"'", // ��������Ʒ��� - ������
		    "'"+nums[i]+"'", // ��������Ʒ���� - ������
		    "'"+typeid+"'", // ��������Ʒ������ - ������
		    "'"+type+"'" // ��������Ʒ�������� - ������
        ]);*/
		//_adwq.push(['_setItem',"'"+pid+"'","'"+name+"'","'"+price+"'","'"+num+"'","'"+typeid+"'","'"+type+"'"]);
		_adwq.push(['_setItem',pid+'',name+'',price+'',num+'',typeid+'',type+'']);
		_adwq.push([ '_trackTrans' ]);
//	});
}
function ylpw_adwq_love(productid){
	if($("#customer_loginYn").val() == 'Y') {
		//_adwq.push(['_setAction','83v987',"'"+$("#customer_login_id").val()+"'","'"+productid+"'"]);
		_adwq.push(['_setAction','83v987',$("#customer_login_id").val()+'',productid+'']);
	}
}
/*����һ�����ȵ��ַ��� 0,0,0,0,0 */
function arrayParams(value, size, placeholder) {
	return new Array(size + 1).join(value).split('').join(placeholder);
}

//������ajax�ύ
$('.btn-reserve').click(function(){
	var username 	= $('#yd_username').val();
	var phone 		= $('#yd_phone').val();
	var wishprice	= $('#yd_wishprice').val();
	var wishnumber	= $('#yd_wishnumber').val();
	var info 		= $('#yd_info').val();
	// ������ʾ
	$("#yl_yd_submit").hide();
	
	if (username == '') {
		$('#yd_username_msg').text('��������ʵ���������ڿͷ�������ϵ��');
		return false;
	}else{
		$('#yd_username_msg').text('');
	}
	if (phone == '' ){
		$('#yd_phone_msg').text('�����������ֻ����룡');
		return false;
	}else if(validatePhone(phone) != 0){
		$('#yd_phone_msg').text('�ֻ������ʽ����ȷ��');
	}else{
		$('#yd_phone_msg').text('');
	}
	
	// �����λ������1~9999֮�䣡
	if (isNaN(wishprice) || parseInt(wishprice) < 1 || parseInt(wishprice) > 9999) {
		$('#yd_wishprice_msg').removeClass('c3').addClass('red').text('�����λ������1~9999֮�䣡');
		return false;
	}else{
		$('#yd_wishprice_msg').text('');
	}
	
	if (isNaN(wishnumber) || parseInt(wishnumber) < 1 || parseInt(wishnumber) > 99 ) {
		$('#yd_wishnumber_msg').removeClass('c3').addClass('red').text('ƱƷ����������1~99֮�䣡');
		return false;
	}else if(!isDecimal(wishnumber) && wishnumber!= "" && wishnumber!= null){ //����Ϊ��
		$('#yd_wishnumber_msg').removeClass('c3').addClass('red').text('ƱƷ��������Ϊ������');
		return false;
	}else{
		$('#yd_wishnumber_msg').text('');
	} 
	var len = getByteLen(info);
	if(len > 400){
		$('#yd_info_msg').text("�ѳ���" + Math.floor((myLen - len * 2 ) / 2) + "���֡�")
		return false;
	}else{
		$('#yd_info_msg').text("");
	}
	_ajaxform(this, function(data){
		if(data.status === 0) {
			alert_sussnew("��ʾ��", "�Ǽǳɹ���");
		} else {
			// �ύʧ�ܣ����飡
			$("#yl_yd_submit").show();
		}
	});
	return false;
});


//���� yl_yq_submit
$('.btn-sub').click(function(){
	var phone = $('#yq_phone').val();
	var email = $('#yq_email').val();
	
	var temp = validatePhone(phone);
	if (temp == 1) {
		$('#yq_phone_msg').removeClass('c3').addClass('red').text('�����������ֻ����룡');
		return false;
	} else if (temp == 2) {
		$('#yq_phone_msg').removeClass('c3').addClass('red').text('�ֻ������ʽ����ȷ��');
		return false;
	} else {
		$('#yq_phone_msg').text('');
	}
	
	var emailtemp = validateEmail(email);
	if (emailtemp == 1) {
		$('#yq_email_msg').removeClass('c3').addClass('red').text('���������ĳ������䣡');
		return false;
	} else if (emailtemp == 2){
		$('#yq_email_msg').removeClass('c3').addClass('red').text('�����ʽ����ȷ��');
		return false;
	} else {
		$('#yq_email_msg').text('');
	}
	if(phone == '' && validatePhone(phone) != 0&&email == ''){
	}else{
		  if(validateEmail(email)!=1&&validateEmail(email)!=2){
			  _ajaxform(this, function(data){
					if (data.status == 0) {
						alert_sussnew("��ʾ��", "�Ǽǳɹ���");
					} else {
						// �ύʧ�ܣ����飡
						alert_sussnew("��ʾ��", "�ύʧ�ܣ����Ժ����ԣ�");
					}
				});
		   }
	}
	return false;
});



//ȱ���Ǽ�

$(document).ready(function(){
	
	//�ر�ȱ���Ǽǵ�����
	$('#qhdj_submitTwo').click(function(){
		var num = $("#qhdj_num").val() * 1;
		$("#productcount").val(num);
		//�ж������Ƿ񳬹�30
		if(num > 30){
			return false;
		}
		//�ж��������ֳ����Ƿ񳬹�100
		var len = getByteLen($.trim($("#qhdj_text").val())); 
		if(len > 200){
			$("#qhdj_MsgTip").html("<span class='red'>������������Ѿ�����100����!</red>");
			$('#qhdj_text').focus();
			return false;
		}
		
		$("#qhdj_MsgTip").html("");
		//�жϵ绰����
		var phone = $("#qhdj_phone").val();
		var phoneFlag = validatePhone(phone);
		if(phoneFlag == 1){
			$('#expPhoneTip').html("");
			$('#expPhoneTip').html("<span class='red'>�ֻ����벻��Ϊ��!</red>");
			return false;
		}else if(phoneFlag == 2){
			$('#expPhoneTip').html("");
			$('#expPhoneTip').html("<span class='red'>�ֻ����벻��ȷ!</red>");
			return false;
		}else{
			$('#expPhoneTip').html("����ȷ������뷽������������ϵ");
		}
		$form = $("#qhdj_form");
		var action=getPath()+"/ajax/addshortagerecord.html";//ȱ���Ǽǵĵ�ַ 
		$.post(action,$form.serialize(), function(data) {
			if(data.ajaxResponse == 1){
				if(data.flag == 0){
					$("#qhdj_MsgTip").html("<span class='red'>�������!</red>");
					return false;
				}else if(data.flag == 1){
					$("#qhdj_MsgTip").html("<span class='red'>�����ֻ����������!</red>");
					return false;
				}else if(data.flag == 2){
					$("#qhdj_MsgTip").html("<span class='red'>�����ύ�������Ѿ�����30��!</red>");
					return false;
				}else{
					$("#qhdj_MsgTip").html("");
					alert_sussnew("��ʾ��", "�Ǽǳɹ���");
					//ȱ�����������ж�(ˢ��ҳ�� )
					$(".queding").attr("onclick","fresh()");
					$(".closeBox").attr("onclick","fresh()");
				}
			}
		});
		return false;
	});
});
//ˢ��ҳ��
function fresh(){
	window.location.reload();
}

function validatePhone(phone){
	var phoneFlag = 0;//�����ֻ���֤��ʶ
	var phoneVal = phone;
	//var ph_re = /^(1(([35][0-9])|(47)|[8][012356789]))\d{8}$/;//��֤�ֻ�������ʽ
	var ph_re = /^[1][3-8]\d{9}$|^([5|6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;//��֤�ֻ�������ʽ
	if($.trim(phoneVal)==""){//�ǿ�
		phoneFlag = 1;
	}
	else if(!ph_re.test(phone)){
		phoneFlag = 2;
	}
	return phoneFlag;
}

function validateEmail(email){
	var emailFlag = 0;//����Email��ʶ
	var emailVal = email;
	var em_re=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;//��֤�����������ʽ
	if($.trim(emailVal)==""){//�ǿ�
		emailFlag = 1;
	}else if(!em_re.test(emailVal)){//email��ʽ��֤
		emailFlag = 2;
	}
	return emailFlag;
 }

function validateCn(cn) {
	var reg = /[\u4E00-\u9FA5]/g;
	return reg.test(cn);
}

function checkWord(c) {
   len = 200;
   var str = $(c).val();
   myLen = getByteLen(str);
   var errorspan = $('#yd_info_msg');
   if (myLen > len * 2) {
	   errorspan.show();
	   errorspan.text("�ѳ���" + Math.floor((myLen - len * 2 ) / 2) + "���֡�");
   }else{
	   errorspan.hide();
	   errorspan.text("");
   }
}
//����val���ֽڳ��� 
function getByteLen(val) { 
	var len = 0;  
	for (var i=0; i<val.length; i++) {   
		var c = val.charCodeAt(i);   
		//���ֽڼ�1   
		if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
			len++;   
		} else {   
			len+=2;   
		}
	}
	return len; 
} 
//�ж��Ƿ���С��
function isDecimal(s) {
	 var regu = "^([0-9]*[.0-9])$"; // С������
	 var re = new RegExp(regu);
	 if (s.search(re) != -1)
	  return true;
	 else
	  return false;
	}
