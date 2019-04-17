$(function () {
    var C_ID = getParam().C_ID;
    //console.log(C_ID)
	var $top = $('#top'),
		$leftstar = $('#leftstar'),
		$rightstar = $('#rightstar'),
		$boy = $('#boy'),
		$tip = $('#tip'),
		$superman = $('#superman'),
		$openPacket=$('#openpacket');
	var bag=setInterval(function() {
		var ratio = $top.height() / $top.width();
		//console.log(ratio)
		ratio = ratio < 0.49 ? 0.58 : 0.48;
		$top.animate({
			width: '108%',
			height: $top.width() * ratio,
			left: '-4%'
		}, 400).animate({
			width: '100%',
			height: '3.3rem',
			left: 0
		}, 400);
	}, 2000);
	setInterval(function() {
		$rightstar.fadeOut(500).fadeIn(500);
		$leftstar.fadeOut(500).fadeIn(500);
	}, 1000);
	$('.off').on('click', function () {
	    $(this).hide();
	    $('.cover').hide();
	    setTimeout(function () {
	        $tip.animate({
	            left: '0.6rem'
	        });
	    }, 1000);
	    setTimeout(function () {
	        $boy.animate({
	            left: '3.34rem'
	        }).queue(function () {
	            $leftstar.css('zIndex', 5);
	            $rightstar.css('zIndex', 5);
	            $(this).dequeue();
	        });
	    }, 2000);
	    var isok = true;
	    $('#fallBox').on('click', 'img', function (e) {
	        if (!isok) return false;
	        isok = false;
	        //$.getJSON('/Redpackets/Redpackets_Receive', { C_ID: C_ID }).done(function (r) {
                //console.log(r)
                var r={isok:'true'};
	            if (r.isok == 'false') {
	                $superman.html('<p>对不起！<br /><span>您的积分不足50分，<br/>还不能参加现金抽奖，<br/>请集够积分后再来抽奖。</span></p>').css({
	                    width: '5.65rem',
	                    height: '4rem',
                        left:0
	                }).fadeIn();
	            }
	            if (r.isok == 'true') {
	                clearInterval(append);
	                clearInterval(bag);
	                $superman.html('<p>恭喜您<br /><span>获得现金红包'+r.info+'元</span><br/><font>请到公众号领取</font></p>').delay(1600).fadeIn();
	                $openPacket.animate({
	                    width: '4.1rem',
	                    marginTop: '-3.28rem',
	                    marginLeft: '-2.05rem'
	                }, 800).queue(function () {
	                    $(this).attr('src', 'img/packet.gif');
	                    $(this).dequeue();
	                });
	                $('.sun').delay(200).animate({
	                    width: '8rem',
	                    height: '8rem',
	                    marginTop: '-4rem',
	                    marginLeft: '-4rem'
	                });
	            }
	        //});
	    });
	});
	//红包雨
	var Random = function(e) {
		return Math.floor(Math.random() * e);
	};
	var snowing = '';
	for(var i = 0; i < 6; i++) {
		snowing += '@keyframes snow' + i + ' {0% {transform: translateX(0px) translateY(0px) rotate(0deg);}50% {';
		snowing += 'transform: translateX(' + (Random(300) - 150) + 'px) translateY(' + (Random(200) - 100) + 'px) rotate(' + (Random(1600) - 800) + 'deg);transform-origin:right bottom;}100%{transform: translateX(0px) translateY(0px) rotate(0deg);}}';
		snowing += '@-webkit-keyframes snow' + i + ' {0% {transform: translateX(0px) translateY(0px) rotate(0deg);}50% {';
		snowing += '-webkit-transform: translateX(' + (Random(300) - 150) + 'px) translateY(' + (Random(200) - 100) + 'px) rotate(' + (Random(1600) - 800) + 'deg);-webkit-transform-origin:right bottom;}100%{transform: translateX(0px) translateY(0px) rotate(0deg);}}';
		snowing += '@-moz-keyframes snow' + i + ' {0% {transform: translateX(0px) translateY(0px) rotate(0deg);}50% {';
		snowing += '-moz-transform: translateX(' + (Random(300) - 150) + 'px) translateY(' + (Random(200) - 100) + 'px) rotate(' + (Random(1600) - 800) + 'deg);-moz-transform-origin:right bottom;}100%{transform: translateX(0px) translateY(0px) rotate(0deg);}}';
		snowing += '@-ms-keyframes snow' + i + ' {0% {transform: translateX(0px) translateY(0px) rotate(0deg);}50% {';
		snowing += '-ms-transform: translateX(' + (Random(300) - 150) + 'px) translateY(' + (Random(200) - 100) + 'px) rotate(' + (Random(1600) - 800) + 'deg);-ms-transform-origin:right bottom;}100%{transform: translateX(0px) translateY(0px) rotate(0deg);}}';
	}
	$('#animation').html(snowing);
	var append = setInterval(function() {
		var mathI = Random(6);
		i++;
	    $('<img src="img/packet.png">').css({
			position: 'absolute',
			zIndex: 3,
			left: (Random(40) + 24) + '%',
			width: Random(40) / 100 + 0.6 + 'rem',
			top: +Random(10) / 10 + 'rem',
			animation: 'snow' + mathI + ' 16s linear infinite',
			'-webkit-animation': 'snow' + mathI + ' 16s linear infinite',
			'-moz-animation': 'snow' + mathI + ' 16s linear infinite',
			'-ms-animation': 'snow' + mathI + ' 16s linear infinite'
		}).appendTo('#fallBox').animate({
			top: '100%'
		}, (Random(2000) + 5000));
		if(i >= 40) {
			$('#fallBox img').eq(0).remove();
		}
	}, 200);
});
function getParam() {
    var search = window.location.search.length > 0 ? window.location.search.substring(1) : [],
        obj = {},
        items = search.length ? search.split('&') : [],
        item = null, name = null, value = null, i = 0, len = items.length;
    for (i = 0; i < len; i++) {
        item = items[i].split('=');
        name = item[0];
        value = item[1];
        if (name.length) {
            obj[name] = value;
        }
    }
    return obj;
}
(function(doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function() {
			var clientWidth = docEl.clientWidth;
			if(!clientWidth) return;
			if(clientWidth >= 640) {
				docEl.style.fontSize = '100px';
			} else {
				docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
			}
		};

	if(!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);