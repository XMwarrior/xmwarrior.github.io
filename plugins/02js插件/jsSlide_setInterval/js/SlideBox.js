window.onload = function() {
	var data = ['../../../medias/featureimages/0.jpg','../../../medias/featureimages/1.jpg','../../../medias/featureimages/2.jpg'];
	mySlide('SlideBox', data, 2500, 400);
}
/*slide轮播函数，参数说明：
 * id:字符串-'id'
 * data:数组-['图片路径','图片路径'···]
 * duration:数值，单位：毫秒-5000
 * moveTime:数值，单位：毫秒，限制moveTime=200的整数倍；
 */
function mySlide(id, data, duration, moveTime) {
	var SlideBox = document.getElementById(id),
		ImgBox = SlideBox.getElementsByClassName('Slide_ImgBox')[0],
		IconBox = SlideBox.getElementsByClassName('Slide_IconBox')[0],
		BtnBox = SlideBox.getElementsByClassName('Slide_BtnBox')[0],
		PrevBtn = SlideBox.getElementsByClassName('Slide_Prev')[0],
		NextBtn = SlideBox.getElementsByClassName('Slide_Next')[0],
		SlideBox_width = SlideBox.offsetWidth,
		imgHtml = '',
		iconHtml = '',
		isMoving = false;
	/*初始化布局*/
	for(var i in data) {
		var left = i === data.length - 1 ? -100 : 100 * i;
		imgHtml += '<li style="left:' + left + '%;background:url(' + data[i] + ') no-repeat center center;background-size: cover;"></li>';
		iconHtml += '<li></li>';
	}
	ImgBox.innerHTML = imgHtml;
	IconBox.innerHTML = iconHtml;
	IconBox.style.marginLeft = -IconBox.clientWidth / 2 + 'px';
	/*初始化绑定setInterval函数及init图标*/
	var Icon = IconBox.getElementsByTagName('li'),
		Img = ImgBox.getElementsByTagName('li');
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
	/*init图标点击事件*/
	for(var i = 0, len = Icon.length; i < len; i++) {
		! function(i) {
			Icon[i].addEventListener('click', function() {
				if(isMoving) return false;
				var selfI = i,
					showI;
				for(var i1 = 0, len = Icon.length; i1 < len; i1++) {
					if(Icon[i1].style.background === 'blue') {
						showI = i1;
					}
				}
				if(selfI === showI) return false;
				var subtract = Math.abs(selfI - showI),
					direction = selfI > showI ? 1 : -1;
				clearInterval(autoSlide);
				slide(direction, subtract, selfI);
				autoSlide = setInterval(slide, duration);
			});
		}(i);
	}
	/*轮播核心函数
	 * direction方向，默认1。范围（1左移动，-1右移动）
	 * distance移动基数，默认1。范围（distance>=1）*/
	function slide(direction, distance, onclickIndex) {
		if(isMoving) return false;
		var ratio = 0,
			index,
			direction = direction ? Number(direction) : 1,
			distance = distance ? distance * 100 : 100;
		index = iconColor(false, direction, undefined, onclickIndex);
		if(index === undefined) return false;
		var moving = setInterval(function() {
			isMoving = true;
			if(distance * 20 % moveTime === 0 || moveTime % distance * 20 === 0) {
				if(100 % (distance * 20 / moveTime) === 0) {
					ratio += distance * 20 / moveTime;
				} else {
					ratio += Math.ceil(100 / parseInt(100 / (distance * 20 / moveTime)));
				}
			}
			if(direction > 0) {
				for(var i = 0, len = Img.length; i < len; i++) {
					var changeI = index + i <= Img.length - 1 ? index + i : index + i - Img.length;
					Img[changeI].style.left = i * 100 - ratio + '%';
				}
			} else {
				for(var i = Img.length - 1, len = Img.length; i >= 0; i--) {
					var changeI = index - i < 0 ? Img.length - i : index - i;
					Img[changeI].style.left = ratio - i * 100 + '%';
				}
			}
			if(ratio >= distance) {
				ratio = 0;
				for(var i = 0, len = Img.length; i < len; i++) {
					if(direction > 0) {
						if(Number(Img[i].style.left) <= -1000) {
							Img[i].style.left = (Img.length - 1) * 100 + '%';
						}
					} else {
						if(Number(Img[i].style.left) >= 1000) {
							Img[i].style.left = -(Img.length - 1) * 100 + '%';
						}
					}
				}
				clearInterval(moving);
				isMoving = false;
			}
		}, 20);
	}
	/*图标颜色转换函数
	 *init初始图标，默认false。范围（true第一个图标,false其他）
	 * direction方向，默认1。范围（1左移动，-1右移动）
	 * distance移动基数，默认1。范围（distance>=1）*/
	function iconColor(init, direction, distance, onclickIndex) {
		var direction = direction ? direction : 1,
			distance = distance ? distance : 1;
		if(init) {
			Icon[0].style.background = 'blue';
		}
		if(onclickIndex!==undefined) {
			var prevIndex;
			for(var i = 0, len = Img.length; i < len; i++) {
				if (Icon[i].style.background==='blue') {
					prevIndex=i;
				}
				Icon[i].style.background = i === onclickIndex ? 'blue' : 'red';
			}
			return prevIndex;
		}else{
			for(var i = 0, len = Img.length; i < len; i++) {
				if(Icon[i].style.background === 'blue') {
					var showindex = i,
						icoI;
					if(direction > 0) {
						icoI = init ? 0 : i + distance < Img.length ? i + distance : 0;
					} else {
						icoI = init ? 0 : i - distance < 0 ? Img.length - 1 : i - distance;
					}
					for(var i = 0, len = Img.length; i < len; i++) {
						Icon[i].style.background = i === icoI ? 'blue' : 'red';
					}
					return showindex;
				}
			}
		}
	}
}