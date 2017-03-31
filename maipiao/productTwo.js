/*
 * jQuery product v0.4
 * Copyright (c) 2014-10-11 16:00 Jensen & C.lm
 * 说明：商品页效果集合
 */

		
//票区图
Shadowbox.init({
	overlayOpacity : 0.8
});

//微博分享有礼关闭
$('#JiKnow').click(function(){
	$('.weibo-box').hide();
});	

//演出信息选项卡切换
$('#liveNav').accordion({
    childId: '.lives-info',
    linkA: true
});
//固定导航菜单到最顶部
var scrollFixed = function(params){ 
 	var opts = $.extend({
 		scrollParent: params.scrollParent,     //滑动节点最外层的父节点
 		scrollChild: params.scrollChild        //滑动节点
 	},params)
 	
 	$(opts.scrollParent).css({'position':'relative','z-index':'4800'});    
 	var bomHeight = $(opts.scrollChild).offset().top;
 	var winHeight = $(window).height();
 	//滚动超出范围后浮动
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
    //点击菜单定位显示下面对应的显示项
    $(opts.scrollChild+' li').click(function(){
		var scrollHeight = $(document).scrollTop();
		if(scrollHeight > bomHeight){	   //滚动条移动到切换标签的时候
			if(ie6) $(opts.scrollChild).hide();    //ie6下BUG清除,先隐藏后显示,点击标签选中的色块会偏移
			$(document).scrollTop(bomHeight-1);
			if(ie6) $(opts.scrollChild).show();
		}
	});
};

$(function(){
	
	//喜欢按钮位置设置
	var loveBtnLeft = $('#JsPos').position().left + 20;
	var loveBtnTop  = $('#JsPos').position().top - 3;
	$('#JloveBtn').css({left:loveBtnLeft,top:loveBtnTop}).show(); //公告ajax影响了位置定位
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
				// 收藏追踪代码
				try{ylpw_adwq_love(id);}catch(e){}
			} else if (data.status == 1){
				$('#jump-login').minBox1({});
			} else if (data.status == 2){
				alert_sussnew("提示！","亲，你已经喜欢过喽！");
			}
		});
	})
	
	//图片延迟加载
    $("img.lazy").lazyload({
         placeholder : "${qstatic}/images/lazy-mini.gif", //加载图片前的占位图片
         effect      : "fadeIn" //加载图片使用的效果(淡入)
    });
	
	//---------- 巡演信息  start----------
    function tourShow(){
		var snub = 0;
		var lookNum = 6;    //中间可见的个数
		var lens = $('#JtourMid li').length - lookNum;
		var istrue = $('#JtourMid li').length > lookNum;    //判断个数是否超出
		
		var productid=$("#productid").val();
    	var li = $('#JtourMid li');
    	var num=li.find("a").length;
		
		$('#JtourMid li').each(function(j){    //跨年的显示
			var _firYear = 0;
			var _nextYear = 0;
			if($(this).children().next().hasClass('over')) $(this).css('color','#a5a5a5');    //可以过期的时间节点变灰
			_firYear  = parseInt($(this).attr('rel'));
			if($(this).next() != undefined)
			    _nextYear = parseInt($(this).next().attr('rel'));
			if(_nextYear > _firYear) $(this).append('<em class="year">'+_nextYear+'</em>');
		});
		if(!istrue) {
			$('.tour-prev,.tour-next').css('visibility','hidden');
			//点亮当前站点
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
		$('.tour-next').addClass('next-red');    //超出时候右侧的按钮为红色可以点击
		$('.tour-prev').click(function(){
		    if (snub != 0)  slide(-1);
		    $('.tour-next').addClass('next-red');
		});
		$('.tour-next').click(function(){
			slide(1);
			$('.tour-prev').addClass('prev-red');
		});
		//滑动函数
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
		
	    	//点亮当前站点，并判断当前站点是否在巡演信息轴的第一页，如果不在，就自动翻页
	    	
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
    if($('#JtourInfo')[0]) {//判断是否有巡演这一栏，有再执行
    	tourShow();
    	
    }  
	//---------- 巡演信息 end ----------
	
	//演出信息模块效果
	$('#liveNav li').click(function(){
		$('#JonlineAsk').show();
	});
	
	//在线问答点击
	//var _askHtml = $('#JonlineAll').clone();
	$('#JnavAsk').click(function(){
		//$('#JlivesCont').html(_askHtml);
		$("#JlivesCont").show();
		$('#JlivesCont').find('.online-hd').css({'margin-left':'15px','margin-top':'0'});
		$('#JonlineAsk').hide();
	});
	
	//演出信息头部浮动
    scrollFixed({
       scrollParent: '#Jlives',
       scrollChild: '#JlivesHd'
    });
	
  //放入购物车
    $('.btn-buycar').click(function(){
    	var params = initOrders();
    	if (params === false) {
    		return false;
    	}
    	if (null == params || '^' == params) {
    		alert_sussnew("提示！", "请先选择票价！");
    	} else {
    		var param = params.split('^');
    		var keys = param[0].split(',');
    		// buylimit，检查商品限制数和库存
    		$.ajaxSetup({async : false});
    		$.post(getPath() + '/ajax/checkLimit', {sd: params }, function(d){
    			if (d.status == 0) {
    				// save shopcart, 更新购物车，此处限制为后加的所以加了一个嵌套ajax
    				shopCart(param[0], param[1], arrayParams('0', keys.length, ','), arrayParams('0', keys.length, ','), function(data){
    					$("#shopchat-num").html(data.znum);
    					$(".yl-shopcart-num").text(data.znum);
    					$('.cart-switch').text("购物车(" + data.znum + ")");
    					$('.product-amount').show();
    					$('.cart-count').text(data.znum);
    		 			$("#shopchat-ylprices").html(data.prices);
    		 			$(".yl-shopcart-prices").text(data.prices);
    		 			$("#yl-shopcart-msg").hide();
    		 			$(".yl-shopcart-total").show();
    		 			$('.yl-shopcart-total').siblings('.fr').show();
    		 			$(".shopProductName").text();
    		 			// 弹出
    		 			$("#JtoByCar").minBox();
    		 			//购物车共有多少件商品
    		 			$('#box-shopcar-count').text(data.znum);
    		 			//合计多少元
    		 			//小数点处理--start--
    					var totalPrice1=data.prices;
    					var dstNumber = parseFloat(totalPrice1);
    					　　if (isNaN(dstNumber)) {
    					　　　　return totalPrice1;
    					　　}
    					　　if (dstNumber >= 0) {
    					　　　　dstNumber = parseInt(dstNumber * Math.pow(10, 2) + 0.5) / Math.pow(10, 2);//关键点
    					　　} else {
    					　　　　var tmpDstNumber = -dstNumber; dstNumber = parseInt(tmpDstNumber * Math.pow(10, 2) + 0.5) / Math.pow(10, 2);
    					　　}
    					　　var totalPrice = dstNumber.toString();
    					　　var dotIndex = totalPrice.indexOf('.');
    					　　if (dotIndex < 0) {
    					　　　　dotIndex = totalPrice.length; totalPrice += '.';
    					　　}

    					　　while (totalPrice.length <= dotIndex + 2) {
    					　　　　totalPrice += '0';
    					　　}
    						　 //小数点处理--end--
    		 			$('#box-shopcar-pirce').text(totalPrice);
    		 			// box-shopcar-count
    		 			// box-shopcar-pirce
    					// TODO L.cm 去更新2个 购物车
    					// 还有保持同步！
    					// 使用模板？or ？
    				});
    			} else if (d.status == 1) {
    				alert_sussnew("提示！", "没有找到该场次！");
    			}else if (d.status == 2) {
    				var $lacks = d.lacks, dds = [];
    				for ( var i = 0; i < $lacks.length; i++) {
    					var $li = $('li[p="' + $lacks[i] + '"]').eq(0);
    					dds.push($li.attr('d') + ' ' + $li.attr('title'));
    				}
    				dds.join(',');
    				alert_sussnew("提示！", "您选购的商品 " + dds + " 场次，库存已不足！");
    			}
    		});
    	}
    	
    	
    }) 
    
	//---------- 右侧浮动框 start ----------
	//右侧浮动-购物车滑动
    
	 //购物车里面商品的数量
	//if(buyCarNum == 0){    //购物车为空
	/*	$('#Jfbox .buycar').hover(function(){
			$(this).find('.l-dot').show();
			$('#Jfbox .buycar-no').show();
		},function(){
			$(this).find('.l-dot').hide();
			$('#Jfbox .buycar-no').hide();
		});*/
	//};
	
	//右侧浮动-购物车点击
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
		
	//右侧浮动li滑动隐藏左侧显示的
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
	
	//右侧浮动-微信滑动显示
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
	
	//可以点击购物车左侧的框
//	$('#Jfbox').mouseout(function(e){  
//		stopEvent(e);
//	});
	
	//点击空白地方去掉购物车框
//	$(document).click(function(e){
//		$('#Jfbox .buycar-yes').hide();
//		$('#Jfbox .buycar').find('.l-dot').hide();
//		$('#Jfbox .buycar a').eq(0).removeClass();
//		boxShow = 0;
//	});
	
	//锚点点击返回顶部
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
	
	//窗口变化时候右侧小图标跟着位置变化
	$(window).resize(function(){
		windowResize();
	});
	
	//右侧小图标定位
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
	//---------- 右侧浮动框 end ----------
});

/*获取订单 构造订单...[45308942,45308941,45308943^1,1,1] */
function initOrders() {
	var $orders = $('.yl-order');
	var ppids = [], counts = [], error = [], ylprices = 0;
	if ($orders.length === 1) {
		return null;
	} else {
		var temp = true;
		$orders.each(function(){
			// 检测ppid是否存在 所有场次中 会产生重复
			var ppid = $(this).attr('ppid'), count = $(this).val(), n = $(this).attr('n');
			if (n && n != '' && (count * 1) > n) {
				alert_sussnew("提示！", "您选购的票价，当前库存不足，请修改购买数量！");
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
/*保存到购物车*/
function shopCart(productplayids, nums, types, fatherids, cb) {
	$.post(getPath() + '/ajax/addshopcart', {
		productplayids: productplayids,
 		nums: nums,
 		types: types,
 		fatherids: fatherids
 	}, function(data){
 		if (data.status == 1) {
 			alert_sussnew("提示！", "请先选择商品！");
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
		    "'"+pid+"'", // 请填入商品编号 - 必填项
		    "'"+name+"'", // 请填入商品名称 - 必填项
		    "'"+price+"'", // 请填入商品金额 - 必填项
		    "'"+nums[i]+"'", // 请填入商品数量 - 必填项
		    "'"+typeid+"'", // 请填入商品分类编号 - 必填项
		    "'"+type+"'" // 请填入商品分类名称 - 必填项
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
/*生成一定长度的字符串 0,0,0,0,0 */
function arrayParams(value, size, placeholder) {
	return new Array(size + 1).join(value).split('').join(placeholder);
}

//待定表单ajax提交
$('.btn-reserve').click(function(){
	var username 	= $('#yd_username').val();
	var phone 		= $('#yd_phone').val();
	var wishprice	= $('#yd_wishprice').val();
	var wishnumber	= $('#yd_wishnumber').val();
	var info 		= $('#yd_info').val();
	// 隐藏提示
	$("#yl_yd_submit").hide();
	
	if (username == '') {
		$('#yd_username_msg').text('请填入真实姓名，便于客服和您联系！');
		return false;
	}else{
		$('#yd_username_msg').text('');
	}
	if (phone == '' ){
		$('#yd_phone_msg').text('请填入您的手机号码！');
		return false;
	}else if(validatePhone(phone) != 0){
		$('#yd_phone_msg').text('手机号码格式不正确！');
	}else{
		$('#yd_phone_msg').text('');
	}
	
	// 理想价位必须在1~9999之间！
	if (isNaN(wishprice) || parseInt(wishprice) < 1 || parseInt(wishprice) > 9999) {
		$('#yd_wishprice_msg').removeClass('c3').addClass('red').text('理想价位必须在1~9999之间！');
		return false;
	}else{
		$('#yd_wishprice_msg').text('');
	}
	
	if (isNaN(wishnumber) || parseInt(wishnumber) < 1 || parseInt(wishnumber) > 99 ) {
		$('#yd_wishnumber_msg').removeClass('c3').addClass('red').text('票品数量必须在1~99之间！');
		return false;
	}else if(!isDecimal(wishnumber) && wishnumber!= "" && wishnumber!= null){ //可以为空
		$('#yd_wishnumber_msg').removeClass('c3').addClass('red').text('票品数量必须为整数！');
		return false;
	}else{
		$('#yd_wishnumber_msg').text('');
	} 
	var len = getByteLen(info);
	if(len > 400){
		$('#yd_info_msg').text("已超过" + Math.floor((myLen - len * 2 ) / 2) + "个字。")
		return false;
	}else{
		$('#yd_info_msg').text("");
	}
	_ajaxform(this, function(data){
		if(data.status === 0) {
			alert_sussnew("提示！", "登记成功！");
		} else {
			// 提交失败，请检查！
			$("#yl_yd_submit").show();
		}
	});
	return false;
});


//延期 yl_yq_submit
$('.btn-sub').click(function(){
	var phone = $('#yq_phone').val();
	var email = $('#yq_email').val();
	
	var temp = validatePhone(phone);
	if (temp == 1) {
		$('#yq_phone_msg').removeClass('c3').addClass('red').text('请填入您的手机号码！');
		return false;
	} else if (temp == 2) {
		$('#yq_phone_msg').removeClass('c3').addClass('red').text('手机号码格式不正确！');
		return false;
	} else {
		$('#yq_phone_msg').text('');
	}
	
	var emailtemp = validateEmail(email);
	if (emailtemp == 1) {
		$('#yq_email_msg').removeClass('c3').addClass('red').text('请填入您的常用邮箱！');
		return false;
	} else if (emailtemp == 2){
		$('#yq_email_msg').removeClass('c3').addClass('red').text('邮箱格式不正确！');
		return false;
	} else {
		$('#yq_email_msg').text('');
	}
	if(phone == '' && validatePhone(phone) != 0&&email == ''){
	}else{
		  if(validateEmail(email)!=1&&validateEmail(email)!=2){
			  _ajaxform(this, function(data){
					if (data.status == 0) {
						alert_sussnew("提示！", "登记成功！");
					} else {
						// 提交失败，请检查！
						alert_sussnew("提示！", "提交失败，请稍候再试！");
					}
				});
		   }
	}
	return false;
});



//缺货登记

$(document).ready(function(){
	
	//关闭缺货登记弹出框
	$('#qhdj_submitTwo').click(function(){
		var num = $("#qhdj_num").val() * 1;
		$("#productcount").val(num);
		//判断数量是否超过30
		if(num > 30){
			return false;
		}
		//判断输入框的字长度是否超过100
		var len = getByteLen($.trim($("#qhdj_text").val())); 
		if(len > 200){
			$("#qhdj_MsgTip").html("<span class='red'>您输入的内容已经超过100个字!</red>");
			$('#qhdj_text').focus();
			return false;
		}
		
		$("#qhdj_MsgTip").html("");
		//判断电话号码
		var phone = $("#qhdj_phone").val();
		var phoneFlag = validatePhone(phone);
		if(phoneFlag == 1){
			$('#expPhoneTip').html("");
			$('#expPhoneTip').html("<span class='red'>手机号码不能为空!</red>");
			return false;
		}else if(phoneFlag == 2){
			$('#expPhoneTip').html("");
			$('#expPhoneTip').html("<span class='red'>手机号码不正确!</red>");
			return false;
		}else{
			$('#expPhoneTip').html("请正确输入号码方便我们与您联系");
		}
		$form = $("#qhdj_form");
		var action=getPath()+"/ajax/addshortagerecord.html";//缺货登记的地址 
		$.post(action,$form.serialize(), function(data) {
			if(data.ajaxResponse == 1){
				if(data.flag == 0){
					$("#qhdj_MsgTip").html("<span class='red'>错误操作!</red>");
					return false;
				}else if(data.flag == 1){
					$("#qhdj_MsgTip").html("<span class='red'>您的手机号输入错误!</red>");
					return false;
				}else if(data.flag == 2){
					$("#qhdj_MsgTip").html("<span class='red'>您所提交的数量已经超过30张!</red>");
					return false;
				}else{
					$("#qhdj_MsgTip").html("");
					alert_sussnew("提示！", "登记成功！");
					//缺货弹窗单独判断(刷新页面 )
					$(".queding").attr("onclick","fresh()");
					$(".closeBox").attr("onclick","fresh()");
				}
			}
		});
		return false;
	});
});
//刷新页面
function fresh(){
	window.location.reload();
}

function validatePhone(phone){
	var phoneFlag = 0;//设置手机验证标识
	var phoneVal = phone;
	//var ph_re = /^(1(([35][0-9])|(47)|[8][012356789]))\d{8}$/;//验证手机正则表达式
	var ph_re = /^[1][3-8]\d{9}$|^([5|6|9])\d{7}$|^[0][9]\d{8}$|^[6]([8|6])\d{5}$/;//验证手机正则表达式
	if($.trim(phoneVal)==""){//非空
		phoneFlag = 1;
	}
	else if(!ph_re.test(phone)){
		phoneFlag = 2;
	}
	return phoneFlag;
}

function validateEmail(email){
	var emailFlag = 0;//设置Email标识
	var emailVal = email;
	var em_re=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;//验证邮箱的正则表达式
	if($.trim(emailVal)==""){//非空
		emailFlag = 1;
	}else if(!em_re.test(emailVal)){//email格式验证
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
	   errorspan.text("已超过" + Math.floor((myLen - len * 2 ) / 2) + "个字。");
   }else{
	   errorspan.hide();
	   errorspan.text("");
   }
}
//返回val的字节长度 
function getByteLen(val) { 
	var len = 0;  
	for (var i=0; i<val.length; i++) {   
		var c = val.charCodeAt(i);   
		//单字节加1   
		if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
			len++;   
		} else {   
			len+=2;   
		}
	}
	return len; 
} 
//判断是否是小数
function isDecimal(s) {
	 var regu = "^([0-9]*[.0-9])$"; // 小数测试
	 var re = new RegExp(regu);
	 if (s.search(re) != -1)
	  return true;
	 else
	  return false;
	}
