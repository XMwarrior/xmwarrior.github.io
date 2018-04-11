"use strict"
function Audio(id) {
	var Fun = function() {
		var box = document.getElementById(id.slice(1)),
			myAudio = box.querySelector('audio'),
			playBtn = box.querySelector('.myAudio_play>div'),
			startTime = box.querySelector('.myAudio_timebar_startTime'),
			endTime = box.querySelector('.myAudio_timebar_endTime'),
			progressbar = box.querySelector('.myAudio_timebar_progressbar'),
			currentTime = box.querySelector('.current_time'),
			bufferedTime = box.querySelector('.buffered_time'),
			volumebar = box.querySelector('.myAudio_volumebar'),
			volumeProgressbar = box.querySelector('.myAudio_volumebar_control_progressbar'),
			volume = box.querySelector('.volume');
		var duration_time, get_CurrentTime, get_bufferedTime, buffered_time, time_update, volume_ratio, progress_ratio, newTime = 0;
		myAudio.addEventListener('loadedmetadata', function() {
			//初始化样式（durationTime、bufferedTime）
			duration_time = myAudio.duration;
			get_bufferedTime = setInterval(function() {
				buffered_time = myAudio.buffered.end(myAudio.buffered.length - 1);
				bufferedTime.style.width = buffered_time / duration_time * 100 + '%';
				//console.log(buffered_time)
				if(buffered_time.toFixed(0) === duration_time.toFixed(0)) {
					clearInterval(get_bufferedTime);
				}
			}, 16.7);
			var t = myAudio.duration.toFixed(0),
				h = Math.floor(t / 3600),
				m = Math.floor(t % 3600 / 60),
				s = Math.floor(t % 3600 % 60),
				hh = h < 10 ? '0' + h : h,
				mm = m < 10 ? '0' + m : m,
				ss = s < 10 ? '0' + s : s;
			endTime.innerHTML = hh + ':' + mm + ':' + ss;
			//playBtn
			playBtn.addEventListener('click', function() {
				if(this.className === 'icon-play') {
					myAudio.play();
					get_CurrentTime = setInterval(function() {
						//console.log(myAudio.currentTime)
						//myAudio.currentTime=newTime;
						currentTime.style.width = myAudio.currentTime / duration_time * 100 + '%';
						if(myAudio.currentTime === duration_time) {
							clearInterval(get_CurrentTime);
							clearInterval(time_update);
						}
					}, 16.7);
					time_update = setInterval(function() {
						var t = myAudio.currentTime.toFixed(0),
							h = Math.floor(t / 3600),
							m = Math.floor(t % 3600 / 60),
							s = Math.floor(t % 3600 % 60),
							hh = h < 10 ? '0' + h : h,
							mm = m < 10 ? '0' + m : m,
							ss = s < 10 ? '0' + s : s;
						startTime.innerHTML = hh + ':' + mm + ':' + ss;
						//console.log(myAudio.currentTime);
					}, 1000);
					this.className = 'icon-pause';
				} else {
					myAudio.pause();
					clearInterval(get_CurrentTime);
					clearInterval(time_update);
					this.className = 'icon-play';
				}
			});
			playBtn.addEventListener('touchstart', function() {
				playBtn.style.borderColor = 'black';
				playBtn.style.backgroundColor = 'black';
				playBtn.addEventListener('touchend', function() {
					playBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
					playBtn.style.backgroundColor = '#555555';
				});
			});
			//volume始化,volume滚轮事件
			volume.style.height = '80%';
			myAudio.volume = 1;
			volumebar.addEventListener('click', function(e) {
				if (e.target.className==='myAudio_volumebar_control') {
					return false;
				}
				if(volumeProgressbar.parentNode.clientHeight) {
					volumeProgressbar.parentNode.style.height = '0px';
					volumeProgressbar.parentNode.style.top = '0px';
					volumeProgressbar.style.height = '0px';
					volumebar.style.backgroundColor = '#555555';
					volumebar.style.borderColor='rgba(255, 255, 255, 0.2)';
				} else {
					volumeProgressbar.parentNode.style.height = '100px';
					volumeProgressbar.parentNode.style.top = '-102px';
					volumeProgressbar.style.height = '90px';
					volumebar.style.backgroundColor = 'black';
					volumebar.style.borderColor='black';
				}
			});
			volumeProgressbar.addEventListener('click', function(e) {
				e.stopPropagation();
				volume_ratio = Math.round((volumeProgressbar.clientHeight - (e.pageY - volumeProgressbar.offsetTop)) / volumeProgressbar.clientHeight * 100) / 100;
				//console.log(volume_ratio)
				volume.style.height = volume_ratio * 100 + '%';
				myAudio.volume = volume_ratio;
			});
			volumeProgressbar.addEventListener('touchstart', function(e) {
				var startY = e.touches[0].pageY,
					ratio;
					
				volume.style.height = (volumeProgressbar.clientHeight - startY) / volumeProgressbar.clientHeight * 100 + '%';
				volumeProgressbar.addEventListener('touchmove', function(ev) {
					var movingY = ev.touches[0].pageY;
					ratio = (volumeProgressbar.clientHeight - movingY) / volumeProgressbar.clientHeight;
					volume.style.height = ratio * 100 + '%';
					myAudio.volume = ratio;
				});
			});
			if(document.addEventListener) { //for:W3C 
				document.addEventListener('DOMMouseScroll', scrollFunc, false);
			}
			window.onmousewheel = document.onmousewheel = scrollFunc; //for:IE/Opera/Chrome 
			//progressBar
			progressbar.addEventListener('click', function(e) {
				progress_ratio = (e.pageX - progressbar.offsetLeft - playBtn.offsetWidth - 1) / progressbar.clientWidth;
				newTime = progress_ratio * duration_time;
				myAudio.currentTime = newTime;
				currentTime.style.width = progress_ratio * progressbar.clientWidth + 'px';
				updateTime(progress_ratio * duration_time);
			});
			progressbar.addEventListener('touchstart', function(e) {
				var startX = e.touches[0].pageX,
					ratio = (startX - progressbar.offsetLeft - playBtn.offsetWidth - 1) / progressbar.clientWidth,
					newTime = ratio * duration_time;
				currentTime.style.width = ratio * progressbar.clientWidth + 'px';
				myAudio.currentTime = newTime;
				progressbar.addEventListener('touchmove', function(ev) {
					var movingX = ev.touches[0].pageX,
						ratio = (movingX - progressbar.offsetLeft - playBtn.offsetWidth - 1) / progressbar.clientWidth,
						newTime = ratio * duration_time;
					currentTime.style.width = ratio * progressbar.clientWidth + 'px';
					myAudio.currentTime = newTime;
				});
			});
		});

		function scrollFunc(e) {
			e = e || window.event;
			if(e.wheelDelta) { //IE/Opera/Chrome 
				var ratio = parseFloat(volume.style.height);
				ratio = e.wheelDelta > 0 ? ratio + 5 : ratio - 5;
				volume.style.height = ratio + '%';
				myAudio.volume = ratio / 100 > 1 ? 1 : ratio / 100 >= 0 ? ratio / 100 : 0;
			} else if(e.detail) { //Firefox 
				var ratio = parseFloat(volume.style.height);
				ratio = e.detail > 0 ? ratio - 5 : ratio + 5;
				volume.style.height = ratio + '%';
				myAudio.volume = ratio / 100 > 1 ? 1 : ratio / 100 >= 0 ? ratio / 100 : 0;
			}
		}

		function updateTime(time) {
			var t = time,
				h = Math.floor(t / 3600),
				m = Math.floor(t % 3600 / 60),
				s = Math.floor(t % 3600 % 60),
				hh = h < 10 ? '0' + h : h,
				mm = m < 10 ? '0' + m : m,
				ss = s < 10 ? '0' + s : s;
			startTime.innerHTML = hh + ':' + mm + ':' + ss;
		}
	};
	return new Fun();
};