(function(window, document, scriptName, wigetname, url,jsonurl, scriptNode, originalNode) {
	$.extend({
		smartDefaultOption: {
			"flavor": "bubble", //样式选择：bubble浮动气泡，slim固定极简
			"positionMode": "static",//浮动气泡所需属性：默认fixed
			"location": [
				"北京市",
				"54511",
				"110101",
				"101010100"
			],
			"geolocation": "disabled", //城市定位：enabled启用，disabled不启用。 默认免费版不能开启定位
			"theme": "chameleon", //浮层背景：chameleon随天气变化，white白色，black黑色
			"container": "wp-container", //dom元素id开头
			"color": "#FFFFFF", //字体颜色
			"background": "#C6C6C6", //背景色：不需要设置时删掉此属性
			"bubble": "disabled", //slim模式下：启用浮层显示天气详情和预报：enabled启用，disabled不启用。
			"uuid": "b93a5df5-4925-42a9-a202-5564d7495237", //下面这两项时4Dsmart网站的账号的id、hash
			"hash": "F494D79972E3122A99CA36C4BC8A9713"
		},
		//封装同步ajax
		getAsyncData: function(url, data, datatype) {
			var res = '';
			$.ajax({
				url: url,
				data: data,
				type: "get",
				dataType: datatype || "json",
				async: false, //同步请求
				timeout: 30000,
				error: function(e) {
					res = e.responseText;
				},
				success: function(r) {
					res = r;
				}
			});
			return res;
		},
		/*调用百度API获取“城市中心经纬度” 
		 * return lat,lng
		 */
		getLocation: function(fn) {
			$.ajax({
				url: "http://api.map.baidu.com/location/ip?ak=OyLlhcqIbwA8nY5WgZCIMezstiin3UGM&coor=bd09ll",
				type: "POST",
				dataType: "jsonp",
				success: function(data) {
					//console.log(data);
					var cityLocation = data.content.point.y + ',' + data.content.point.x;
					fn && fn(cityLocation);
				}
			});
		},
		/*调用百度API根据经纬度反查“城市名、区号”，根据城市名查询“城市气象台号、天气城市编号”
		 * return "城市名、城市气象台号、区号、天气城市编号"
		 */
		getDirectName: function(cityLocation, fn) {
			$.ajax({
				url: 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=' + cityLocation + '&output=json&pois=1&latest_admin=1&ak=OyLlhcqIbwA8nY5WgZCIMezstiin3UGM',
				type: "get",
				async: true,
				dataType: "jsonp",
				success: function(res) {
					//console.log(res);
					var cityName = res.result.addressComponent.city.replace('市', '');
					var cityObservatoryCode = $.getAsyncData(jsonurl)['observatory'][cityName];
					var directAreaCode = res.result.addressComponent.adcode;
					var cityWeatherCode = $.getAsyncData(jsonurl)['weathercity'][cityName];
					//console.log('城市名：'+cityName+'\n','城市气象台号：'+cityObservatoryCode+'\n','区号：'+directAreaCode+'\n','天气城市编号：'+cityWeatherCode);
					fn && fn(cityName, cityObservatoryCode, directAreaCode, cityWeatherCode);
				}
			});
		},
		//根据城市名、城市气象台号、区号、天气城市编号，调用smart-weather查询天气
		getWeather: function(cityName, cityObservatoryCode, directAreaCode, cityWeatherCode) {
			//smart-weather天气具体参数配置
			var data = $.smartDefaultOption;
			data.location = [
				cityName,
				cityObservatoryCode,
				directAreaCode,
				cityWeatherCode
			];
			wp("init", data);
			wp("show");
		},
		//封装完的基于4Dsmart的免费获取天气方法
		getFreeWeather: function(data) {
			if(data&&!$.isEmptyObject(data)){
				for (var key in data) {
					$.smartDefaultOption[key]=data[key];
				}
			};
			$.getLocation(function(cityLocation) {
				$.getDirectName(cityLocation, function(cityName, cityObservatoryCode, directAreaCode, cityWeatherCode) {
					$.getWeather(cityName, cityObservatoryCode, directAreaCode, cityWeatherCode);
				});
			});
		}
	});
	//天气插件依赖
	initScript = function() {
		scriptNode = document.createElement("script");
		originalNode = document.getElementsByTagName("script")[0];
		scriptNode.src = url;
		scriptNode.async = 1;
		originalNode.parentNode.insertBefore(scriptNode, originalNode)
	};
	window["wpObjectName"] = "wp";
	window["wp"] || (window["wp"] = function() {
		(window["wp"].arg = window["wp"].arg || []).push(arguments)
	});
	window["wp"].l = +new Date();
	if(window.attachEvent) {
		window.attachEvent("onload", initScript)
	} else {
		window.addEventListener("load", initScript, false)
	}
}(window, document, "script", "wp", "js/smart-weather.js","js/weather-city.json"));