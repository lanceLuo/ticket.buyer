/*
 * jQuery priceSelect v0.2
 * Copyright (c) 2014-08-26 16:27 Jensen
 * ˵������ƷҳƱ��Ч��
 */
var seatUrl;
//��ʼ���ε�һ��ѡ�� �����һ�����ε�����Ʊ�۶��Ѿ����� �Ǿ�Ĭ�ϵڶ���ѡ�� һ������ ������ ���ĸ�
$(document).ready(function () {
  //��ʼ���ε�һ��ѡ�� BY lsy
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
//���εĸ߶ȵĿ���  ����10���ε����س�2��
var dateLiLen = $('#Jdate li').length;
if (dateLiLen > 10) {
  $('#Jdate').css('height', '92px');
} else {
  $('.cq-more').hide();
  $('#Jdate').css('margin-bottom', '10px');
};
var pids = new Array(66002646, 66002601, 66002057, 66001999, 66001895); //lpר��ʹ��
var pids2 = new Array(66066808, 66067376, 66067505, 66067063, 66067673); //lpר��ʹ��
//���ε��ѡ��    
var cqTime = $('#Jdate li:first').attr('title');
; //����ʱ��
var dz_num = 0;
$('#Jdate li').click(function () {
  //STORY #589::�������Ʊ��Ŀ�����ƿ糡�ι��� begin
  var _dz_path = $('#dz_path').val(); //��Ʒ��path�������֣��Ƿ��ǵ���Ʊ
  var _jprice_num = $('#Jprice li').length; //����Ʊ�۵���������
  var dzFlag = 0; //��ʼ��һ���Ƿ����������Ʊ 0 Ϊ���� 1 Ϊ��
  if (_dz_path.indexOf('dznewonline') != - 1) {
    dzFlag = 1;
  }
  if (dzFlag == 1) {
    dz_num = 1;
    if ($('#Jprice li[class=on]').length) {
      if (confirm('�Ƿ�ȡ����ѡ���Ʊ��')) {
        $('#Jprice li').attr('class', '');
        $('#JchoosePrice').hide();
        $('.dznew').remove();
      } else {
        return;
      }
    }
  }
  //STORY #589::�������Ʊ��Ŀ�����ƿ糡�ι��� end	

  $('#Jdate li').removeClass();
  if (ie6) {
    $('#Jdate li').css('border-color', '#e5e5e5');
    $(this).css('border-color', '#cc0001');
    $('#Jdate li').css('background-position', ''); //ie6��ǿ��ȥ�����½ǵ�ͼ��
  }
  $('#Jdate li').each(function () { //2��ʱ������Ϊ��ʼֵ
    if ($(this).css('width') == '207px') {
      $(this).css('width', '208px');
    };
  });
  if ($(this).css('width') == '208px') { //2��ʱ�����޸���borderΪ2pxӰ��
    $(this).css('width', '207px');
  };
  $(this).addClass('on');
  if (ie6) $(this).css('background-position', '100% 0');
  cqTime = $(this).attr('title');
  var xzurl = $(this).attr('cc');
  var prices = $('#z_price li'); //Ʊ��
  var cdate = $(this).attr('d'); //��������
  $('#Jprice li').removeClass('choose').hide(); //�����ʽ
  $('#Jprice li[d="' + cdate + '"]').show(); //��ʾ��������Ʊ��
  // <span>2012��04��20��</span><span>������</span>19:30
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
  // ����ֻ��һ��Ʊ�ۣ����ҳ���ֻ��һ�ε�Ĭ��ѡ��

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
  // �ݳ�ǰ�����ж�

  var $errorBerfor = $('.error_berfor_msg');
  var $_li = $('#Jdate li[event=1]:eq(0)'); // ��������
  if ('${isberfor}' === '1') {
    var ddate = cdate.replace(/-/g, '/');
    var playDate = new Date(ddate).getTime();
    var now = new Date();
    var temp = now.setDate(now.getDate() + 4) > playDate; // �ݳ�ǰ����
    $(this).attr('cc', ''); // �Ƴ�cc
    if (temp) {
      $(this).attr('cc', ''); // �Ƴ�cc
      if ($_li.length !== 0) {
        $errorBerfor.html('��' + cdate + '�� �����ݳ�ǰ���죬ƱƷ�޷���������Ҳ�֧��������ȡ��Ŀǰ�Ѳ��ܹ��򣬸��������Ĳ��㣬�����½⡣��').show();
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
//���θ�����չʾ

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
//��ÿ��Ʊ�ۼ�rnd��ʶ��Ψһ��
$('.price-ck li').each(function (j) {
  $(this).attr('rs', 'rnd' + (j + 1));
});
//ɾ��Ʊ����Ϣ��
var delPrice = function (self, rnd) {
  //Ʊ�۶�Ӧ�ı�ѡ�к�ȡ��ѡ��
  $('.price-ck li').each(function () {
    if ($(this).attr('rs') == rnd) { //Ʊ��ȡ��ѡ��
      $(this).removeClass('on');
      if (ie6) {
        $(this).css('border-color', '#e5e5e5').css('background-position', ''); //����IE6ȥ���ҽǱ�
      }
    };
  });
  //ɾ��Ʊ����Ϣ��
  $('.relt-list .relt').each(function () {
    if ($(this).find('.relt-3').attr('rel') == rnd) {
      $(this).remove();
    };
  });
  if ($('.relt-list .relt').length < 2) $('#JchoosePrice').hide(); //ɾ�������һ���� ��ǰ�������ȥ��
};
//�ȸ��׶�ɾ��Ʊ����Ϣ��
var delPriceRush = function (self, rnd) {
  //Ʊ�۶�Ӧ�ı�ѡ�к�ȡ��ѡ��
  $('.price-list li').each(function () {
    if ($(this).attr('rs') == rnd) { //Ʊ��ȡ��ѡ��
      $(this).removeClass('on');
      if (ie6) {
        $(this).css('border-color', '#e5e5e5').css('background-position', ''); //����IE6ȥ���ҽǱ�
      }
    };
  });
  //ɾ��Ʊ����Ϣ��
  $('.relt-list .relt').each(function () {
    if ($(this).find('.relt-3').attr('rel') == rnd) {
      $(this).remove();
    };
  });
  if ($('.relt-list .relt').length < 2) $('#JchoosePrice').hide(); //ɾ�������һ���� ��ǰ�������ȥ��
};
//Ʊ�۵��ѡ��
var moreNum = 30; //����������ֵ
$('.price-ck li').click(function () {
  var _this = $(this);
  if (_this.attr('w') == 1) {
    return false;
  }
  if (_this.attr('w') == 2) {
    var btt = _this.attr('btt');
    var bttTime = new Date(btt);
    var systime = new Date(_this.attr('systime')).getTime();
    var cTime = bttTime - systime; //�뵱ǰʱ��Ĳ�ֵ
    var message = '';
    if (cTime > 0) {
      if (cTime >= 24 * 3600000) {
        message = '�����' + btt + '��ʼ�������ĵȺ�~';
      } else if (cTime < 24 * 3600000 && cTime >= 3600000) {
        message = '�����' + parseInt(cTime / 3600000) + 'Сʱ��ʼ�������ĵȺ�~';
      } else if (cTime < 3600000 && cTime >= 60 * 1000) {
        message = '�����' + parseInt(cTime / 60000) + '���Ӻ�ʼ�������ĵȺ�~';
      } else if (cTime < 60 * 1000) {
        message = '�����' + parseInt(cTime / 1000) + '���ʼ���Ͻ�׼����Ʊ��~';
      }
      alert(message);
      return false;
    }
  }
  if (_this.attr('w') == 3) {
    alert('��Ʊ��ΪWAPר��');
    return false;
  }
  if (_this.attr('class') != 'over' && _this.attr('class') != 'over has_no_product') { //������״̬  -----����ͨ��pstatus���ж�-----
    if (_this.css('width') == '208px') { //2��ʱ�����޸���borderΪ2pxӰ��
      _this.css('width', '207px');
    };
    _this.addClass('on');
    if (ie6) _this.css('background-position', '100% 0'); //����IE6�����ҽǱ�
    var cqPrice = _this.attr('rel');
    var rnd = _this.attr('rs');
    var arrts = [
    ]; //���rnd
    var status = $(this).attr('s'),
    ppid = $(this).attr('p'),
    n = $(this).attr('n'),
    num = $(this).attr('l');
    // �������Ƶ��ж��� num = num == '-1' ? '30' : num, �����˵� Ĭ�ϳ�0
    num = num == '-1' ? '30' : (((num * 1) < 0) ? '0' : num);
    // ��� n<num ����ʱ���ÿ��  "10" < 8 false   "10" < "8" true
    num = (n != '-1' && n < (num * 1)) ? n : num;
    //�������ڡ�Ʊ�ۡ�������html 
    var selectPrice = '<ul class="dznew relt clearfloat">'
    + '<li class="relt-1">' + cqTime + '</li>'
    + '<li class="relt-2">' + '"' + cqPrice + '"' + '</li>'
    + '<li>'
    + '<dl><a href="javascript:void(0);" n="' + num + '" class="relt-prev" onclick="num(1, ' + num + ', this, false);"></a>'
    + '<input type="text"  class="yl-order" maxlength="2" value="1" n="' + num + '" ppid="' + ppid + '" onkeyup="setValuesInt(this,1, ' + num + ', false);"/>'
    + '<a href="javascript:void(0);" class="relt-next" n="' + num + '" onclick="num(2, ' + num + ', this, false);"></a></dl>'
    + '</li>'
    + '<li><a href="javascript:void(0);" class="relt-3" rel=' + rnd + ' onclick="delPrice(this,this.rel);">ɾ��</a></li>'
    + '<li><div class="relt-msg">���ɶ���' + num + '��!<s></s></div></li>'
    + '</ul>';
    $('.relt-list .relt').each(function (j) { //���Ѿ�ѡ�е�Ʊ�۵�rnd��������
      arrts.push($(this).find('.relt-3').attr('rel'));
    });
    if (!contains(arrts, rnd)) { //�������������Ʊ����Ϣ��
      $('.relt-list').append(selectPrice);
      $('#JchoosePrice').show();
      //��ѡ��ѡƱ�۸�����ʾ����
      //	    	var oldFlashUrl = $("#Jdate").children(".on").attr("cc");
      var oldFlashUrl = $('.zxxz').attr('href');
      var xzPriceId = _this.attr('xzpriceid');
    } else {
      _this.removeClass('on');
      if (ie6) _this.css('background-position', ''); //����IE6ȥ���ҽǱ�	
      if (_this.css('width') == '207px') { //2�п�ȥ��ѡ�еĿ���޸�
        _this.css('width', '208px');
      };
      //��ӦƱ����Ϣ�е�ɾ��
      $('.relt-list .relt-3').each(function () {
        if ($(this).attr('rel') == rnd) {
          $(this).parent().parent().remove();
        };
      });
      if ($('.relt-list .relt').length < 1) $('#JchoosePrice').hide(); //ɾ�������һ���� ��ǰ�������ȥ��
      //�ٴε����ȡ����ѡ��ѡƱ�۸�����ʾ����
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
//����Ʊ�ۻ���
var priceInfo = '';
var productplaystatus = '';
var productStatus = '';
$('.price-ck .over').hover(function () {
  priceInfo = $(this).find('i').text();
  productplaystatus = $(this).attr('s');
  productStatus = $(this).attr('pstatus');
  $(this).css({
    'background-position': '100% -98px'
  }).find('i').text('ȱ�� ��������~');
}, function () {
  //��ĿƱ״̬Ϊ"������"
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
//ie6��Ʊ�ۿ򻬶���ɫ���޸�
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
//�鿴ȫ��Ʊ��
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
  tipConts: '�رս�ȡ���Ѿ�ѡ���Ʊ��!',
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
//ȱ���Ǽ�
$('.date-ul .over').click(function () {
  var _this = this;
  //�����Ʒid
  var productid = $('#productid').val();
  var url = getPath() + '/ajax/shortSupplyNew';
  $.post(url, {
    productid: productid
  }, function (data) {
    //ȡ��ȱ���Ǽ��ѵǼ���Ϣ
    var html_shortSupply = template.render('_template_shortSupplyNew', data);
    $('#qhdj_already').html(html_shortSupply);
    //ȱ���Ǽ��µǼǳ���
    //ȡ���û��Ƿ�����
    var dataStatus = data.status;
    if (dataStatus) {
      $('#qhdj_productplayid').val($(_this).attr('p'));
      $('#qhdj_productplaytime').text($('#Jdate li.on').attr('title'));
      $('#qhdj_productprice').text($(_this).attr('zp') + 'Ԫ');
      $('#qhdj_num').val(1);
      $('#qhdj_productnum').html('1��');
      $('#JqueBoxer').minBox1({
      });
    } else {
      $('#jump-login').minBox1({
      });
      var ppid = $(_this).attr('p');
      var productTime = $('#Jdate li.on').attr('title');
      $.cookie('productPlayBox', ppid);
      //����ҳ���ˢ�£���Ӧ������/������Ϣ�޷���ҳ��ˢ�º��ȡ�����Էŵ�cookie��
      $.cookie('productTime', productTime);
    }
  });
  return false;
});
//���̹���  ���ٹ���
$('.btn-now-buy').click(function () {
  var productid = $('#productid').val();
  var ghostCode = $('#ghostCode').val();
  var golfCode = $('#golfCode').val();
  var lpCode = $('#lpCode').val();
  var pid = $(this).attr('pid'),
  isqz = $(this).attr('q');
  var params = initOrders();
  var isLimit = $('#isLimit').val(); //�޹�����
  var customerFlag = '0'; //�ж��û������Ʒҳ�Ƿ��¼ 1Ϊ��¼ 0Ϊδ��¼
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
    alert_sussnew('��ʾ��', '����ѡ��Ʊ�ۣ�');
  } else if (!params) {
    alert_sussnew('��ʾ��', '��ѡ������Ʒ����������޹�������');
  } else {
    if (params.indexOf('75992470') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('75992951') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('71304006') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '�����ݳ�������Ʊ15(��ͯ����ƾƱ�˳�)���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('70029113') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('69647445') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('69221111') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('68833489') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('67583357') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('67583054') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('66436974') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('64088559') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    if (params.indexOf('65986417') > - 1 && params.split(',').length == 3) {
      alert_sussnew('����', '��������1Ԫ��Ʒ���빺Ʊ��ſɹ��򣬵�һ�������Ʒ��Ϊ��Ч~��');
      return;
    }
    // ajax У����

    $.post(getPath() + '/ajax/checkPayLimit', {
      sd: params
    }, function (d) {
      if (d.status == 0) {
        var qzparam = isqz == '1' ? '&isqz=' + isqz : '';
        //�˹���δ�˻
        if (productid == 63046717) {
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&ghostCode=' + ghostCode;
          //�ж���Ʒ�Ƿ���Ҫ����
          hasnoquestion(urlpath);
        } else if (productid == 63375370) {
          //�߶������ڹ������
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&golfCode=' + golfCode;
          //�ж���Ʒ�Ƿ���Ҫ����
          hasnoquestion(urlpath);
        } else if (pids.join(',').indexOf(productid) >= 0) {
          //LP�
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&lpCode=' + lpCode;
          //�ж���Ʒ�Ƿ���Ҫ����
          hasnoquestion(urlpath);
        } else {
          //�����ύ��ʼ
          //�����ύ����
          //�޹��жϿ�ʼ
          if (isLimit == '1' && customerFlag == '1') {
            var url = getPath() + '/cart/CusLimitTic';
            $.post(url, {
              productid: productid
            }, function (date) {
              if (!date) {
                alert_sussnew('���ܹ���!', '�ѳ�����Ʒ�޹������������ܼ�������');
                return false;
              } else {
                var urlpath = getPath_fix() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
                //�ж���Ʒ�Ƿ���Ҫ����
                hasnoquestion(urlpath);
              }
            });
          } else {
            var urlpath = getPath_fix() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
            //�ж���Ʒ�Ƿ���Ҫ����
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
        alert_sussnew('��ʾ��', '��ѡ������Ʒ ' + dds + ' ���Σ�����Ѳ��㣡');
      }
    });
  }
  __ozclk();
  return false;
});
//�ȸ�����
$('#btn-xfxq').click(function () {
  var productid = $('#productid').val();
  var pid = $(this).attr('pid'),
  isqz = $(this).attr('q');
  var params = initOrders();
  var isLimit = $('#isLimit').val(); //�޹�����
  var customerFlag = '0'; //�ж��û������Ʒҳ�Ƿ��¼ 1Ϊ��¼ 0Ϊδ��¼
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
    alert_sussnew('��ʾ��', '����ѡ��Ʊ�ۣ�');
  } else if (!params) {
    alert_sussnew('��ʾ��', '��ѡ������Ʒ����������޹�������');
  } else {
    // ajax У����
    $.post(getPath() + '/ajax/checkPayLimit', {
      sd: params
    }, function (d) {
      if (d.status == 0) {
        var qzparam = isqz == '1' ? '&isqz=' + isqz : '';
        //�޹��жϿ�ʼ
        if (isLimit == '1' && customerFlag == '1') {
          var url = getPath() + '/cart/CusLimitTic';
          $.post(url, {
            productid: productid
          }, function (date) {
            if (!date) {
              alert_sussnew('���ܹ���!', '�ѳ�����Ʒ�޹������������ܼ�������');
              return false;
            } else {
              var urlpath = getPath_fix() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
              //�ж���Ʒ�Ƿ���Ҫ����
              hasnoquestion(urlpath);
            }
          });
        } else {
          var urlpath = getPath_fix() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
          //�ж���Ʒ�Ƿ���Ҫ����
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
        alert_sussnew('��ʾ��', '��ѡ������Ʒ ' + dds + ' ���Σ�����Ѳ��㣡');
      }
    });
  }
  return false;
});
// �������Ʊ
$('.dianzi').click(function () {
  var pid = $(this).attr('pid');
  var params = initOrders();
  if (null == params || '^' == params) {
    alert_sussnew('��ʾ��', '����ѡ��Ʊ�ۣ�');
  } else {
    var urlpath = '/dzcomplete.html?pid=' + pid + '&sd=' + params;
    //�ж���Ʒ�Ƿ���Ҫ����
    hasnoquestion(urlpath);
  }
  return false;
});
//���̹���  ֽ��Ʊ����
$('.btn-p-buy').click(function () {
  var productid = $('#productid').val();
  var ghostCode = $('#ghostCode').val();
  var golfCode = $('#golfCode').val();
  var lpCode = $('#lpCode').val();
  var pid = $(this).attr('pid'),
  isqz = $(this).attr('q');
  var params = initOrders();
  if (null == params || '^' == params) {
    alert_sussnew('��ʾ��', '����ѡ��Ʊ�ۣ�');
  } else if (!params) {
    alert_sussnew('��ʾ��', '��ѡ������Ʒ����������޹�������');
  } else {
    // ajax У����
    $.post(getPath() + '/ajax/checkPayLimit', {
      sd: params
    }, function (d) {
      if (d.status == 0) {
        var qzparam = isqz == '1' ? '&isqz=' + isqz : '';
        //�˹���δ�˻
        if (productid == 63046717) {
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&ghostCode=' + ghostCode;
          //�ж���Ʒ�Ƿ���Ҫ����
          hasnoquestion(urlpath);
        } else if (productid == 63375370) {
          //�߶������ڹ������
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&golfCode=' + golfCode;
          //�ж���Ʒ�Ƿ���Ҫ����
          hasnoquestion(urlpath);
        } else if (pids.join(',').indexOf(productid) >= 0) {
          //LP�
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam + '&lpCode=' + lpCode;
          //�ж���Ʒ�Ƿ���Ҫ����
          hasnoquestion(urlpath);
        } else {
          var urlpath = getPath() + '/cart/quickbuy?pid=' + pid + '&sd=' + params + qzparam;
          //�ж���Ʒ�Ƿ���Ҫ����
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
        alert_sussnew('��ʾ��', '��ѡ������Ʒ ' + dds + ' ���Σ�����Ѳ��㣡');
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
  //������Ʒ
  if (ifquestion == 1) {
    lycquestion(urlpath, productid);
  }
  //�Ǵ�����Ʒ
   else {
    document.location.href = urlpath;
  }
}
