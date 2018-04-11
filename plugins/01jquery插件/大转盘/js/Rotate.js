$(function() {
	$.defaults.Beats=2;
	$.lottery_rotate({
		Beats:1
	});
});
(function($) {
	$.defaults = {
		Button: $('.rotateBtn'), //点击按钮
		StyleId: $('#css3'), //style标签id
		RotateChild: $('.rotateChild'), //转盘
		List: ['免单4999元', '免单50元', '免单10元', '免单5元', '免分期服务费', '提高白条额度', '未中奖'],
		Beats: 3, //抽奖次数
		Time: 1, //旋转时间
		Rings: 10, //旋转次数
		Easing: 'ease-out', //缓动效果（ease-in,ease-out,ease-in-out）
	};
	$.lottery_rotate = function(options) {
		var opt = $.extend({}, $.defaults, options);
		var I = 0,
			isok = true,
			Arr = [];
		opt.Button.click(function() {
			if(isok) {
				isok = false;
				opt.Button.prop('disabled', true);
				var time = opt.Time;
				var arr = [],
					Deg = parseInt(Math.random() * 360),
					each = (360 / opt.List.length);
				I += 1;
				if(I > opt.Beats) {
					alert('次数已用尽')
					return;
				}
				for(i = 1; i <= opt.List.length; i++) {
					var limit = each * i - each / 2 - Deg;
					if(limit < 0) {
						limit *= -1;
					}
					arr.push(limit);
				}
				var min = Math.min.apply(null, arr),
					minIndex = arr.indexOf(min),
					NewTotal = (each * (minIndex + 1) - each / 2) + 360 * opt.Rings;
				var rotate = '@-ms-keyframes rotation' + I + '{from{-ms-transform:rotate(' + 0 + 'deg)}to{-ms-transform:rotate(' + NewTotal + 'deg)}}\n' +
					'@keyframes rotation' + I + '{from{transform:rotate(' + 0 + 'deg)}to{transform:rotate(' + NewTotal + 'deg)}}\n' +
					'@-webkit-keyframes rotation' + I + '{from{-webkit-transform:rotate(' + 0 + 'deg)}to{-webkit-transform:rotate(' + NewTotal + 'deg)}}\n' +
					'@-moz-keyframes rotation' + I + '{from{-moz-transform:rotate(' + 0 + 'deg)}to{-moz-transform:rotate(' + NewTotal + 'deg)}}';
				opt.StyleId.html(rotate);
				opt.RotateChild.css({
					'animation': 'rotation' + I + ' ease-out ' + opt.Time + 's',
					'transform': 'rotate(' + NewTotal + 'deg)'
				});
				var count = setInterval(function() {
					time--;
					if(time == 0) {
						opt.Button.prop('disabled', false);
						isok = true;
					}
				}, 1000);
				var Award = opt.List[minIndex];
				Arr.push(Award);
				console.log(Award);
			}
		});
	}
})(jQuery)