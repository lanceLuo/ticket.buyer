/*
 * jQuery priceSelect v0.2
 * Copyright (c) 2014-08-26 16:27 Jensen
 * 说明：商品页票价效果
 */
var seatUrl;
//初始场次第一个选中 如果第一个场次的所有票价都已经卖完 那就默认第二个选中 一次类推 第三个 第四个
$(document).ready(function () {
  //初始场次第一个选中 BY lsy
  var b = false;
  $('#Jdate li').each(function () {
    var d = $(this).attr('d');
    var o = $('#Jprice li[d="' + d + '"]').not('[s=2]').length;
    if (o != 0) {
      $(this).trigger('click');
      b = true;
      return false;
    }
  });
  if (!b) {
    $('#Jdate li:first').trigger('click');
  }
  $('#Jprice li').filter('[w=1]').not('[class=over]').mouseenter(function () {
    var iLeft = $(this).position().left;
    var iTop = $(this).position().top;
    $('.js-mobile').css({
      left: iLeft,
      top: iTop - 206,
      display: 'block'
    });
  });
  $('#Jprice li').filter('[w=1]').not('[class=over]').mouseleave(function () {
    $('.js-mobile').css('display', 'none');
  });
});
//场次的高度的控制  大于10场次的隐藏成2行
var dateLiLen = $('#Jdate li').length;
if (dateLiLen > 10) {
  $('#Jdate').css('height', '92px');
} else {
  $('.cq-more').hide();
  $('#Jdate').css('margin-bottom', '10px');
};
var pids = new Array(66002646, 66002601, 66002057, 66001999, 66001895); //lp专题使用
var pids2 = new Array(66066808, 66067376, 66067505, 66067063, 66067673); //lp专题使用
//场次点击选择    
var cqTime = $('#Jdate li:first').attr('title');
; //场次时间
var dz_num = 0;
$('#Jdate li').click(function () {
  //STORY #589::特殊电子票项目，限制跨场次购买 begin
  var _dz_path = $('#dz_path').val(); //商品的path，来区分，是否是电子票
  var _jprice_num = $('#Jprice li').length; //这是票价的整体数量
  var dzFlag = 0; //初始化一个是否是特殊电子票 0 为不是 1 为是
  if (_dz_path.indexOf('dznewonline') != - 1) {
    dzFlag = 1;
  }
  if (dzFlag == 1) {
    dz_num = 1;
    if ($('#Jprice li[class=on]').length) {
      if (confirm('是否取消已选择的票价')) {
        $('#Jprice li').attr('class', '');
        $('#JchoosePrice').hide();
        $('.dznew').remove();
      } else {
        return;
      }
    }
  }
  //STORY #589::特殊电子票项目，限制跨场次购买 end	

  $('#Jdate li').removeClass();
  if (ie6) {
    $('#Jdate li').css('border-color', '#e5e5e5');
    $(this).css('border-color', '#cc0001');
    $('#Jdate li').css('background-position', ''); //ie6下强制去掉右下角的图标
  }
  $('#Jdate li').each(function () { //2栏时候宽度设为初始值
    if ($(this).css('width') == '207px') {
      $(this).css('width', '208px');
    };
  });
  if ($(this).css('width') == '208px') { //2栏时候宽度修复，border为2px影响
    $(this).css('width', '207px');
  };
  $(this).addClass('on');
  if (ie6) $(this).css('background-position', '100% 0');
  cqTime = $(this).attr('title');
  var xzurl = $(this).attr('cc');
  var prices = $('#z_price li'); //票价
  var cdate = $(this).attr('d'); //场次日期
  $('#Jprice li').removeClass('choose').hide(); //清空样式
  $('#Jprice li[d="' + cdate + '"]').show(); //显示该组所有票价
  // <span>2012年04月20日</span><span>星期五</span>19:30
  // $('#zd').html('"<b>'+$(this).attr('title')+'</b>"');
  var maxseatcount = '${product.maxseatcount}' == null
  || '${product.maxseatcount}' == '' ? 6 
  : '${product.maxseatcount}';
  if (xzurl != '') {
    seatUrl = xzurl + ((xzurl.indexOf('?') != - 1) ? '&' : '?');
    //$('.zxxz').attr('href', xzurl + ((xzurl.indexOf("?") != -1) ? '&' : '?')).show();
    $('.zxxz').attr('href', 'javascript:getSeatFunction();');
  } else {
    seatUrl = null;
    $('.zxxz').attr('href', 'javascript:void(0);').hide();
  }
  // 对于只有一个票价，并且场次只有一次的默认选中

  var $pps = $('#Jprice').eq(0).find('li[d="' + cdate + '"]');
  var $date = $('#Jdate li').length;
  if ($pps.length == 1 && $date == 1) {
    var ppid = $pps.attr('p');
    if ($('.yl-order[ppid="' + ppid + '"]').length > 0) {
      return;
    }
    if (!$pps.attr('class') == 'over') {
      $pps.get(0).click();
    }
  }
  // 演出前三天判断

  var $errorBerfor = $('.error_berfor_msg');
  var $_li = $('#Jdate li[event=1]:eq(0)'); // 或者售完
  if ('${isberfor}' === '1') {
    var ddate = cdate.replace(/-/g, '/');
    var playDate = new Date(ddate).getTime();
    var now = new Date();
    var temp = now.setDate(now.getDate() + 4) > playDate; // 演出前三天
    $(this).attr('cc', ''); // 移除cc
    if (temp) {
      $(this).attr('cc', ''); // 移除cc
      if ($_li.length !== 0) {
        $errorBerfor.html('“' + cdate + '” 属于演出前三天，票品无法快递配送且不支持上门自取，目前已不能购买，给您带来的不便，敬请谅解。！').show();
      }
      $('.btn-seat-buy').hide();
      $('.btn-now-buy').hide();
      $('.btn-buycar').hide();
    } else {
      $('.btn-seat-buy').show();
      $('.btn-now-buy').show();
      $('.btn-buycar').show();
      $errorBerfor.hide();
    }
  } else if ($_li.length === 0) {
    $('.btn-seat-buy').hide();
    $('.btn-now-buy').hide();
    $('.btn-buycar').hide();
    $('.reserve-info').hide();
    $('.btn-reserve-now').hide();
  } else {
    $errorBerfor.hide();
  }
  //selectedPlayDatePrice();

});
function selectedPlayDatePrice() {
  var $selectedPlayDatePriceArr = [
  ];
  $('.yl-order').each(function (i, o) {
    var ppid = $(o).attr('ppid');
    if (!contains($selectedPlayDatePriceArr, ppid)) {
      $selectedPlayDatePriceArr.push(ppid);
    }
  });
  $('.price-ck li').not('.over').css('background', '#ffffff');
  $.each($selectedPlayDatePriceArr, function (i, ppid) {
    $('.price-ck li[p=' + ppid + ']').addClass('choose').append('<div class="productnew-header-pricea2-dot dot2"></div>');
  });
}
//场次更多点击展示

$('#JcqHide').click(function () {
  $('#Jdate').css('height', 'auto');
  $(this).hide();
  $('#JcqShow').show();
});
$('#JcqShow').click(function () {
  if (dateLiLen > 10) {
    $('#Jdate').css('height', '92px');
  };
  $(this).hide();
  $('#JcqHide').show();
});
//给每个票价加rnd标识，唯一性
$('.price-ck li').each(function (j) {
  $(this).attr('rs', 'rnd' + (j + 1));
});
//删除票价信息行
var delPrice = function (self, rnd) {
  //票价对应的被选中和取消选中
  $('.price-ck li').each(function () {
    if ($(this).attr('rs') == rnd) { //票价取消选中
      $(this).removeClass('on');
      if (ie6) {
        $(this).css('border-color', '#e5e5e5').css('background-position', ''); //兼容IE6去掉右角标
      }
    };
  });
  //删除票价信息行
  $('.relt-list .relt').each(function () {
    if ($(this).find('.relt-3').attr('rel') == rnd) {
      $(this).remove();
    };
  });
  if ($('.relt-list .relt').length < 2) $('#JchoosePrice').hide(); //删除到最后一条的 把前面的名字去掉
};
//先付阶段删除票价信息行
var delPriceRush = function (self, rnd) {
  //票价对应的被选中和取消选中
  $('.price-list li').each(function () {
    if ($(this).attr('rs') == rnd) { //票价取消选中
      $(this).removeClass('on');
      if (ie6) {
        $(this).css('border-color', '#e5e5e5').css('background-position', ''); //兼容IE6去掉右角标
      }
    };
  });
  //删除票价信息行
  $('.relt-list .relt').each(function () {
    if ($(this).find('.relt-3').attr('rel') == rnd) {
      $(this).remove();
    };
  });
  if ($('.relt-list .relt').length < 2) $('#JchoosePrice').hide(); //删除到最后一条的 把前面的名字去掉
};
//票价点击选中
var moreNum = 30; //允许购买的最大值
$('.price-ck li').click(function () {
  var _this = $(this);
  if (_this.attr('w') == 1) {
    return false;
  }
  if (_this.attr('w') == 2) {
    var btt = _this.attr('btt');
    var bttTime = new Date(btt);
    var systime = new Date(_this.attr('systime')).getTime();
    var cTime = bttTime - systime; //与当前时间的差值
    var message = '';
    if (cTime > 0) {
      if (cTime >= 24 * 3600000) {
        message = '活动将于' + btt + '开始，请耐心等候~';
      } else if (cTime < 24 * 3600000 && cTime >= 3600000) {
        message = '活动将于' + parseInt(cTime / 3600000) + '小时后开始，请耐心等候~';
      } else if (cTime < 3600000 && cTime >= 60 * 1000) {
        message = '活动将于' + parseInt(cTime / 60000) + '分钟后开始，请耐心等候~';
      } else if (cTime < 60 * 1000) {
        message = '活动将于' + parseInt(cTime / 1000) + '秒后开始，赶紧准备抢票吧~';
      }
      alert(message);
      return false;
    }
  }
  if (_this.attr('w') == 3) {
    alert('该票价为WAP专享');
    return false;
  }
  if (_this.attr('class') != 'over' && _this.attr('class') != 'over has_no_product') { //非卖完状态  -----或者通过pstatus来判断-----
    if (_this.css('width') == '208px') { //2栏时候宽度修复，border为2px影响
      _this.css('width', '207px');
    };
    _this.addClass('on');
    if (ie6) _this.css('background-position', '100% 0'); //兼容IE6加上右角标
    var cqPrice = _this.attr('rel');
    var rnd = _this.attr('rs');
    var arrts = [
    ]; //存放rnd
    var status = $(this).attr('s'),
    ppid = $(this).attr('p'),
    n = $(this).attr('n'),
    num = $(this).attr('l');
    // 数量限制的判定： num = num == '-1' ? '30' : num, 卖超了的 默认成0
    num = num == '-1' ? '30' : (((num * 1) < 0) ? '0' : num);
    // 库存 n<num 限制时采用库存  "10" < 8 false   "10" < "8" true
    num = (n != '-1' && n < (num * 1)) ? n : num;
    //增加日期、票价、数量行html 
    var selectPrice = '<ul class="dznew relt clearfloat">'
    + '<li class="relt-1">' + cqTime + '</li>'
    + '<li class="relt-2">' + '"' + cqPrice + '"' + '</li>'
    + '<li>'
    + '<dl><a href="javascript:void(0);" n="' + num + '" class="relt-prev" onclick="num(1, ' + num + ', this, false);"></a>'
    + '<input type="text"  class="yl-order" maxlength="2" value="1" n="' + num + '" ppid="' + ppid + '" onkeyup="setValuesInt(this,1, ' + num + ', false);"/>'
    + '<a href="javascript:void(0);" class="relt-next" n="' + num + '" onclick="num(2, ' + num + ', this, false);"></a></dl>'
    + '</li>'
    + '<li><a href="javascript:void(0);" class="relt-3" rel=' + rnd + ' onclick="delPrice(this,this.rel);">删除</a></li>'
    + '<li><div class="relt-msg">最多可订购' + num + '张!<s></s></div></li>'
    + '</ul>';
    $('.relt-list .relt').each(function (j) { //把已经选中的票价的rnd加入数组
      arrts.push($(this).find('.relt-3').attr('rel'));
    });
    if (!contains(arrts, rnd)) { //不包含的则添加票价信息行
      $('.relt-list').append(selectPrice);
      $('#JchoosePrice').show();
      //新选座选票价高亮显示处理
      //	    	var oldFlashUrl = $("#Jdate").children(".on").attr("cc");
      var oldFlashUrl = $('.zxxz').attr('href');
      var xzPriceId = _this.attr('xzpriceid');
    } else {
      _this.removeClass('on');
      if (ie6) _this.css('background-position', ''); //兼容IE6去掉右角标	
      if (_this.css('width') == '207px') { //2行框去掉选中的宽度修复
        _this.css('width', '208px');
      };
      //对应票价信息行的删除
      $('.relt-list .relt-3').each(function () {
        if ($(this).attr('rel') == rnd) {
          $(this).parent().parent().remove();
        };
      });
      if ($('.relt-list .relt').length < 1) $('#JchoosePrice').hide(); //删除到最后一条的 把前面的名字去掉
      //再次点击，取消新选座选票价高亮显示处理
      var oldFlashUrlCl = $('.zxxz').attr('href');
      //			var priceid = 0; 
      //			$(".on").each(function(){
      //				if ($(this).attr("xzpriceid") > priceid){					
      //					priceid = $(this).attr("xzpriceid");
      //				}
      //			});
      var arrayPrice = new Array();
      $('.on').each(function (i) {
        arrayPrice[i] = $(this).attr('xzpriceid');
      });
      var priceid = arrayPrice.join();
    };
    // selectedPlayDatePrice();
  };
});
//售完票价滑动
var priceInfo = '';
var productplaystatus = '';
var productStatus = '';
$('.price-ck .over').hover(function () {
  priceInfo = $(this).find('i').text();
  productplaystatus = $(this).attr('s');
  productStatus = $(this).attr('pstatus');
  $(this).css({
    'background-position': '100% -98px'
  }).find('i').text('缺货 碰碰运气~');
}, function () {
  //项目票状态为"已售完"
  //	if(productStatus=='2'){
  if (productStatus == '4') {
    //		if(productplaystatus=='2' || productNum == '0'){
    $(this).css({
      'background-position': '100% -54px'
    }).find('i').text(priceInfo);
  } 
  else {
    $(this).css({
      'background-position': '100% -205px'
    }).find('i').text(priceInfo);
  }
});
//ie6下票价框滑动红色框修复
if (ie6) {
  $('.date li').hover(function () {
    var _class = $(this).attr('class');
    if (_class != 'on' && _class != 'over')
    $(this).css('border-color', '#cc0001');
  }, function () {
    var _class = $(this).attr('class');
    if (_class != 'on' && _class != 'over')
    $(this).css('border-color', '#e5e5e5');
  });
};
//查看全部票价
$('#JpriceAll').click(function () {
  if ($('#JreltList ul').length > 0) {
    $('#JpriceBoxer').minBox({
    });
    $('#JpriceBoxer').css({
      top: 0
    });
    $('.relt-list').html('');
    $('.price-ck li').removeClass('on');
  } else {
    $('#JpriceBoxer').minBox({
    });
    $('#JpriceBoxer').css({
      top: 0
    });
  }
});
$('#JpriceBoxer .box-closes').click(function () {
  $('.relt-list').html('');
  $('.price-ck li').removeClass('on');
});
$('#JpriceBoxer .box-closes').minTips({
  tipStyle: 'b',
  tipWidth: 152,
  tipHeight: 20,
  tipConts: '关闭将取消已经选择的票价!',
  bgColor: 'red',
  events: 'hover'
});
$('#prices-all dl:last').css('border', 'none');
var boxSize = function () {
  var windheig = $(window).height();
  var boxheig = windheig - 80 - 295;
  //if(ie) boxheig = windheig-80-310;
  $('#prices-all').css({
    height: boxheig
  });
}
$(window).resize(function () {
  boxSize();
})
boxSize();
//缺货登记
$('.date-ul .over').click(function () {
  var _this = this;
  //定义产品id
  var productid = $('#productid').val();
  var url = getPath() + '/ajax/shortSupplyNew';
  $.post(url, {
    productid: productid
  }, function (data) {
    //取出缺货登记已登记信息
    var html_shortSupply = template.render('_template_shortSupplyNew', data);
    $('#qhdj_already').html(html_shortSupply);
    //缺货登记新登记场次
    //取出用户是否在线
    var dataStatus = data.status;
    if (dataStatus) {
      $('#qhdj_productplayid').val($(_this).attr('p'));
      $('#qhdj_productplaytime').text($('#Jdate li.on').attr('title'));
      $('#qhdj_productprice').text($(_this).attr('zp') + '元');
      $('#qhdj_num').val(1);
      $('#qhdj_productnum').html('1张');
      $('#JqueBoxer').minBox1({
      });
    } else {
      $('#jump-login').minBox1({
      });
      var ppid = $(_this).attr('p');
      var productTime = $('#Jdate li.on').attr('title');
      $.cookie('productPlayBox', ppid);
      //由于页面会刷新，相应的日期/场次信息无法在页面刷新后获取，所以放到cookie中
      $.cookie('productTime', productTime);
    }
  });
  return false;
});
//立刻购买  快速购买
$('.btn-now-buy').click(function () {
  var productid = $('#productid').val();
  var ghostCode = $('#ghostCode').val();
  var golfCode = $('#golfCode').val();
  var lpCode = $('#lpCode').val();
  var pid = $(this).attr('pid'),
  isqz = $(this).attr('q');
  var params = initOrders();
  var isLimit = $('#isLimit').val(); //限购功能
  var customerFlag = '0'; //判断用户浏览商品页是否登录 1为登录 0为未登录
  var url = getPath() + '/ajax/isLogin';
  $.ajax({
    type: 'get',
    url: url,
    async: false,
    success: function (data) {
      if (data) {
        customerFlag = '1';
      } else {
        customerFlag = '0';
      }
    }
  });
  if (null == params || '^' == params) {
    alert_sussnew('提示！', '请先选择票价！');
  } else if (!params) {
    alert_sussnew('提示！', '您选购的商品超过了最大限购数量！');
  } else {
    if (params.indexOf('75992470') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('75992951') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('71304006') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场演出往返车票15(儿童必须凭票乘车)必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('70029113') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('69647445') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('69221111') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('68833489') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('67583357') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('67583054') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('66436974') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('64088559') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    if (params.indexOf('65986417') > - 1 && params.split(',').length == 3) {
      alert_sussnew('错误', '本场比赛1元赠品必须购票后才可购买，单一购买此赠品视为无效~！');
      return;
    }
    // ajax 校验库存

    $.post(getPath() + '/ajax/checkPayLimit', {
      sd: params
    }, function (d) {
      if (d.status == 0) {
        var qzparam = isqz == '1' ? '&isqz=' + isqz : '';
        //人鬼情未了活动
        if (productid == 63046717) {
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&ghostCode=' + ghostCode;
          //判断商品是否需要答题
          hasnoquestion(urlpath);
        } else if (productid == 63375370) {
          //高尔夫深圳国际赛活动
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&golfCode=' + golfCode;
          //判断商品是否需要答题
          hasnoquestion(urlpath);
        } else if (pids.join(',').indexOf(productid) >= 0) {
          //LP活动
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&lpCode=' + lpCode;
          //判断商品是否需要答题
          hasnoquestion(urlpath);
        } else {
          //遮罩提交开始
          //遮罩提交结束
          //限购判断开始
          if (isLimit == '1' && customerFlag == '1') {
            var url = getPath() + '/cart/CusLimitTic';
            $.post(url, {
              productid: productid
            }, function (date) {
              if (!date) {
                alert_sussnew('不能购买!', '已超过商品限购订单数，不能继续购买。');
                return false;
              } else {
                var urlpath = getPath_fix() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
                //判断商品是否需要答题
                hasnoquestion(urlpath);
              }
            });
          } else {
            var urlpath = getPath_fix() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
            //判断商品是否需要答题
            hasnoquestion(urlpath);
          }
        }
      } else {
        var $lacks = d.lacks,
        dds = [
        ];
        for (var i = 0; i < $lacks.length; i++) {
          dds.push($('li[p="' + $lacks[i] + '"]').eq(0).attr('d'));
        }
        dds.join(',');
        alert_sussnew('提示！', '您选购的商品 ' + dds + ' 场次，库存已不足！');
      }
    });
  }
  __ozclk();
  return false;
});
//先付先抢
$('#btn-xfxq').click(function () {
  var productid = $('#productid').val();
  var pid = $(this).attr('pid'),
  isqz = $(this).attr('q');
  var params = initOrders();
  var isLimit = $('#isLimit').val(); //限购功能
  var customerFlag = '0'; //判断用户浏览商品页是否登录 1为登录 0为未登录
  var url = getPath() + '/ajax/isLogin';
  $.ajax({
    type: 'get',
    url: url,
    async: false,
    success: function (data) {
      if (data) {
        customerFlag = '1';
      } else {
        customerFlag = '0';
      }
    }
  });
  if (null == params || '^' == params) {
    alert_sussnew('提示！', '请先选择票价！');
  } else if (!params) {
    alert_sussnew('提示！', '您选购的商品超过了最大限购数量！');
  } else {
    // ajax 校验库存
    $.post(getPath() + '/ajax/checkPayLimit', {
      sd: params
    }, function (d) {
      if (d.status == 0) {
        var qzparam = isqz == '1' ? '&isqz=' + isqz : '';
        //限购判断开始
        if (isLimit == '1' && customerFlag == '1') {
          var url = getPath() + '/cart/CusLimitTic';
          $.post(url, {
            productid: productid
          }, function (date) {
            if (!date) {
              alert_sussnew('不能购买!', '已超过商品限购订单数，不能继续购买。');
              return false;
            } else {
              var urlpath = getPath_fix() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
              //判断商品是否需要答题
              hasnoquestion(urlpath);
            }
          });
        } else {
          var urlpath = getPath_fix() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
          //判断商品是否需要答题
          hasnoquestion(urlpath);
        }
      } else {
        var $lacks = d.lacks,
        dds = [
        ];
        for (var i = 0; i < $lacks.length; i++) {
          dds.push($('li[p="' + $lacks[i] + '"]').eq(0).attr('d'));
        }
        dds.join(',');
        alert_sussnew('提示！', '您选购的商品 ' + dds + ' 场次，库存已不足！');
      }
    });
  }
  return false;
});
// 特殊电子票
$('.dianzi').click(function () {
  var pid = $(this).attr('pid');
  var params = initOrders();
  if (null == params || '^' == params) {
    alert_sussnew('提示！', '请先选择票价！');
  } else {
    var urlpath = '/dzcomplete.html?pid=' + pid + '&sd=' + params;
    //判断商品是否需要答题
    hasnoquestion(urlpath);
  }
  return false;
});
//立刻购买  纸质票购买
$('.btn-p-buy').click(function () {
  var productid = $('#productid').val();
  var ghostCode = $('#ghostCode').val();
  var golfCode = $('#golfCode').val();
  var lpCode = $('#lpCode').val();
  var pid = $(this).attr('pid'),
  isqz = $(this).attr('q');
  var params = initOrders();
  if (null == params || '^' == params) {
    alert_sussnew('提示！', '请先选择票价！');
  } else if (!params) {
    alert_sussnew('提示！', '您选购的商品超过了最大限购数量！');
  } else {
    // ajax 校验库存
    $.post(getPath() + '/ajax/checkPayLimit', {
      sd: params
    }, function (d) {
      if (d.status == 0) {
        var qzparam = isqz == '1' ? '&isqz=' + isqz : '';
        //人鬼情未了活动
        if (productid == 63046717) {
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&ghostCode=' + ghostCode;
          //判断商品是否需要答题
          hasnoquestion(urlpath);
        } else if (productid == 63375370) {
          //高尔夫深圳国际赛活动
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&golfCode=' + golfCode;
          //判断商品是否需要答题
          hasnoquestion(urlpath);
        } else if (pids.join(',').indexOf(productid) >= 0) {
          //LP活动
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&lpCode=' + lpCode;
          //判断商品是否需要答题
          hasnoquestion(urlpath);
        } else {
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
          //判断商品是否需要答题
          hasnoquestion(urlpath);
        }
      } else {
        var $lacks = d.lacks,
        dds = [
        ];
        for (var i = 0; i < $lacks.length; i++) {
          dds.push($('li[p="' + $lacks[i] + '"]').eq(0).attr('d'));
        }
        dds.join(',');
        alert_sussnew('提示！', '您选购的商品 ' + dds + ' 场次，库存已不足！');
      }
    });
  }
  __ozclk();
  return false;
});
function getSeatFunction() {
  hasnoquestion(seatUrl);
}
function hasnoquestion(urlpath) {
  var ifquestion = $('#ifquestion').val();
  var productid = $('#productid').val();
  //答题商品
  if (ifquestion == 1) {
    lycquestion(urlpath, productid);
  }
  //非答题商品
   else {
    document.location.href = urlpath;
  }
}
