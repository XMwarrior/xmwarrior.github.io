$(function() {
	var C_ID = getParam().C_ID;
	var $btn = document.getElementById('btn'),
		$dayBody = document.getElementById('dayBody'),
		$time = document.getElementById('time'),
		$month = document.getElementById('month');
	var year = new Date().getFullYear(),
		month = new Date().getMonth(),
		day = new Date().getMonth(),
		newDate = new Date().getDate(),
		lastDate = new Date(year, month + 1, 0).getDate(), //new Date(year,month,date,hours,minutes,seconds,ms)当date为0时，默认显示上一个月的最后一天。
		firstDate = new Date(year, month, 1).getDay();
	$('a').each(function(i) {
		var href = $(this).attr('href');
		if(href.indexOf('/') >= 0 && href.indexOf('?') < 0) {
			var newHref = href + '?C_ID=' + C_ID;
			$(this).attr('href', newHref);
		}
	});
	/*$.getJSON('/Signed/Signed_List', { C_ID: C_ID }).done(function (r) {
	    //console.log(r)
	    var datas = r.datas;
	    var DateArr = [];
	    for (var i = 0;i<datas.length;i++){
	        DateArr.push(datas[i].S_Date);
	    }
	    //console.log(DateArr)*/
	var signedDate = year + '-' + (+month+1) + '-' + (+newDate-1),
	    DateArr = [signedDate];//此处设置为当天的前一天
	var liHtml = '';
	for(var i = 0; i < lastDate + firstDate; i++) {
		liHtml += i < firstDate ? '<li>&nbsp;</li>' :
			new Date(year, month, (i - firstDate + 1)).getDate() == newDate && showSigned(DateArr, year, month, (i - firstDate + 1)) ? '<li><span class="sign">' + (i - firstDate + 1) + '</span></li>' :
			showSigned(DateArr, year, month, (i - firstDate + 1)) ? '<li><span class="signed">' + (i - firstDate + 1) + '</span></li>' :
			new Date(year, month, (i - firstDate + 1)).getDate() == newDate ? '<li><span class="strong">' + (i - firstDate + 1) + '</span></li>' :
			new Date(year, month, (i - firstDate + 1)).getDay() == 0 ? '<li class="red"><span>' + (i - firstDate + 1) + '</span></li>' : '<li><span>' + (i - firstDate + 1) + '</span></li>';
	}
	$month.innerHTML = showMonth(month);
	$dayBody.innerHTML = liHtml;
	var $span = $dayBody.childNodes[newDate + firstDate - 1].childNodes[0];
	//console.log($span.className == 'sign')
	$span.className == 'sign' ? ($btn.innerHTML = '已签到') && ($btn.style.cssText += 'background-color: #F8A6AA;color: white;') : '立即签到';
	$btn.onclick = function() {
		if($btn.innerHTML != '立即签到') return false;
		/*$.getJSON('/Signed/Signed_Insert', { C_ID: C_ID }).done(function (r) {
		    console.log(r)
		    if (r.isok != 'true') return false;*/
		$time.getElementsByClassName('cover')[0].style.cssText = 'width: 100%;left: 0;top: 0;';
		$btn.innerHTML = '签到成功';
		$btn.style.cssText += 'background-color: #F8A6AA;color: white;';
		setTimeout(function() {
			$time.getElementsByClassName('cover')[0].style.cssText = 'display: none;';
			$span.className = 'sign';
		}, 1000);
		/*});*/
	}
});

function showSigned(DateArr, year, month, I) {
	var isok = [];
	for(var i = 0; i < DateArr.length; i++) {
		isok.push(DateArr[i].split('-')[0] == year && DateArr[i].split('-')[1] == month + 1 && +DateArr[i].split('-')[2] == I ? true : false);
	}
	for(var is = 0; is < isok.length; is++) {
		if(isok[is]) {
			return true;
		}
	}
	return false;
}

function showMonth(month) {
	var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return monthArr[month];
}
/*});*/
function getParam() {
	var search = window.location.search.length > 0 ? window.location.search.substring(1) : [],
		obj = {},
		items = search.length ? search.split('&') : [],
		item = null,
		name = null,
		value = null,
		i = 0,
		len = items.length;
	for(i = 0; i < len; i++) {
		item = items[i].split('=');
		name = item[0];
		value = item[1];
		if(name.length) {
			obj[name] = value;
		}
	}
	return obj;
}
//原理（所有尺寸单位弹性rem设置，所有元素随dpi变大而变大）
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