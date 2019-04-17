/*video*/
myVideo('#video');

function myVideo(id) {
	var video = $(id + ' video')[0],
		$bg = $(id),
		$videoContainer = $(id + ' .video_Box'),
		$videoParent = $(id + '.video_body'),
		$videoBox = $(id + ' video'),
		$playBtn = $(id + ' .play div'),
		$screenBtn = $(id + ' .screen_play'),
		$screenReplayBtn = $(id + ' .screen_replay'),
		$startTime = $(id + ' .start-time'),
		$fullTime = $(id + ' .stop-time'),
		$progressBar = $(id + ' .progres-bar'),
		$timebar = $(id + ' .timebar'),
		$bufferBar = $(id + ' .bufferBar'),
		$volumeBtn = $(id + ' .Volume span'),
		$volumeProgressBar = $(id + ' .volumebar'),
		$volumechangeBar = $(id + ' .volumebar .volume'),
		$videoControlBar = $(id + ' .video_foot'),
		$fullgreenBtn = $(id + ' .fullscreen span'),
		$buffer = $(id + ' .screen_buffer');
	var normalHeight = $videoContainer.height(),
		normalWidth = $videoContainer.width(),
		percentage, durationTime, UpdateBar, endTime, isMove, startTime = 0,
		isok = true,
		Drag = false,
		trag = false,
		obj = {
			x: 0,
			y: 0
		};
	var UpdateBar = function(x) {
			var Position = x - $progressBar.offset().left, //点击位置
				newPosition = Position / $progressBar.width();
			video.currentTime = durationTime * newPosition;
		},
		playbutton = function(e) {
			e.stopPropagation();
			if($screenBtn.is(':visible')) {
				$playBtn.attr('class', 'icon-pause');
				$screenBtn.fadeOut();
				video.play();
			} else {
				$playBtn.attr('class', 'icon-play');
				$screenBtn.fadeIn();
				video.pause();
			}
		},
		requestFullScreen = function(element) {
			// 判断各种浏览器，找到正确的方法
			var requestMethod = element.requestFullScreen || //W3C
				element.webkitRequestFullScreen || //Chrome等
				element.mozRequestFullScreen || //FireFox
				element.msRequestFullScreen; //IE11
			if(requestMethod) {
				requestMethod.call(element);
			} else if(typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
				var wscript = new ActiveXObject("WScript.Shell");
				if(wscript !== null) {
					wscript.SendKeys("{F11}");
				}
			}
		},
		//退出全屏 判断浏览器种类
		exitFull = function() {
			// 判断各种浏览器，找到正确的方法
			var exitMethod = document.exitFullscreen || //W3C
				document.mozCancelFullScreen || //Chrome等
				document.webkitExitFullscreen || //FireFox
				document.webkitExitFullscreen; //IE11
			if(exitMethod) {
				exitMethod.call(document);
			} else if(typeof window.ActiveXObject !== "undefined") { //for Internet Explorer
				var wscript = new ActiveXObject("WScript.Shell");
				if(wscript !== null) {
					wscript.SendKeys("{F11}");
				}
			}
		},
		full = function() {
			$bg.addClass('fullv');
			$videoContainer.css({
				width: '100%',
				height: '100%'
			});
			$videoBox.height('100%');
			Top = $videoBox.offset().top;
			Height = $videoBox.height();
			$('html,body').addClass('fullgreen');
			requestFullScreen($bg[0]);
		},
		exit = function() {
			$bg.removeClass('fullv');
			$videoContainer.css({
				width: normalWidth,
				height: normalHeight
			});
			$videoBox.height(normalHeight);
			Top = $videoBox.offset().top;
			Height = $videoBox.height();
			$('html,body').removeClass('fullgreen').scrollTop($videoContainer.offset().top);
			exitFull($bg[0]);
		},
		volumeBtnChange = function(variable, $element) {
			variable = variable * 100;
			if(variable > 0 & variable <= 25) {
				$element.attr('class', 'icon-volume-mute')
			} else if(variable > 25 & variable <= 50) {
				$element.attr('class', 'icon-volume-low')
			} else if(variable > 50 & variable <= 75) {
				$element.attr('class', 'icon-volume-medium')
			} else if(variable > 75 & variable <= 100) {
				$element.attr('class', 'icon-volume-high')
			} else {
				$element.attr('class', 'icon-volume-high')
			}
		},
		fullscreenchange = function() {
			var isFull = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
			if(!isFull) {
				exit();
				$fullgreenBtn.attr('class', 'icon-enlarge');
			}
		};
	//video@loadedmetadata
	$videoBox.on('loadedmetadata', function() {
		
		durationTime = video.duration;
		var t = video.duration.toFixed(0),
			h = Math.floor(t / 3600),
			m = Math.floor(t % 3600 / 60),
			s = Math.floor(t % 3600 % 60),
			mm = m < 10 ? '0' + m : m,
			ss = s < 10 ? '0' + s : s;
		$fullTime.text('/ ' + h + ':' + mm + ':' + ss);
		var startBuffer = function() {
			var currentBuffer = video.buffered.end(0);
			percentage = 100 * currentBuffer / durationTime;
			$bufferBar.css('width', percentage + '%');
			if(currentBuffer < durationTime) {
				setTimeout(startBuffer, 500);
			}
		};
		setInterval(startBuffer, 500);
		video.volume = 1;
	});
	//video@waiting&playing
	$videoBox.on('waiting', function() {
		$buffer.show();
	}).on('playing', function() {
		$buffer.hide();
	});
	//video@drag
	$videoBox.on('mousemove', function(e) {
		if(e.pageX === obj.x && e.pageY === obj.y) return false;
		var Top = $videoBox.offset().top,
			Height = $videoBox.height();
		obj.x = e.pageX;
		obj.y = e.pageY;
		$videoControlBar.stop(true, true).fadeIn();
		clearTimeout(isMove);
		isMove = setTimeout(function() {
			if(Height - (e.pageY - Top) > 60) {
				$videoControlBar.stop(true, true).fadeOut();
			}
		}, 2000);
	});
	//playButton@click
	$playBtn.on('click', playbutton);
	$screenBtn.on('click', playbutton);
	$videoBox.on('click', playbutton);
	//video@timeupdate
	$videoBox.on('timeupdate', function() {
		var t = video.currentTime.toFixed(0),
			h = Math.floor(t / 3600),
			m = Math.floor(t % 3600 / 60),
			s = Math.floor(t % 3600 % 60),
			mm = m < 10 ? '0' + m : m,
			ss = s < 10 ? '0' + s : s;
		$startTime.text(h + ':' + mm + ':' + ss);
		var currentTime1 = video.currentTime;
		var ratio = 100 * currentTime1 / durationTime;
		$timebar.css('width', ratio + '%');
		if(currentTime1 == durationTime) {
			$screenReplayBtn.removeClass('fullpa').show();
			$playBtn.attr('class', 'icon-play')
		} else {
			$screenReplayBtn.hide();
		}
	});
	//progressBar@click
	$progressBar.on('mousedown', function(e) {
		if(video.duration) {
			Drag = true;
			UpdateBar(e.pageX);
		}
	});
	$(document).on('mouseup', function(e) {
		if(Drag) {
			Drag = false;
			UpdateBar(e.pageX);
		}
	}).on('mousemove', function(e) {
		if(Drag) {
			UpdateBar(e.pageX);
		}
	});
	//volumeButton@click
	$volumeBtn.click(function() {
		video.muted = !video.muted;
		if(video.muted) {
			$(this).attr('class', 'icon-volume-mute');
			$volumechangeBar.css('width', '0%');
		} else {
			var ratio = video.volume;
			$volumechangeBar.css('width', ratio * 100 + '%');
			volumeBtnChange(ratio, $volumeBtn);
		}
		return false;
	});
	//volumeBar@click
	$volumechangeBar.css('width', '100%');
	$volumeProgressBar.on('mousedown', function(e) {
		var newPosition = e.pageX - $volumeProgressBar.offset().left,
			ratio = newPosition / $volumeProgressBar.width();
		trag = true;
		$volumechangeBar.stop().animate({
			'width': newPosition
		}, 200);
		video.volume = ratio;
		volumeBtnChange(ratio, $volumeBtn);
	});
	$volumeProgressBar.on('mouseup', function(e) {
		if(trag) {
			var newPosition = e.pageX - $volumeProgressBar.offset().left,
				ratio = newPosition / $volumeProgressBar.width();
			$volumechangeBar.stop().animate({
				'width': newPosition
			}, 200);
			video.volume = ratio;
			volumeBtnChange(ratio, $volumeBtn);
		}
	});
	//replayButton@click
	$screenReplayBtn.click(function() {
		$timebar.css('width', '0%');
		$(this).hide();
		video.currentTime = 0;
		$playBtn.attr('class', 'icon-pause');
		video.play();
	});
	//fullgreenButton@click&ESC@keydown
	$fullgreenBtn.on('click', function() {
		if($(this).attr('class') == 'icon-enlarge') {
			$(this).attr('class', 'icon-shrink');
			full();
			return false;
		} else {
			exit();
			$(this).attr('class', 'icon-enlarge');

			return false;
		}
	});
	/*监听退出全屏事件*/
	document.addEventListener("fullscreenchange", fullscreenchange);
	document.addEventListener("mozfullscreenchange", fullscreenchange);
	document.addEventListener("webkitfullscreenchange", fullscreenchange);
	document.addEventListener("msfullscreenchange", fullscreenchange);
}