window.onload = function() {
	var data = [
		[{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		}],
		[{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		},{
			id:'0',
			img:'#',
			title:'123123'
		}]
	];
	mySlide('SlideBox', data, 5000, 300);
}

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
		times = 1,
		t = 100,
		TimeOut,
		mainSlide,
		isok = true,
		movingTime = get_Step(moveTime);
	//初始化布局
	for(var i in data) {
		switch(i) {
			case '0':
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[data.length - 1] + ');">';
				imgHtml += '<dl class="clearfix">';
				for(var key in data[data.length - 1]) {
					imgHtml += '<dd id='+data[data.length - 1][key].id+'>';
				    imgHtml += '<div style="background-image:url(' + data[data.length - 1][key].img + ');"></div>';
				    imgHtml += '<p>' + data[data.length - 1][key].title + '</p>';
				    imgHtml += '</dd>';
				}
				imgHtml += '</dl>';
				imgHtml += '</li>';
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[i] + ');">';
				imgHtml += '<dl class="clearfix">';
				for(var key in data[i]) {
					imgHtml += '<dd id='+data[i][key].id+'>';
				    imgHtml += '<div style="background-image:url(' + data[i][key].img + ');"></div>';
				    imgHtml += '<p>' + data[i][key].title + '</p>';
				    imgHtml += '</dd>';
				}
				imgHtml += '</dl>';
				imgHtml += '</li>';
				break;
			case(data.length - 1).toString():
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[i] + ');">';
				imgHtml += '<dl class="clearfix">';
				for(var key in data[i]) {
					imgHtml += '<dd id='+data[i][key].id+'>';
				    imgHtml += '<div style="background-image:url(' + data[i][key].img + ');"></div>';
				    imgHtml += '<p>' + data[i][key].title + '</p>';
				    imgHtml += '</dd>';
				}
				imgHtml += '</dl>';
				imgHtml += '</li>';
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[0] + ');">';
				imgHtml += '<dl class="clearfix">';
				for(var key in data[0]) {
					imgHtml += '<dd id='+data[0][key].id+'>';
				    imgHtml += '<div style="background-image:url(' + data[0][key].img + ');"></div>';
				    imgHtml += '<p>' + data[0][key].title + '</p>';
				    imgHtml += '</dd>';
				}
				imgHtml += '</dl>';
				imgHtml += '</li>';
				break;
			default:
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[i] + ');">';
				imgHtml += '<dl class="clearfix">';
				for(var key in data[i]) {
					imgHtml += '<dd id='+data[i][key].id+'>';
				    imgHtml += '<div style="background-image:url(' + data[i][key].img + ');"></div>';
				    imgHtml += '<p>' + data[i][key].title + '</p>';
				    imgHtml += '</dd>';
				}
				imgHtml += '</dl>';
				imgHtml += '</li>';
				break;
		}
		iconHtml += '<li></li>';
	}
	ImgBox.style.width = SlideBox_width * (data.length + 2) + 'px';
	ImgBox.innerHTML = imgHtml;
	IconBox.innerHTML = iconHtml;
	IconBox.style.marginLeft = -IconBox.offsetWidth / 2 + 'px';
	ImgBox.style.left = -SlideBox_width + 'px';
	//初始化绑定init图标
	var Icon = IconBox.getElementsByTagName('li'),
		Img = ImgBox.getElementsByTagName('li');
	window.onresize = function() {
		SlideBox_width = SlideBox.offsetWidth;
		for(var i = 0, len = data.length + 2; i < len; i++) {
			Img[i].style.width = SlideBox_width + 'px';
		}
		ImgBox.style.width = SlideBox_width * (data.length + 2) + 'px';
		IconBox.style.marginLeft = -IconBox.clientWidth / 2 + 'px';
	}
	Icon[0].style.background = '#06F3ED';
	//prev、next按钮点击事件
	PrevBtn.onclick = function() {
		slide(-1);
	}
	NextBtn.onclick = function() {
		slide(1);
	}
	//Touch事件
	var myTouch = util.toucher(SlideBox);
	myTouch.on('swipeLeft', function(e) {
		NextBtn.onclick();
	}).on('swipeRight', function(e) {
		PrevBtn.onclick();
	});
	/*轮播核心函数
	 * direction方向，默认1。范围（1左移动，-1右移动）*/
	function slide(direction) {
		direction = direction ? direction : 1;
		if(!isok) return false;
		isok = false;
		if(direction > 0 && times < data.length + 1) { //左移
			times++;
			times < data.length + 1 ? iconColor(times - 1) : iconColor(0);
			mainSlide = setInterval(function() {
				t += movingTime;
				ImgBox.style.left = SlideBox_width * -(t / 100) + 'px';
				if(t === 100 * times) {
					if(times === data.length + 1) {
						times = 1;
						t = 100;
						ImgBox.style.left = -SlideBox_width + 'px';
					}
					isok = true;
					clearInterval(mainSlide);
				}
			}, 16.7);
		} else { //右移
			if(times <= 0) return false;
			times--;
			times > 0 ? iconColor(times - 1) : iconColor(data.length - 1);
			mainSlide = setInterval(function() {
				t -= movingTime;
				ImgBox.style.left = SlideBox_width * -(t / 100) + 'px';
				if(t === 100 * times) {
					if(times === 0) {
						times = data.length;
						t = 100 * times;
						ImgBox.style.left = -SlideBox_width * times + 'px';
					}
					isok = true;
					clearInterval(mainSlide);
				}
			}, 16.7);
		}
	}
	//图标颜色转换函数
	function iconColor(showIndex) {
		for(var i = 0, len = Icon.length; i < len; i++) {
			Icon[i].style.background = i === showIndex ? '#06F3ED' : '#D0D1D7';
		}
	}
	//兼容属性设置
	function Compatible(target, prop, animation) {
		var humpProp = prop.slice(0, 1).toUpperCase() + prop.substr(1);
		target.style[prop] = animation;
		target.style['webkit' + humpProp] = animation;
		target.style['moz' + humpProp] = animation;
		target.style['ms' + humpProp] = animation;
		target.style['o' + humpProp] = animation;
	}
	//获取步长
	function get_Step(moveTime) {
		var trueStep = Number(moveTime) / 16.7,
			middleStep = trueStep <= 100 ? parseInt(100 / trueStep) : parseInt(100 / trueStep * 100) / 100;
		return 100 / parseInt(100 / middleStep);
	}
	//获取步长
	function get_StepTimes(moveTime) {
		if(moveTime <= 100) {
			if(100 % moveTime === 0) {
				//console.log(100/moveTime)
				var step = 100 / moveTime;
				return step;
			} else {
				100 % moveTime - Math.floor(100 % moveTime) >= 0.5 ? arguments.callee(Math.ceil(moveTime) + 1) : arguments.callee(Math.floor(moveTime) - 1);
			}
		} else {
			if(10000 % moveTime === 0) {
				return 100 / moveTime;
			} else {
				10000 % moveTime / 100 >= 0.5 ? arguments.callee(Math.ceil(moveTime) + 1) : arguments.callee(Math.floor(moveTime) - 1);
			}
		}
	}
}