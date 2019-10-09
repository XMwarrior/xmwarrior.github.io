var resData;
var $menuList = $('#menuList');
var selectedIndex = 0;
//获取data
buildLeftMenu();
var htmlEditor, cssEditor, jsEditor;
var data = resData[0];
//init monaco
require.config({
	paths: {
		'vs': 'monaco-editor/min/vs',
		'jquery': 'js/jquery.1.8.3.min'
	},
	'vs/nls': {
		availableLanguages: {
			'*': 'zh-cn'
		}
	}
});
createEditor(data);

function createEditor(data) {
	require(['vs/editor/editor.main'], function() {
		htmlEditor = monaco.editor.create($('#htmlContainer')[0], {
			value: data.html || '',
			language: 'html',
			wordWrap: "on",
			wrappingColumn: 0,
			wrappingIndent: "indent",
			theme: "vs-dark",
			lineNumbers: "off",
			automaticLayout: true
		});
		cssEditor = monaco.editor.create($('#cssContainer')[0], {
			value: data.css || '',
			language: 'css',
			wordWrap: "on",
			wrappingColumn: 0,
			wrappingIndent: "indent",
			theme: "vs-dark",
			lineNumbers: "off",
			automaticLayout: true
		});
		jsEditor = monaco.editor.create($('#jsContainer')[0], {
			value: decode(data.js) || '',
			language: 'javascript',
			wordWrap: "on",
			wrappingColumn: 0,
			wrappingIndent: "indent",
			theme: "vs-dark",
			lineNumbers: "off",
			automaticLayout: true
		});
		setTimeout(function() {
			htmlEditor.updateOptions({
				lineNumbers: "on"
			});
			cssEditor.updateOptions({
				lineNumbers: "on"
			});
			jsEditor.updateOptions({
				lineNumbers: "on"
			});
		}, 2000);

	});
}
//工具栏edit编辑按钮
$('.m-toolbar .icon-edit').on('click', function() {
	$(this).toggleClass('active');
	$menuList.toggleClass('active');
	if($(this).is('.active')) {
		$('.menu-name').editable();
	} else {
		$('.menu-name').editable('destroy');
	}
});
//工具栏add添加按钮
$('.m-toolbar .icon-jia').on('click', function() {
	var menuHtml = '';
	var length = resData.length;
	menuHtml += '<li id="' + length + '" class="showing">';
	menuHtml += '	<a href="#" class="menu-name" data-type="text" data-placement="bottom" data-title="编辑名称"></a>';
	menuHtml += '	<span class="iconfont icon-del"></span>';
	menuHtml += '</li>';
	resData.push({
		"pageId": resData[0].pageId,
		"title": "",
		"id": length,
		"js": "",
		"css": "",
		"html": ""
	});
	$menuList.append(menuHtml);
	addItem({
		"pageId": resData[0].pageId,
		"title": "",
		"id": length,
		"js": "",
		"css": "",
		"html": ""
	});
	$('.m-toolbar .icon-edit').removeClass('active').trigger('click');
	setTimeout(function() {
		$menuList.addClass('active').find('li').eq(length).removeClass('showing').addClass('selected').siblings().removeClass('selected');
		setTimeout(function() {
			$menuList.find('li').eq(length).find('.menu-name').editable('show');
		}, 400);
	}, 200);
});
//menu删除按钮
$menuList.on('click', '.icon-del', function() {
	var $parentLi = $(this).parents('li');
	var itemId = $parentLi.attr('id');
	var confirmDelete = confirm('确定删除“' + $(this).prev().text() + '”及其下所有布局、内容？');
	if(confirmDelete) {
		setTimeout(function() {
			$parentLi.addClass('hiding');
			setTimeout(function() {
				$parentLi.addClass('scaling');
				setTimeout(function() {
					$parentLi.remove();
					resData.splice($parentLi.index(), 1);
					$menuList.find('li').eq(resData.length - 1).addClass('selected');
					deleteItem(itemId);
				}, 200);
			}, 200);
		}, 200);
	}
});
//确认修改
$menuList.on('click', '.editable-submit', function() {
	var id = $(this).parents('li').attr('id');
	var title = $(this).parents('.control-group').find('input').val();
	updateItem(id, {
		title: title
	});
	setTimeout(function() {
		$('.m-toolbar .icon-edit').removeClass('active');
		$menuList.removeClass('active');
		$('.menu-name').editable('destroy');
	}, 800);
});
$menuList.on('keydown', '.input-medium', function(e) {
	if(e.keyCode === 13) {
		var id = $(this).parents('li').attr('id');
		var title = $(this).parents('.control-group').find('input').val();
		updateItem(id, {
			title: title
		});
		setTimeout(function() {
			$menuList.removeClass('active');
			$('.m-toolbar .icon-edit').removeClass('active');
			$('.menu-name').editable('destroy');
		}, 800);
	}
});

$menuList.on('click', 'li', function() {
	$(this).addClass('selected').siblings().removeClass('selected');
	selectedIndex = $(this).index();
	data = {
		id: resData[selectedIndex].id,
		js: resData[selectedIndex].js,
		css: resData[selectedIndex].css,
		html: resData[selectedIndex].html
	};
	reCreateEditor();
});
$('.icon-run').on('click', function() {
	GetEditorValue();
});
$(document).on('keydown', function(e) {
	if(e.ctrlKey && e.shiftKey && e.keyCode === 83) {
		GetEditorValue();
	}
});
//拖拽宽度
var canResize1 = false;
var canResize2 = false;
var $panelLeft = $('.x-col2'),
	$panelMiddle = $('.x-col4'),
	$panelRight = $('.x-col6');
$('.m-handler').on('mousedown', function() {
	$(this).is('#mHandler1') ? canResize1 = true : canResize2 = true;
});
$(document).on('mousemove', function(e) {
	(canResize2 || canResize1) && $('#viewContainer').html('');
	var rightPanelWidth;
	if(canResize2) {
		var middlePanelWidth = e.pageX - $panelLeft.outerWidth() - 30;
		rightPanelWidth = $(window).innerWidth() - e.pageX - 36;
		(middlePanelWidth >= 130 && rightPanelWidth >= 130) && ($panelMiddle.width(middlePanelWidth), $panelRight.width(rightPanelWidth));
	}
	if(canResize1) {
		var leftPanelWidth = e.pageX - 30;
		rightPanelWidth = $(window).innerWidth() - $panelMiddle.outerWidth() - e.pageX - 36;
		(leftPanelWidth >= 288 && rightPanelWidth >= 130) && ($panelLeft.width(leftPanelWidth), $panelRight.width(rightPanelWidth));
	}
}).on('mouseup', function() {
	if(canResize1 || canResize2) {
		canResize1 = false;
		canResize2 = false;
		//GetEditorValue();
	}
});

function reCreateEditor() {
	$("#htmlContainer").children().remove();
	$("#cssContainer").children().remove();
	$("#jsContainer").children().remove();
	createEditor(data);
}
//获取代码
function GetEditorValue() {
	var id = $menuList.find('.selected').attr('id');
	data = {
		id: id,
		html: htmlEditor.getValue(),
		css: cssEditor.getValue(),
		js: encode(jsEditor.getValue())
	}
	updateItem(id, data);
	reCreateEditor();
}

function buildLeftMenu() {
	/*$.ajax({
	    url: '../../BIDashBoard/GetPageLayoutList',
	    type: 'get',
	    data: { pageId: 1 },
	    dataType: 'json',
	    async: false,
	    success: function (r) {
	        console.log(r);
	        resData = r;
	        var menuHtml = '';
	        resData.forEach(function (item, index) {
	            menuHtml += '<li id="' + item.id + '" class="' + (!index ? 'active ' : ' ') + (!index ? 'selected' : '') + '">';
	            menuHtml += '	<a href="#" class="menu-name" data-type="text" data-placement="bottom" data-title="编辑名称">' + item.title + '</a>';
	            menuHtml += '	<span class="iconfont icon-del"></span>';
	            menuHtml += '</li>';
	        });
	        $menuList.html(menuHtml);
	    },
	    error: function (r) {
	        console.log(r);
	    }
	});*/
	resData = [{
        "id": 1,
        "title": "BIM驾驶舱",
        "remark": "",
        "layoutData": "[{\"type\":0,\"layouts\":[{\"itemid\":0,\"x\":0,\"y\":28,\"w\":7,\"h\":18,\"i\":\"2\"},{\"itemid\":14,\"x\":9,\"y\":0,\"w\":3,\"h\":14,\"i\":\"4\"},{\"itemid\":23,\"x\":0,\"y\":0,\"w\":3,\"h\":14,\"i\":\"6\"},{\"itemid\":22,\"x\":0,\"y\":14,\"w\":3,\"h\":14,\"i\":\"10\"},{\"itemid\":2,\"x\":7,\"y\":28,\"w\":5,\"h\":18,\"i\":\"11\"},{\"itemid\":19,\"x\":9,\"y\":14,\"w\":3,\"h\":14,\"i\":\"12\"},{\"itemid\":25,\"x\":3,\"y\":0,\"w\":6,\"h\":28,\"i\":\"14\"}]},{\"type\":1,\"layouts\":[{\"itemid\":22,\"x\":0,\"y\":14,\"w\":3,\"h\":14,\"i\":\"1\"},{\"itemid\":2,\"x\":7,\"y\":28,\"w\":5,\"h\":17,\"i\":\"3\"},{\"itemid\":0,\"x\":0,\"y\":28,\"w\":7,\"h\":17,\"i\":\"4\"},{\"itemid\":19,\"x\":9,\"y\":14,\"w\":3,\"h\":14,\"i\":\"5\"},{\"itemid\":23,\"x\":0,\"y\":0,\"w\":3,\"h\":14,\"i\":\"6\"},{\"itemid\":14,\"x\":9,\"y\":0,\"w\":3,\"h\":14,\"i\":\"8\"},{\"itemid\":25,\"x\":3,\"y\":0,\"w\":6,\"h\":28,\"i\":\"9\"}]}]",
        "html": "<div id=\"itemDialog\" class=\"item-dialog\"></div>\r\n",
        "css": "/* 弹窗 */\r\n.item-dialog{\r\n    position: fixed;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgba(0, 0, 0, .5);\r\n    display: none;\r\n} \r\n.chart-dialog-container{\r\n    position: absolute;\r\n    left: 10%;\r\n    top:10%;\r\n    right: 10%;\r\n    bottom: 10%;\r\n}\r\n/* 滚动条样式 */\r\n::-webkit-scrollbar{width:4px;height:4px}\r\n::-webkit-scrollbar-button{display:none}\r\n::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.2);}\r\n::-webkit-scrollbar-corner{background:none}\r\n/*\r\n::-webkit-scrollbar{width:14px;height:14px}\r\n::-webkit-scrollbar-button{display:none}\r\n::-webkit-scrollbar-thumb{\r\n    border:1px solid #1D92CE;\r\n    background:no-repeat center center;\r\n    background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyNjYyNDkzMTg5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg3NCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik01MTAuODk0ODI5MDYgNTA5Ljg3ODY4NTk4bS00NDUuNjMwNDA3MDQgMGE0MzUuNDgxIDQzNS40ODEgMCAxIDAgODkxLjI2MDgxMjk2IDAgNDM1LjQ4MSA0MzUuNDgxIDAgMSAwLTg5MS4yNjA4MTI5NiAwWiIgZmlsbD0iIzEyOTZkYiIgcC1pZD0iODc1Ij48L3BhdGg+PC9zdmc+\");\r\n    background-size:6px;\r\n}\r\n::-webkit-scrollbar-corner{background:none}*/\r\n/*公共样式*/\r\n.chart-style{\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n.cockpit{\r\n    background: #3B4D65;\r\n    width: 100%;\r\n    height: 100%;\r\n    box-sizing: border-box;\r\n    padding:6px; \r\n}\r\n.cockpit h1 {\r\n    top: 0;\r\n    left: 20px;\r\n    color: #D9EEF8;\r\n    font-size: 16px;\r\n    font-weight: bold;\r\n    text-align: left;\r\n}\r\n.cockpit .cockpit-chart0 td:first-child {\r\n    width: 60%;\r\n}\r\n.cockpit td:nth-child(odd) {\r\n    color: #9EA3B4;\r\n    font-size: 14px;\r\n}\r\n.cockpit .cockpit-chart0 td:nth-child(2) {\r\n    padding-right: 16px;\r\n    box-sizing: border-box;\r\n}\r\n.cockpit td:nth-child(even) {\r\n    color: #fff;\r\n    font-size: 14px;\r\n}\r\n.cockpit td.btn {\r\n    color: #02A1F5;\r\n    cursor: pointer;\r\n    padding: 0;\r\n}\r\n.cockpit h2 {\r\n    color: #D9EEF8;\r\n    font-size: 18px;\r\n    margin-top: 40px;\r\n}\r\n\r\n.cockpit td {\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    display: inline-block;\r\n    text-overflow: ellipsis;\r\n    background: none;\r\n    line-height: 200%;\r\n}\r\n.cockpit .cockpit-chart1 td {\r\n    width: 25%;\r\n}\r\n.cockpit tr,.cockpit td{padding: 0}\r\n.chart-title{\r\n    line-height: 2.4;\r\n    font-weight: 500;\r\n    color: white;\r\n    text-align: left;\r\n    font-size: 1rem;\r\n    padding-left: 8px;\r\n    background-color:#38485F;\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    z-index: 200;\r\n    box-sizing: border-box;\r\n}\r\n.chart-title span.iconfont,.chart-title-large span.iconfont{\r\n    background: none;\r\n    float: right;\r\n    margin: 4px 0 0;\r\n    font-size: 20px;\r\n    display: block;\r\n    width: 30px;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    text-align: center;\r\n    color: white;\r\n    border-radius: 30px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease-in-out;\r\n    text-indent: 0;\r\n    box-shadow: none;\r\n}\r\n.chart-title-large{\r\n    width:100%;\r\n    line-height: 2.4;\r\n    font-weight: bold;\r\n    color: white;\r\n    text-align: left;\r\n    font-size: 1rem;\r\n    background-color:rgba(0, 0, 0, .2);\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    z-index: 200;\r\n    text-indent: 8px;\r\n}\r\n.vue-grid-item{border-radius: 3px;overflow: hidden}",
        "js": "$(window).on(%27resize%27, function () {\r\n    throttle(scrollFn);\r\n});\r\n\r\nfunction scrollFn() {\r\n    var ii = 0;\r\n    for (var i = 0; i < 20; i++) {\r\n        if (document.getElementById(%22chart%22 + i)) {\r\n            echarts.init(document.getElementById(%22chart%22 + i)).resize();\r\n            console.log(%27resize:%27 + (ii++));\r\n        }\r\n    }\r\n}\r\n\r\nfunction throttle(method, context) {\r\n    clearTimeout(method.tId);\r\n    method.tId = setTimeout(function () {\r\n        method.call(context)\r\n    }, 500)\r\n}\r\n\r\n\r\nvar unityL = 0;\r\nvar unityT = 0;\r\nvar unityW = 0;\r\nvar unityH = 0;\r\n\r\n\r\nsetInterval(function () {\r\n    var $unityContainer = $(%27#unityContainer%27);\r\n    if (!$unityContainer.length) { return };\r\n    var curUnityL = $unityContainer.offset().left + 0;\r\n    var curUnityT = $unityContainer.offset().top + 60;\r\n    var curUnityW = $unityContainer.width();\r\n    var curUnityH = $unityContainer.height();\r\n\r\n    if (unityL !== curUnityL || unityT !== curUnityT || unityW !== curUnityW || unityH !== curUnityH) {\r\n        //console.log(11)\r\n        unityL = curUnityL;\r\n        unityT = curUnityT;\r\n        unityW = curUnityW;\r\n        unityH = curUnityH;\r\n        window.top.resizeUnity({\r\n            top: unityT,\r\n            width: unityW,\r\n            height: unityH,\r\n            left: unityL\r\n        });\r\n    }\r\n\r\n}, 100);\r\n\r\nfunction intoLarge(ele, options, title) {\r\n    var isUpdatetitle = true;\r\n    var grid = {\r\n        top: 80,\r\n        left: 120,\r\n        bottom: 90,\r\n        right: %2750%%27\r\n    };\r\n    console.log(title);\r\n    //options.toolbox.feature.myensmall.show=true;\r\n    //options.toolbox.feature.myenlarge.show=false;\r\n    $(%27#itemDialog%27).show().html(%27<div class=%22chart-dialog-container%22><div class=%22chart-title-large%22>%27+title+%27<span class=%22iconfont icon-ensmall%22 onclick=%22intoSmall()%22></span></div><div id=%22intoLarge_%27 + ele + %27%22 style=%22width:100%;height:100%;%22></div></div>%27);\r\n    var largeChart = echarts.init(document.getElementById(%27intoLarge_%27 + ele));\r\n    largeChart.setOption(options);\r\n    window.top.resizeUnity({\r\n        height: 0\r\n    });\r\n}\r\nfunction intoSmall() {\r\n    $(%27#itemDialog%27).hide().html(%27%27);\r\n    if (window.top.resizeUnity) {\r\n        window.top.resizeUnity({\r\n            height: unityH\r\n        });\r\n    }\r\n\r\n}\r\n// unity初始化镜头至整栋楼\r\nif (window.parent.RegPageReadyFun) {\r\n    window.parent.RegPageReadyFun(function () {\r\n        window.parent.getUnityWindow().SwitchScene(%22qdg.scene%22, localStorage.buildingid, %22%22);\r\n    });\r\n}\r\nfunction changeEchart1(floorname, dimension) {\r\n    var chart1 = echarts.init(document.getElementById(%22chart1%22), %27macarons%27);\r\n    var total = 0;\r\n    chart1.getOption().dataset[0].source.forEach(function (item) {\r\n        if (typeof item[dimension] === %27number%27) {\r\n            total += item[dimension];\r\n        }\r\n    });\r\n    chart1.setOption({\r\n        title: {\r\n            text: floorname\r\n        },\r\n        series: [\r\n            {\r\n                id: %27pie3%27,\r\n                data: [{ name: %27总面积%27, value: total }]\r\n            }, {\r\n                id: %27pie%27,\r\n                label: {\r\n                    formatter: %27{@%27 + floorname + %27}㎡%27\r\n                },\r\n                encode: {\r\n                    value: dimension,\r\n                    tooltip: dimension\r\n                }\r\n            }, {\r\n                id: %27pie2%27,\r\n                encode: {\r\n                    value: dimension,\r\n                    tooltip: dimension\r\n                }\r\n            }\r\n        ]\r\n    });\r\n    /*缩放dataZoom*/\r\n    var _floorNum = (dimension - 1) * 6;\r\n    chart1.dispatchAction({\r\n        type: %27dataZoom%27,\r\n        start: _floorNum,\r\n        end: _floorNum\r\n    });\r\n}\r\nfunction openOrder(id){\r\n    top.$topNav.find(%27a%27).filter(function(){\r\n        return $(this).text()===%27维保工单%27;\r\n    }).trigger(%27click%27);\r\n    if(id){\r\n        localStorage.orderid=id;\r\n    }\r\n}"
   }];
	var menuHtml = '';
	resData.forEach(function(item, index) {
		menuHtml += '<li id="' + item.id + '" class="' + (!index ? 'active ' : ' ') + (!index ? 'selected' : '') + '">';
		menuHtml += '	<a href="#" class="menu-name" data-type="text" data-placement="bottom" data-title="编辑名称">' + item.title + '</a>';
		menuHtml += '	<span class="iconfont icon-del"></span>';
		menuHtml += '</li>';
	});
	$menuList.html(menuHtml);
}

function addItem(jsonModel) {
	$.ajax({
		url: '../../BIDashBoard/PageLayoutAdd',
		type: 'post',
		data: {
			jsonModel: JSON.stringify(jsonModel)
		},
		dataType: 'json',
		async: false,
		success: function(r) {
			console.log(r);
			buildLeftMenu();
			data = resData[resData.length - 1];
			reCreateEditor();
		},
		error: function(r) {
			console.log(r);
		}
	});
}

function deleteItem(id) {
	$.ajax({
		url: '../../BIDashBoard/PageLayoutDelete',
		type: 'post',
		data: {
			id: id
		},
		dataType: 'json',
		async: false,
		success: function(r) {
			console.log(r);
		},
		error: function(r) {
			console.log(r);
		}
	});
}

function updateItem(id, updateData) {
	var jsonModel = {};
	for(var key in updateData) {
		if(updateData.hasOwnProperty(key) && key !== 'id') {
			jsonModel[key] = updateData[key];
		}
	}
	$.ajax({
		url: '../../BIDashBoard/PageLayoutUpdate',
		type: 'post',
		data: {
			id: id,
			jsonModel: JSON.stringify(jsonModel)
		},
		dataType: 'html',
		async: false,
		success: function(r) {
			if(r == "1") {
				alert("保存成功！");
			}
		},
		error: function(r) {
			console.log(r);
		}
	});
}

function encode(string) {
	if(!string) {
		return "";
	}
	return string.replace(/\'/g, '%27').replace(/\"/g, '%22');
}

function decode(string) {
	if(!string) {
		return "";
	}
	return string.replace(/%27/g, "'").replace(/%22/g, '"');
}

function gotoItemEdit() {
	var id = $('#menuList .selected').attr('id');
	window.open("item-edit.html?pageid=" + id);
}

function gotoLayoutEdit() {
	var id = $('#menuList .selected').attr('id');
	window.open("layout-edit.html?pageid=" + id);
}

function gotoView() {
	var id = $('#menuList .selected').attr('id');
	window.open("layout-view.aspx?pageid=" + id);
}