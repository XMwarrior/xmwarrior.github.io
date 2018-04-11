//window.onload = function() {
//	var data = ['img/sale.png', 'img/sale.png', 'img/sale.png'];
//	mySlide('SlideBox', data, 2000, 700);
//}

// * slide轮播函数，参数说明：
// * id:字符串-'id'
// * data:数组-['图片路径','图片路径'···]
// * duration:数值，单位：毫秒-5000
// * moveTime:数值，单位：毫秒，限制moveTime=200的整数倍；
(function(window) {
	var mySlide = function (id, data, duration, moveTime) {
		var SlideBox = $('#'+id)[0],//document.getElementById(id),
			ImgBox = SlideBox.getElementsByClassName('Slide_ImgBox')[0],
			IconBox = SlideBox.getElementsByClassName('Slide_IconBox')[0],
			BtnBox = SlideBox.getElementsByClassName('Slide_BtnBox')[0],
			PrevBtn = SlideBox.getElementsByClassName('Slide_Prev')[0],
			NextBtn = SlideBox.getElementsByClassName('Slide_Next')[0],
			SlideBox_width = SlideBox.offsetWidth,
			imgHtml = '',
			iconHtml = '',
			isMoving = false,
			timeOut;
		// * 初始化布局
		for(var i in data) {
			var left = i === data.length - 1 ? -100 : 100 * i;
			imgHtml += '<li style="left:' + left + '%;background:url(' + data[i] + ') no-repeat center center;background-size: cover;"></li>';
			iconHtml += '<li style="width:' + SlideBox_width / data.length + 'px;"></li>';
		}
		ImgBox.innerHTML = imgHtml;
		IconBox.innerHTML = iconHtml;
		/*初始化绑定setInterval函数及init图标、css3--transition 设置*/
		var Icon = IconBox.getElementsByTagName('li'),
			Img = ImgBox.getElementsByTagName('li');
		for(var i = Img.length - 1, len = Img.length; i >= 0; i--) {
			Img[i].style.transition = 'left ' + moveTime + 'ms';
			Img[i].style.webkitTransition = 'left ' + moveTime + 'ms';
			Img[i].style.mozTransition = 'left ' + moveTime + 'ms';
			Img[i].style.oTransition = 'left ' + moveTime + 'ms';
		}
		iconColor(true);
		var autoSlide = setInterval(slide, duration, 1);
		/*prev、next按钮点击事件*/
		PrevBtn.onclick = function() {
			clearInterval(autoSlide);
			slide(-1);
			autoSlide = setInterval(slide, duration);
		}
		NextBtn.onclick = function() {
			clearInterval(autoSlide);
			slide(1);
			autoSlide = setInterval(slide, duration);
		}
		/*Touch事件*/
		var myTouch = util.toucher(SlideBox);
		myTouch.on('swipeLeft', function(e) {
			NextBtn.click();
		}).on('swipeRight', function(e) {
			PrevBtn.click();
		});
		/*轮播核心函数
		 * direction方向，默认1。范围（1左移动，-1右移动）
		 * distance移动基数，默认1。范围（distance>=1）*/
		function slide(direction, distance) {
			if(isMoving) return false;
			isMoving = true;
			var ratio = 0,
				index,
				direction = direction ? Number(direction) : 1,
				distance = distance ? distance * 100 : 100,
				previndex;
			index = iconColor(false, direction, undefined);
			if(direction > 0) {
				nextindex = index + 1 <= Img.length - 1 ? index + 1 : 0;
			} else {
				nextindex = index - 1 >= 0 ? index - 1 : Img.length - 1;
			}
			if(index === undefined) return false;
			/*方法1——css3*/
			if(direction > 0) {
				for(var i = 0, len = Img.length; i < len; i++) {
					var changeI = index + i <= Img.length - 1 ? index + i : index + i - Img.length;
					if(distance <= 100) {
						Img[changeI].style.zIndex = changeI === index || changeI === nextindex ? 1 : -1;
					}
					Img[changeI].style.left = i * 100 - distance + '%';
				}
			} else {
				for(var i = Img.length - 1, len = Img.length; i >= 0; i--) {
					var changeI = index - i < 0 ? Img.length + (index - i) : index - i;
					if(distance <= 100) {
						Img[changeI].style.zIndex = changeI === index || changeI === nextindex ? 1 : -1;
					}
					Img[changeI].style.left = distance - i * 100 + '%';
				}
			}
			timeOut = setTimeout(function() {
				isMoving = false;
			}, moveTime)
		}
		/*图标颜色转换函数
		 *init初始图标，默认false。范围（true第一个图标,false其他）
		 * direction方向，默认1。范围（1左移动，-1右移动）
		 * distance移动基数，默认1。范围（distance>=1）*/
		function iconColor(init, direction, distance) {
			var direction = direction ? direction : 1,
				distance = distance ? distance : 1;
			if(init) {
				Icon[0].style.background = 'rgb(8, 219, 0)';
			}
			for(var i = 0, len = Img.length; i < len; i++) {
				if(Icon[i].style.background === 'rgb(8, 219, 0)') {
					var showindex = i,
						icoI;
					if(direction > 0) {
						icoI = init ? 0 : i + distance < Img.length ? i + distance : 0;
					} else {
						icoI = init ? 0 : i - distance < 0 ? Img.length - 1 : i - distance;
					}
					for(var i = 0, len = Img.length; i < len; i++) {
						Icon[i].style.background = i === icoI ? 'rgb(8, 219, 0)' : '#F0F0F0';
					}
					return showindex;
				}
			}
		}
	}
	window.mySlide = mySlide;
})(window);
