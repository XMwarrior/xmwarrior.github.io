/*author：XM-warrior*/
/*引用*/
var $LI = $('.slideIn li');
var $DD = $('.slideBox dd');
var $Icon = $('.iconStyle');
$(function() {
	$LI.Full_fit();
	$LI.Auto_slide();
	$DD.click(function(e) {
		if(e.target.className == 'next') {
			$LI.Slide_left();
		} else {
			$LI.Slide_right();
		}
	});
	$('.iconStyle').hover(function() {
		var choose_index = $(this).index();
		$(this).css('background-color', 'red').siblings().css('background-color', 'gray');
		$LI.css('left', '100%');
		$LI.eq(choose_index).css('left', 0);
	});
});
/*插件*/
(function($) {
	//切换方向全局插件
	$.extend({
		Slide: function(options) {
			var defaults = {
				$self: $('.slideIn li'),
				li_length: $('.slideIn li').length,
				$icon: $('.iconStyle'),
				I: 1
			}
			var opt = $.extend(defaults, options);
			var isok, isno;
			if(defaults.I == 1) {
				isok = defaults.li_length - 1;
				isno = 0;
			} else if(defaults.I == -1) {
				isok = 0;
				isno = defaults.li_length - 1;
			}
			defaults.$self.each(function() {
				if($(this).css('left') == '0px') {
					var show_index = $(this).index();
					var next_index = show_index + defaults.I;
					if(show_index == isok) {
						next_index = isno;
					}
					defaults.$icon.eq(next_index).css('background-color', 'red').siblings().css('background-color', 'gray'); //slide_icon
					$(this).css('left', 0).siblings().css('left', 100 * defaults.I + '%');
					$(this).animate({
						left: 100 * -defaults.I + '%'
					});
					defaults.$self.eq(next_index).animate({
						left: 0
					});
				}
			});
		}
	});
	//方法插件
	$.fn.extend({
		//图片自适应方法
		Full_fit: function() {
			var BoxW = $(this).width(),
				BoxH = $(this).height(),
				Box_ratio = BoxW / BoxH;
			$.each($(this), function(i, n) {
				var src = $(n).find('img').attr('src'),
					split = src.indexOf('?split=');
				if(split < 0) {
					var new_src = src + '?split=' + Math.random();
				} else {
					var new_src = src.split('?split=')[0] + '?split=' + Math.random();
				}
				$(this).find('img').attr('src', new_src).load(function() {
					var imgW = $(this).width(),
						imgH = $(this).height();
					img_ratio = imgW / imgH;
					if(Box_ratio >= img_ratio) {
						$(this).css('top', BoxH - imgH);
					} else {
						$(this).css('left', BoxW - imgW);
					}
				});
				$('<li class="iconStyle"></li>').appendTo('.slideIcon ul'); //--------------------------------slide_icon
			});
		},
		//自动切换方法
		Auto_slide: function() {
			$('.iconStyle').eq(0).css('background-color', 'red').siblings().css('background-color', 'gray'); //---------slide_icon
			$LI.eq(0).css('left', 0).siblings().css('left', '100%');
			var auto_slide = setInterval($.Slide, 5000);
			$('.slideBox').hover(function() {
				clearInterval(auto_slide);
			}, function() {
				auto_slide = setInterval($.Slide, 5000);
			});
		},
		Slide_left: function() {
			$.Slide();
		},
		Slide_right: function() {
			$.Slide({
				I: -1
			});
		}
	});
})(jQuery)