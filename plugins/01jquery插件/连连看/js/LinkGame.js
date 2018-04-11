window.onload = function() {
	$.Link_game();
};
/*插件*/
(function($) {
	$.extend({
		defaults: {
			imgArr: ["img/01.jpg", "img/02.jpg", "img/03.jpg", "img/04.jpg", "img/05.jpg", "img/06.jpg", "img/07.jpg", "img/08.jpg", "img/09.jpg", "img/10.jpg"],
			imgWidth: 50,
			imgMargin: 10,
			imgSize: 60,
			imgBorder: 2,
			X: 6,
			Y: 6,
			arr: []
		},
		Link_game: function(options) {
			var opt = $.extend({}, $.defaults, options);
			for(var x = 0; x < opt.X; x++) {
				for(var y = 0; y < opt.Y; y++) {
					opt.arr.push(x + '_' + y);
				}
			}
			opt.arr.sort(randomsort);
			/*添加图片*/
			for(var i = 0; i < opt.arr.length / 2; i++) {
				var I = parseInt(Math.random() * opt.imgArr.length);
				var Left1 = opt.imgSize * opt.arr[i].split('_')[0],
					Top1 = opt.imgSize * opt.arr[i].split('_')[1],
					Left2 = opt.imgSize * opt.arr[opt.arr.length / 2 + i].split('_')[0],
					Top2 = opt.imgSize * opt.arr[opt.arr.length / 2 + i].split('_')[1],
					imgSign = opt.imgArr[I].replace(/img\/|\.[A-Za-z]+/g, '');
				$('<div class="LinkGame_add" id="' + Left1 + '_' + Top1 + '_' + imgSign + '"></div>').css({
					width: opt.imgWidth,
					height: 0,
					left: Left1,
					top: Top1,
					paddingBottom: opt.imgWidth,
					backgroundImage: function() {
						return 'url(' + opt.imgArr[I] + ')'
					}
				}).appendTo('.LinkGame');
				$('<div class="LinkGame_add" id="' + Left2 + '_' + Top2 + '_' + imgSign + '"></div>').css({
					width: opt.imgWidth,
					height: 0,
					left: Left2,
					top: Top2,
					paddingBottom: opt.imgWidth,
					backgroundImage: function() {
						return 'url(' + opt.imgArr[I] + ')'
					}
				}).appendTo('.LinkGame');
			}
			/*容器布局*/
			$('.LinkGame').css({
				width: opt.imgSize * opt.X,
				height: opt.imgSize * opt.Y,
				marginTop: opt.imgSize * opt.Y / -2,
				paddingRight: opt.imgMargin,
				paddingBottom: opt.imgMargin
			});
			/*canvas连线*/
			$('#canvas').css({
				marginTop: opt.imgSize * opt.Y / -2,
				marginLeft: opt.imgSize * opt.X / -2 - opt.imgMargin / 2,
				paddingRight: opt.imgMargin,
				paddingBottom: opt.imgMargin
			}).attr({
				width: opt.imgSize * opt.X,
				height: opt.imgSize * opt.Y,
			});
			var context = $('#canvas')[0].getContext('2d');
			/*点击事件*/
			var changeArr = [];
			$('.LinkGame_add').on('click', function() {
				var Id = $(this).attr('id');
				if(changeArr.length < 2&&changeArr.indexOf(Id)<0) {
					changeArr.push(Id);
					$('#' + Id).add_border();
				}
				if(changeArr.length == 2) {
					var a = changeArr[0],
						b = changeArr[1];
					if(line1(a, b, context) || line2(a, b, context) || line3(a, b, context)) {
						if(line1(a, b, context)) {
							line_to(a, b, context);
						}
						setTimeout(function() {
							context.clearRect(0, 0, $('#canvas').width(), $('#canvas').height());
							$('#' + a + ',#' + b).delete_border().addClass('hidden').hide();
							changeArr = [];
						}, 500);
					} else {
						$('#' + a).delete_border();
						changeArr.shift(a);
					}
				}
				if($('.hidden').length == (opt.X * opt.Y)) {
					console.log('恭喜你成功通关！')
				}
			});

			function line1(idA, idB, context) {
				a = idA.split('_');
				b = idB.split('_');
				var a_x = a[0],
					a_y = a[1],
					a_img = a[2],
					b_x = b[0],
					b_y = b[1],
					b_img = b[2];
				var bool_idA = $('#' + idA).hasClass('hidden'),
					bool_idB = $('#' + idB).hasClass('hidden');
				if(bool_idA || bool_idB) {
					if(a_x === b_x || a_y === b_y) {
						var xnum = (b_x - a_x),
							ynum = (b_y - a_y);
						var inArr_Length = Math.abs(xnum + ynum) / opt.imgSize - 1;
						if(inArr_Length) {
							var boolnum = 1;
							for(var i = 0; i < inArr_Length; i++) {
								var x = xnum === 0 ? a_x : xnum > 0 ? Number(a_x) + opt.imgSize * (i + 1) : Number(b_x) + opt.imgSize * (i + 1);
								var y = ynum === 0 ? a_y : ynum > 0 ? Number(a_y) + opt.imgSize * (i + 1) : Number(b_y) + opt.imgSize * (i + 1);
								boolnum *= $('div[id^="' + x + "_" + y + '_"]').hasClass('hidden');
							}
							return boolnum;
						}
						return true;
					}
					return false;
				} else {
					if(a_img === b_img && (a_x === b_x || a_y === b_y)) {
						var xnum = (b_x - a_x),
							ynum = (b_y - a_y);
						var inArr_Length = Math.abs(xnum + ynum) / opt.imgSize - 1;
						if(inArr_Length) {
							var boolnum = 1;
							for(var i = 0; i < inArr_Length; i++) {
								var x = xnum === 0 ? a_x : xnum > 0 ? Number(a_x) + opt.imgSize * (i + 1) : Number(b_x) + opt.imgSize * (i + 1);
								var y = ynum === 0 ? a_y : ynum > 0 ? Number(a_y) + opt.imgSize * (i + 1) : Number(b_y) + opt.imgSize * (i + 1);
								boolnum *= $('div[id^="' + x + "_" + y + '_"]').hasClass('hidden');
							}
							return boolnum;
						}
						return true;
					}
					return false;
				}
			}

			function line2(idA, idB) {
				a = idA.split('_');
				b = idB.split('_');
				var a_x = a[0],
					a_y = a[1],
					a_img = a[2],
					b_x = b[0],
					b_y = b[1],
					b_img = b[2];
				if(a_img === b_img && a_x !== b_x && a_y !== b_y) {
					var a1_x = a_x,
						a1_y = b_y,
						b1_x = b_x,
						b1_y = a_y;
					var boola1 = $('div[id^="' + a1_x + '_' + a1_y + '_"]').hasClass('hidden'),
						boolb1 = $('div[id^="' + b1_x + '_' + b1_y + '_"]').hasClass('hidden'),
						a1 = $('div[id^="' + a1_x + '_' + a1_y + '_"]').attr('id'),
						b1 = $('div[id^="' + b1_x + '_' + b1_y + '_"]').attr('id');
					var boolnum = (boola1 && line1(a1, idA) && line1(a1, idB)) || (boolb1 && line1(b1, idA) && line1(b1, idB));
					//连线
					if((boola1 && line1(a1, idA) && line1(a1, idB)) && (boolb1 && line1(b1, idA) && line1(b1, idB))) {
						line_to(a1, idA, context);
						line_to(a1, idB, context);
					} else if(boolb1 && line1(b1, idA) && line1(b1, idB)) {
						line_to(b1, idA, context);
						line_to(b1, idB, context);
					} else if(boola1 && line1(a1, idA) && line1(a1, idB)) {
						line_to(a1, idA, context);
						line_to(a1, idB, context);
					}
					return boolnum;
				}
				return false;
			}

			function line3(idA, idB) {
				a = idA.split('_');
				b = idB.split('_');
				var a_x = a[0],
					a_y = a[1],
					a_img = a[2],
					b_x = b[0],
					b_y = b[1],
					b_img = b[2];
				var md_aArr = [],
					md_bArr = [],
					centerArr = [];
				var min_x, max_x, min_y, max_y;
				if(a_img != b_img) return false;
				$('.hidden').each(function(i) {
					var mdx = $(this).attr('id').split('_')[0],
						mdy = $(this).attr('id').split('_')[1];
					if(mdx === a_x || mdy == a_y) {
						md_aArr.push($(this).attr('id'));
					}
					if(mdx === b_x || mdy == b_y) {
						md_bArr.push($(this).attr('id'));
					}
				});
				for(var keyA in md_aArr) {
					var xA = md_aArr[keyA].split('_')[0],
						yA = md_aArr[keyA].split('_')[1];
					for(var keyB in md_bArr) {
						var xB = md_bArr[keyB].split('_')[0],
							yB = md_bArr[keyB].split('_')[1];
						if(xA === xB || yA === yB) {
							centerArr.push(md_aArr[keyA] + '@' + md_bArr[keyB]);
						}
					}
				}
				for(var key in centerArr) {
					var mdArr = centerArr[key].split('@'),
						md_a = mdArr[0],
						md_b = mdArr[1];
					if(line1(idA, md_a) && line1(md_a, md_b) && line1(md_b, idB)) {
						console.log(mdArr)
						//连线
						line_to(idA, mdArr[0], context);
						line_to(mdArr[0], mdArr[1], context);
						line_to(mdArr[1], idB, context);
						md_aArr = [];
						md_bArr = [];
						centerArr = [];
						return true;
						break;
					}
				}
			}

			function randomsort() {
				return Math.random() > .5 ? -1 : 1;
			}

			function line_to(a, b, context) {
				//连线
				var a_x = Number(a.split('_')[0]) + opt.imgSize / 2 + opt.imgMargin / 2,
					a_y = Number(a.split('_')[1]) + opt.imgSize / 2 + opt.imgMargin / 2,
					b_x = Number(b.split('_')[0]) + opt.imgSize / 2 + opt.imgMargin / 2,
					b_y = Number(b.split('_')[1]) + opt.imgSize / 2 + opt.imgMargin / 2,
					canvas_width = $('#canvas').width(),
					canvas_height = $('#canvas').height();
				context.beginPath();
				context.moveTo(a_x, a_y);
				context.lineTo(b_x, b_y);
				context.lineWidth = 2;
				context.strokeStyle = "#F5270B";
				context.stroke();
			}
		}
	});
	$.fn.extend({
		add_border: function() {
			return this.css({
				border: '2px solid red',
				left: parseInt(this.css('left')) - 2,
				top: parseInt(this.css('top')) - 2
			});
		},
		delete_border: function() {
			return this.css({
				border: 0,
				left: parseInt(this.css('left')) + 2,
				top: parseInt(this.css('top')) + 2
			});
		}
	});
})(jQuery)