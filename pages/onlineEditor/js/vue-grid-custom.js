var pageid = 1;
var type = $('.s-lg').length ? 0 : 1;
var layoutOption;
var totalLayoutData;
var layoutData = getLayoutData(pageid);
var isHasType = false;
if(layoutData && layoutData.layoutData) {
	totalLayoutData = JSON.parse(layoutData.layoutData);
	layoutOption = totalLayoutData.filter(function(item) {
		return item.type === type;
	})[0];
	layoutOption && (isHasType = true);
}
var testList = getItemMenu(pageid);
var testLayout = layoutOption ? mergeData() : [];
Vue.config.debug = true;
Vue.config.devtools = true;

var GridLayout = VueGridLayout.GridLayout;
var GridItem = VueGridLayout.GridItem;
var vue = new Vue({
	el: '#app',
	components: {
		"GridLayout": GridLayout,
		"GridItem": GridItem
	},
	data: {
		layout: testLayout,
		draggable: false,
		resizable: false,
		editable: false,
		showItemList: false,
		itemList: testList,
		index: 0,
		rowheight: window.innerHeight / 101,
		eleDrag: null,
		cssLists: []
	},
	mounted: function() {
		var that = this;
		console.log(this.rowheight);
		this.layout.forEach(function(item) {
			that.index = Math.max(that.index, +item.i);
		});
		this.index++;
		this.importCssJs();
	},
	updated: function() {
		this.importCssJs();
	},
	methods: {
		importCssJs: function() {
			//引用js
			var self = this;
			var hasCssLists = this.layout.filter(function(item) {
				if(item.js) {
					setTimeout(function() {
						eval(decode(item.js));
					}, 0);
				}
				return item.css;
			});
			//引用css
			if(hasCssLists.length) {
				hasCssLists.forEach(function(item) {
					var style;
					if(self.cssLists.length) {
						var isExist = self.cssLists.some(function(itemin) {
							return itemin === item.id;
						});
						if(!isExist) {
							self.cssLists.push(item.id);
							style = document.createElement("style");
							style.type = "text/css";
							style.setAttribute('class', 'custom-' + item.id);
							style.innerHTML = item.css;
							document.head.appendChild(style);
						}
					} else {
						self.cssLists.push(item.id);
						style = document.createElement("style");
						style.type = "text/css";
						style.setAttribute('class', 'custom-' + item.id);
						style.innerHTML = item.css;
						document.head.appendChild(style);
					}
				});
			} else {
				self.cssLists = [];
				$('style[class^="custom-"]').remove();
			}
		},
		changeEditable: function() {
			!this.editable && (this.showItemList = false);
			this.editable = !this.editable;
			this.draggable = !this.draggable;
			this.resizable = !this.resizable;
		},
		changeItemList: function() {
			!this.showItemList && (
				this.editable = false,
				this.draggable = false,
				this.resizable = false
			);
			this.showItemList = !this.showItemList;
		},
		selectstart: function() {
			return false;
		},
		drag: function(ev) {
			ev.dataTransfer.effectAllowed = "move";
			ev.dataTransfer.setData("text", ev.target.innerHTML);
			ev.dataTransfer.setDragImage(ev.target, 0, 0);
			this.eleDrag = ev.target;
			return true;
		},
		dragend: function(ev) {
			ev.dataTransfer.clearData("text");
			this.eleDrag = null;
			return false;
		},
		drop: function(ev) {
			var fromElement = this.eleDrag;
			var self = this;
			if(!fromElement) {
				return false;
			}
			var toElement = ev.target;
			var fromParent = fromElement.parentNode;
			var toParent = toElement.parentNode;
			var fromIndex, fromItemIndex, fromTitle, fromHtml, fromCss, fromJs, toIndex, toItemIndex, toTitle, toHtml, toCss, toJs;
			if(fromParent.className === 'vg-item-content') {
				//拖动模块位置：右侧
				switch(true) {
					case toElement.className === 'draglist' && toParent.className.indexOf('vg-item-content') >= 0:
						//排序
						this.layout.forEach(function(item, index) {
							if(item.id === +toElement.getAttribute('data-index')) {
								toIndex = index, toItemIndex = item.id, toTitle = item.title, toHtml = item.html, toCss = item.css, toJs = item.js;
							}
							if(item.id === +fromElement.getAttribute('data-index')) {
								fromIndex = index, fromItemIndex = item.id, fromTitle = item.title, fromHtml = item.html, fromCss = item.css, fromJs = item.js;
							}
						});
						this.layout[toIndex].id = fromItemIndex;
						this.layout[toIndex].title = fromTitle;
						this.layout[toIndex].html = fromHtml;
						this.layout[toIndex].css = fromCss;
						this.layout[toIndex].js = fromJs;
						this.layout[fromIndex].id = toItemIndex;
						this.layout[fromIndex].title = toTitle;
						this.layout[fromIndex].html = toHtml;
						this.layout[fromIndex].css = toCss;
						this.layout[fromIndex].js = toJs;
						toParent.style.backgroundColor = "#cccccc";
						break;
					case toElement.className.indexOf('items-dialog') >= 0:
						//移除
						this.layout.forEach(function(item, index) {
							if(item.id === +fromElement.getAttribute('data-index')) {
								fromIndex = index, fromItemIndex = item.id, fromTitle = item.title, fromHtml = item.html, fromCss = item.css, fromJs = item.js;
							}
						});
						self.itemList.push({
							id: fromItemIndex,
							title: fromTitle,
							html: fromHtml,
							css: fromCss,
							js: fromJs
						});
						self.layout[fromIndex].id = '';
						self.layout[fromIndex].title = '';
						self.layout[fromIndex].html = '';
						self.layout[fromIndex].css = '';
						self.layout[fromIndex].js = '';
						toElement.style.backgroundColor = "#cccccc";
						break;
					case toElement.className.indexOf('vg-item-content') >= 0:
						//移动
						this.layout.forEach(function(item, index) {
							if(item.id === +fromElement.getAttribute('data-index')) {
								fromIndex = index, fromItemIndex = item.id, fromTitle = item.title, fromHtml = item.html, fromCss = item.css, fromJs = item.js;
							}
						});
						toIndex = toElement.getAttribute('data-id');
						this.layout[fromIndex].id = '';
						this.layout[fromIndex].title = '';
						this.layout[fromIndex].html = '';
						this.layout[fromIndex].css = '';
						this.layout[fromIndex].js = '';
						this.layout[toIndex].id = fromItemIndex;
						this.layout[toIndex].title = fromTitle;
						this.layout[toIndex].html = fromHtml;
						this.layout[toIndex].css = fromCss;
						this.layout[toIndex].js = fromJs;
						toElement.style.backgroundColor = "#cccccc";
						break;
					case toElement.className === 'draglist' && toParent.className.indexOf('items-dialog') >= 0:
						//交换
						this.layout.forEach(function(item, index) {
							if(item.id === +fromElement.getAttribute('data-index')) {
								fromIndex = index, fromItemIndex = item.id, fromTitle = item.title, fromHtml = item.html, fromCss = item.css, fromJs = item.js;
							}
						});
						this.itemList.forEach(function(item, index) {
							if(item.id === +toElement.getAttribute('data-index')) {
								toIndex = index, toItemIndex = item.id, toTitle = item.title, toHtml = item.html, toCss = item.css, toJs = item.js;
							}
						});
						this.layout[fromIndex].id = toItemIndex;
						this.layout[fromIndex].title = toTitle;
						this.layout[fromIndex].html = toHtml;
						this.layout[fromIndex].css = toCss;
						this.layout[fromIndex].js = toJs;
						this.itemList[toIndex].id = fromItemIndex;
						this.itemList[toIndex].title = fromTitle;
						this.itemList[toIndex].html = fromHtml;
						this.itemList[toIndex].css = fromCss;
						this.itemList[toIndex].js = fromJs;
						toParent.style.backgroundColor = "#cccccc";
						break;
					default:
						break;
				}
			} else {
				//拖动模块位置：左侧
				switch(true) {
					case toElement.className === 'draglist' && toParent.className.indexOf('items-dialog') >= 0:
						//排序
						this.itemList.forEach(function(item, index) {
							if(item.id === +toElement.getAttribute('data-index')) {
								toIndex = index, toItemIndex = item.id, toTitle = item.title, toHtml = item.html, toCss = item.css, toJs = item.js;
							}
							if(item.id === +fromElement.getAttribute('data-index')) {
								fromIndex = index, fromItemIndex = item.id, fromTitle = item.title, fromHtml = item.html, fromCss = item.css, fromJs = item.js;
							}
						});
						this.itemList.splice(toIndex, 1, {
							id: fromItemIndex,
							title: fromTitle,
							html: fromHtml,
							css: fromCss,
							js: fromJs
						});
						this.itemList.splice(fromIndex, 1, {
							id: toItemIndex,
							title: toTitle,
							html: toHtml,
							css: toCss,
							js: toJs
						});
						break;
					case toElement.className === 'vg-item-content':
						//添加
						this.itemList.forEach(function(item, index) {
							if(item.id === +fromElement.getAttribute('data-index')) {
								fromIndex = index, fromItemIndex = item.id, fromTitle = item.title, fromHtml = item.html, fromCss = item.css, fromJs = item.js;
							}
						});
						toIndex = toElement.getAttribute('data-id');
						this.layout[toIndex].id = fromItemIndex;
						this.layout[toIndex].title = fromTitle;
						this.layout[toIndex].html = fromHtml;
						this.layout[toIndex].css = fromCss;
						this.layout[toIndex].js = fromJs;
						this.itemList.splice(fromIndex, 1);
						toElement.style.backgroundColor = "#cccccc";
						break;
					case toElement.className === 'draglist' && toParent.className.indexOf('vg-item-content') >= 0:
						//交换
						var toParentIndex;
						this.itemList.forEach(function(item, index) {
							if(item.id === +fromElement.getAttribute('data-index')) {
								fromIndex = index, fromItemIndex = item.id, fromTitle = item.title, fromHtml = item.html, fromCss = item.css, fromJs = item.js;
							}
						});
						toParentIndex = toParent.getAttribute('data-id');
						toJs = this.layout[toParentIndex].js;
						toCss = this.layout[toParentIndex].css;
						toTitle = this.layout[toParentIndex].title;
						toHtml = this.layout[toParentIndex].html;
						this.layout[toParentIndex].id = fromItemIndex;
						this.layout[toParentIndex].title = fromTitle;
						this.layout[toParentIndex].html = fromHtml;
						this.layout[toParentIndex].css = fromCss;
						this.layout[toParentIndex].js = fromJs;
						toItemIndex = +toElement.getAttribute('data-index');
						this.itemList.splice(fromIndex, 1, {
							id: toItemIndex,
							title: toTitle,
							html: toHtml,
							css: toCss,
							js: toJs
						});
						toParent.style.backgroundColor = "#cccccc";
						break;
					default:
						break;
				}
			}
			return false;
		},
		dragenter: function(ev) {
			ev.currentTarget.style.backgroundColor = "#9CDCFE";
			return true;
		},
		dragleave: function(ev) {
			ev.preventDefault();
			ev.currentTarget.style.backgroundColor = "#cccccc";
			return false;
		},
		dragover: function(ev) {
			ev.preventDefault();
			return true;
		},
		postLayoutData: function() {
			//console.log(this.layout);
			var layoutDatas = [];
			this.layout.forEach(function(item) {
				layoutDatas.push({
					itemid: item.id,
					x: item.x,
					y: item.y,
					w: item.w,
					h: item.h,
					i: item.i
				});
			});
			updateLayoutData(pageid, layoutDatas);
		},
		removeItem: function(itemindex, content) {
			console.log(content);
			if(content) {
				alert('请先移除内容！');
			} else {
				this.layout.splice(itemindex, 1);
			}
		},
		addItem: function() {
			var lastItem;
			if(this.layout.length) {
				lastItem = this.layout[this.layout.length - 1];
			} else {
				lastItem = {
					"x": 0,
					"y": 0,
					"w": 2,
					"h": 2
				};
			}
			var item = {
				"x": (lastItem.x + lastItem.w) <= 10 ? lastItem.x + lastItem.w : 0,
				"y": lastItem.y,
				"w": 2,
				"h": 2,
				"i": this.index + ''
			};
			this.index++;
			this.layout.push(item);
			//console.log(this.layout);
		}
	}
});

function getItemMenu(pageid) {
	var res;
	//	$.ajax({
	//		url: '../../BIDashBoard/GetPageLayoutItemList',
	//		type: 'get',
	//		data: {
	//			pageId: pageid
	//		},
	//		dataType: 'json',
	//		async: false,
	//		success: function(r) {
	//			//console.log(r);
	//			res = r;
	//		},
	//		error: function(r) {
	//			console.log(r);
	//		}
	//	});
	res = [{
		"id": 0,
		"pageId": 1,
		"title": "空间信息_use",
		"html": "<div class=\"chart-title\">空间信息(空间利用分析)<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart1\" aa=\"bb\"  class=\"chart-style\"></div>",
		"css": "",
		"js": "var isUpdatetitle = true;\r\nvar option1 = {\r\n\ttitle: [{\r\n\t\ttext: %27第一层%27,\r\n\t\ttextStyle: {\r\n\t\t\tcolor: %27#9EA3B4%27,\r\n\t\t\tfontSize: 16,\r\n\t\t\tfontWeight: %27normal%27,\r\n\t\t\tfontFamily: [%22Microsoft YaHei%22, %22Segoe UI%22, %22Helvetica Neue%22, %22sans-serif%22]\r\n\t\t},\r\n\t\ttop: 6,\r\n\t\tleft: %2750%%27\r\n\t}],\r\n\tbackgroundColor: %27#3B4D65%27,\r\n\ttextStyle: {\r\n\t\tfontSize: 14,\r\n\t\tcolor:%27#9EA3B4%27\r\n\t},\r\n\tlegend: {\r\n\t\ttype: %27scroll%27,\r\n\t\ttextStyle:{\r\n\t\t\tcolor:%27#9EA3B4%27\r\n\t\t},\r\n\t\tpageTextStyle: {\r\n\t\t\tcolor: %27#D9EEF8%27\r\n\t\t},\r\n\t\torient: %27vertical%27,\r\n\t\ttop: 48,\r\n\t\tright: 8,\r\n\t\titemWidth: 14\r\n\t},\r\n\ttooltip: {\r\n\t\ttrigger: %27axis%27,\r\n\t\tshowContent: true,\r\n\t\taxisPointer: { // 坐标轴指示器，坐标轴触发有效\r\n\t\t\ttype: %27shadow%27 // 默认为直线，可选为：%27line%27 | %27shadow%27\r\n\t\t},\r\n\t\tformatter: function (r) {\r\n\t\t\tif (isUpdatetitle) {\r\n\t\t\t\t//console.log(r);\r\n\t\t\t\tisUpdatetitle = false;\r\n\t\t\t\tvar total = 0;\r\n\t\t\t\tr[0].data.forEach(function (item) {\r\n\t\t\t\t\tif (typeof item === %27number%27) {\r\n\t\t\t\t\t\ttotal += item;\r\n\t\t\t\t\t}\r\n\t\t\t\t});\r\n\t\t\t\t//console.log(r[0].axisValue)\r\n\t\t\t\tvar _option = {\r\n\t\t\t\t\ttitle: {\r\n\t\t\t\t\t\ttext: r[0].axisValue\r\n\t\t\t\t\t},\r\n\t\t\t\t\tseries: [{\r\n\t\t\t\t\t\tid: %27pie3%27,\r\n\t\t\t\t\t\tdata: [{\r\n\t\t\t\t\t\t\tname: %27总面积%27,\r\n\t\t\t\t\t\t\tvalue: total\r\n\t\t\t\t\t\t}]\r\n\t\t\t\t\t}, {\r\n\t\t\t\t\t\tid: %27pie%27,\r\n\t\t\t\t\t\tlabel: {\r\n\t\t\t\t\t\t\tformatter: %27{@%27 + r[0].axisValue + %27}㎡%27\r\n\t\t\t\t\t\t},\r\n\t\t\t\t\t\tencode: {\r\n\t\t\t\t\t\t\titemName: %27占位%27,\r\n\t\t\t\t\t\t\tvalue: r[0].name,\r\n\t\t\t\t\t\t\ttooltip: r[0].name\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t}, {\r\n\t\t\t\t\t\tid: %27pie2%27,\r\n\t\t\t\t\t\tencode: {\r\n\t\t\t\t\t\t\titemName: %27占位%27,\r\n\t\t\t\t\t\t\tvalue: r[0].name,\r\n\t\t\t\t\t\t\ttooltip: r[0].name\r\n\t\t\t\t\t\t}\r\n\t\t\t\t\t}]\r\n\t\t\t\t};\r\n\t\t\t\tif (document.getElementById(%27intoLarge_chart1%27)) {\r\n\t\t\t\t\tvar largeChart = echarts.init(document.getElementById(%27intoLarge_chart1%27));\r\n\t\t\t\t\tlargeChart.setOption(_option);\r\n\t\t\t\t}\r\n\t\t\t\tchart1.setOption(_option);\r\n\t\t\t\tsetTimeout(function () {\r\n\t\t\t\t\tisUpdatetitle = true;\r\n\t\t\t\t}, 200);\r\n\t\t\t}\r\n\t\t}\r\n\t},\r\n\tdataset: {\r\n\t\tsource: [\r\n\t\t\t[%27占位%27, %27第一层%27, %27第二层%27, %27第三层%27, %27第四层%27, %27第五层%27, %27第六层%27, %27第七层%27, %27第八层%27, %27第九层%27, %27第十层%27, %27第十一层%27, %27第十二层%27, %27第十三层%27, %27第十四层%27, %27第十五层%27, %27第十六层%27, %27第十七层%27, %27设备层%27],\r\n\t\t\t[%27卫生间%27, 80, 80, 0, 100, 200, 50, 50, 200, 100, 150, 100, 50, 250, 120, 70, 140, 160, 10],\r\n\t\t\t[%27走廊%27, 80, 80, 80, 160, 50, 60, 200, 100, 50, 150, 150, 50, 50, 80, 130, 240, 130, 200],\r\n\t\t\t[%27会议室%27, 300, 200, 0, 50, 50, 140, 50, 50, 100, 150, 150, 200, 100, 200, 180, 120, 110, 150],\r\n\t\t\t[%27打印室%27, 40, 40, 0, 50, 50, 100, 100, 50, 300, 150, 150, 100, 50, 200, 170, 120, 150, 240],\r\n\t\t\t[%27活动室%27, 100, 0, 0, 240, 100, 50, 50, 80, 150, 200, 150, 200, 150, 100, 200, 280, 150, 200],\r\n\t\t\t[%27未分配%27, 600, 800, 1120, 600, 750, 800, 750, 720, 500, 400, 500, 600, 600, 500, 450, 300, 500, 400]\r\n\t\t]\r\n\t},\r\n\tyAxis: {\r\n\t\ttype: %27category%27,\r\n\t\tsplitLine: {\r\n\t\t\tshow: true,\r\n\t\t\tlineStyle: {\r\n\t\t\t\tcolor: %27#5A6378%27\r\n\t\t\t}\r\n\t\t},\r\n\t\taxisLine: {\r\n\t\t\tlineStyle: {\r\n\t\t\t\tcolor: %27#9EA3B4%27\r\n\t\t\t}\r\n\t\t}\r\n\t},\r\n\txAxis: {\r\n\t\ttype: %27value%27,\r\n\t\tgridIndex: 0,\r\n\t\tsplitLine: {\r\n\t\t\tshow: true,\r\n\t\t\tlineStyle: {\r\n\t\t\t\tcolor: %27#5A6378%27\r\n\t\t\t}\r\n\t\t},\r\n\t\tsplitNumber: 5,\r\n\t\taxisLine: {\r\n\t\t\tlineStyle: {\r\n\t\t\t\tcolor: %27#9EA3B4%27\r\n\t\t\t}\r\n\t\t},\r\n\t\tsplitArea: {\r\n\t\t\tshow: false\r\n\t\t},\r\n\t},\r\n\tdataZoom: [{\r\n\t\ttype: %27slider%27,\r\n\t\tshow: true,\r\n\t\tyAxisIndex: [0],\r\n\t\ttextStyle: {\r\n\t\t\tcolor: %27#9EA3B4%27\r\n\t\t},\r\n\t\tstart: 1,\r\n\t\tend: 200,\r\n\t\tleft: 10\r\n\t}],\r\n\tgrid: {\r\n\t\ttop: 60,\r\n\t\tleft: 100,\r\n\t\tbottom: 28,\r\n\t\tright: %2750%%27\r\n\t},\r\n\tseries: [{\r\n\t\tname: %27卫生间%27,\r\n\t\ttype: %27bar%27,\r\n\t\tstack: %27层%27,\r\n\t\tseriesLayoutBy: %27row%27,\r\n\t\titemStyle: {\r\n\t\t\tnormal: {\r\n\t\t\t\tcolor: %27#e35b5a%27\r\n\t\t\t}\r\n\t\t}\r\n\t}, {\r\n\t\tname: %27走廊%27,\r\n\t\ttype: %27bar%27,\r\n\t\tstack: %27层%27,\r\n\t\tseriesLayoutBy: %27row%27,\r\n\t\titemStyle: {\r\n\t\t\tnormal: {\r\n\t\t\t\tcolor: %27#f1a1a1%27\r\n\t\t\t}\r\n\t\t}\r\n\t}, {\r\n\t\tname: %27会议室%27,\r\n\t\ttype: %27bar%27,\r\n\t\tstack: %27层%27,\r\n\t\tseriesLayoutBy: %27row%27,\r\n\t\titemStyle: {\r\n\t\t\tnormal: {\r\n\t\t\t\tcolor: %27#cecb8b%27\r\n\t\t\t}\r\n\t\t}\r\n\t}, {\r\n\t\tname: %27打印室%27,\r\n\t\ttype: %27bar%27,\r\n\t\tstack: %27层%27,\r\n\t\tseriesLayoutBy: %27row%27,\r\n\t\titemStyle: {\r\n\t\t\tnormal: {\r\n\t\t\t\tcolor: %27#8fc38b%27\r\n\t\t\t}\r\n\t\t}\r\n\t}, {\r\n\t\tname: %27活动室%27,\r\n\t\ttype: %27bar%27,\r\n\t\tstack: %27层%27,\r\n\t\tseriesLayoutBy: %27row%27,\r\n\t\titemStyle: {\r\n\t\t\tnormal: {\r\n\t\t\t\tcolor: %27#75b9c6%27\r\n\t\t\t}\r\n\t\t}\r\n\t}, {\r\n\t\tname: %27未分配%27,\r\n\t\ttype: %27bar%27,\r\n\t\tstack: %27层%27,\r\n\t\tseriesLayoutBy: %27row%27,\r\n\t\titemStyle: {\r\n\t\t\tnormal: {\r\n\t\t\t\tcolor: %27#626F81%27\r\n\t\t\t}\r\n\t\t}\r\n\t}, {\r\n\t\ttype: %27pie%27,\r\n\t\tname: %27占用面积%27,\r\n\t\tid: %27pie3%27,\r\n\t\tradius: [%270%%27, %2720%%27],\r\n\t\tcenter: [%2775%%27, %2755%%27],\r\n\t\tselectedMode: %27single%27,\r\n\t\tlabel: {\r\n\t\t\tshow: true,\r\n\t\t\tposition: %27center%27,\r\n\t\t\tcolor: %27#9EA3B4%27,\r\n\t\t\tformatter: %27{b}\\n{c}㎡%27\r\n\t\t},\r\n\t\tlabelLine: {\r\n\t\t\tnormal: {\r\n\t\t\t\tshow: false\r\n\t\t\t}\r\n\t\t},\r\n\t\tdata: [{\r\n\t\t\tname: %27总面积%27,\r\n\t\t\tvalue: %271200%27\r\n\t\t}],\r\n\t\titemStyle: {\r\n\t\t\tnormal: {\r\n\t\t\t\tcolor: %27#C23531%27\r\n\t\t\t}\r\n\t\t}\r\n\t}, {\r\n\t\ttype: %27pie%27,\r\n\t\tname: %27占用面积%27,\r\n\t\tid: %27pie%27,\r\n\t\tradius: [%2722%%27, %2755%%27],\r\n\t\tcenter: [%2775%%27, %2755%%27],\r\n\t\tlabel: {\r\n\t\t\tformatter: %27{@第一层}㎡%27,\r\n\t\t\tposition: %27inside%27\r\n\t\t},\r\n\t\ttooltip: {\r\n\t\t\tshowContent: true,\r\n\t\t\ttrigger: %27item%27,\r\n\t\t\tformatter: %27{b}%27\r\n\t\t},\r\n\t\tencode: {\r\n\t\t\titemName: %27占位%27,\r\n\t\t\tvalue: %27第一层%27,\r\n\t\t\ttooltip: %27第一层%27\r\n\t\t},\r\n\t\titemStyle: {\r\n\t\t\tnormal: {\r\n\t\t\t\tcolor: function (params) {\r\n\t\t\t\t\tvar colorList = [%27#e35b5a%27, %27#f1a1a1%27, %27#cecb8b%27, %27#8fc38b%27, %27#75b9c6%27, %27#626F81%27, %27#448c99%27];\r\n\t\t\t\t\treturn colorList[params.dataIndex];\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t}\r\n\t}, {\r\n\t\ttype: %27pie%27,\r\n\t\tname: %27占用面积%27,\r\n\t\tid: %27pie2%27,\r\n\t\tradius: [%2755%%27, %2770%%27],\r\n\t\tcenter: [%2775%%27, %2755%%27],\r\n\t\tlabel: {\r\n\t\t\tformatter: %27{d}%%27,\r\n\t\t\tposition: %27inside%27\r\n\t\t},\r\n\t\ttooltip: {\r\n\t\t\tshowContent: true,\r\n\t\t\ttrigger: %27item%27,\r\n\t\t\tformatter: %27{b}%27\r\n\t\t},\r\n\t\tencode: {\r\n\t\t\titemName: %27占位%27,\r\n\t\t\tvalue: %27第一层%27,\r\n\t\t\ttooltip: %27第一层%27\r\n\t\t},\r\n\t\titemStyle: {\r\n\t\t\tnormal: {\r\n\t\t\t\tcolor: %27#4C5672%27\r\n\t\t\t}\r\n\t\t}\r\n\t}]\r\n};\r\nvar chart1 = echarts.init(document.getElementById(%22chart1%22), %27macarons%27);\r\nchart1.setOption(option1);\r\ndocument.getElementById(%22chart1%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27, function () {\r\n\tintoLarge(%27chart1%27, option1, %27空间信息(空间利用分析)%27);\r\n});\r\n"
	}, {
		"id": 1,
		"pageId": 1,
		"title": "部门人均空间利用情况",
		"html": "<div class=\"chart-title\">部门人均空间利用情况<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart2\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option2 = {\r\n        title: {\r\n            text: %27%27,\r\n            textStyle: {\r\n                fontSize: 16,\r\n                color: %27#D9EEF8%27\r\n            },\r\n            top: 6,\r\n            left:4\r\n        },\r\n        backgroundColor: %27#3B4D65%27,\r\n        grid: {\r\n            top: 80,\r\n            left: 10,\r\n            right: 10,\r\n            bottom: 10,\r\n            containLabel: true\r\n        },\r\n        color: [%27#003366%27, %27#006699%27, %27#4cabce%27, %27#e5323e%27],\r\n        tooltip: {\r\n            trigger: %27axis%27,\r\n            axisPointer: {\r\n                type: %27shadow%27\r\n            }\r\n        },\r\n        legend: {\r\n            data: [\r\n                { name: %27人均空间%27, icon: %27circle%27 },\r\n                { name: %27标准空间%27, icon: %27circle%27 }\r\n            ],\r\n            textStyle: {\r\n                color: %27#D9EEF8%27\r\n            },\r\n            type: %27scroll%27,\r\n            right: 50,\r\n            top: 50\r\n        },\r\n        calculable: true,\r\n        xAxis: [\r\n            {\r\n                type: %27category%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                splitNumber: 10,\r\n                axisTick: { show: false },\r\n                data: [%27综合部%27, %27副总办公室%27, %27造价业务1部%27, %27造价业务2部%27, %271号会议室%27, %27研发部%27, %27外埠事业部%27, %27PPP事业部%27],\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        yAxis: [\r\n            {\r\n                type: %27value%27,\r\n                name: %27㎡/人%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                interval: 50,\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        series: [\r\n            {\r\n                name: %27人均空间%27,\r\n                type: %27bar%27,\r\n                barGap: 0,\r\n                data: [20, 32, 73, 34, 30, 20, 82, 19],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: %27#FF7F50%27,\r\n                        label: {\r\n                            show: true,\r\n                            position: %27top%27,\r\n                            formatter: %27{c}%27\r\n                        }\r\n                    }\r\n                },\r\n            },\r\n            {\r\n                name: %27标准空间%27,\r\n                type: %27bar%27,\r\n                data: [20, 12, 91, 24, 29, 22, 18, 11],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: %27#87CEFA%27,\r\n                        label: {\r\n                            show: true,\r\n                            position: %27top%27,\r\n                            formatter: %27{c}%27\r\n                        }\r\n                    }\r\n                }\r\n            }\r\n        ]\r\n    };\r\nvar chart2 = echarts.init(document.getElementById(%22chart2%22),%27macarons%27);\r\nchart2.setOption(option2);\r\ndocument.getElementById(%22chart2%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27,function(){\r\n    intoLarge(%27chart2%27, option2,%27部门人均空间利用情况%27);\r\n});\r\n\r\n"
	}, {
		"id": 2,
		"pageId": 1,
		"title": "资产配比_use",
		"html": "<div class=\"chart-title\">资产配比<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart3\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var chart3 = echarts.init(document.getElementById(%22chart3%22), %27macarons%27);\r\nvar option3 = {\r\n    grid: {\r\n        top: 100,\r\n        left: 10,\r\n        right: 10,\r\n        bottom: 10,\r\n        containLabel: true\r\n    },\r\n    backgroundColor: %27#3B4D65%27,\r\n    // tooltip: {\r\n    //     trigger: %27item%27,\r\n    //     formatter: %22{a}<br>{b}: {c} ({d}%)%22\r\n    // },\r\n    legend: {\r\n        type: %27scroll%27,\r\n        data: [\r\n            { name: %27办公资产%27, icon: %27circle%27 },\r\n            { name: %27暖通%27, icon: %27circle%27 },\r\n            { name: %27空调%27, icon: %27circle%27 },\r\n            { name: %27建筑装修类%27, icon: %27circle%27 },\r\n            { name: %27电气%27, icon: %27circle%27 },\r\n            { name: %27消防%27, icon: %27circle%27 },\r\n            { name: %27电梯%27, icon: %27circle%27 },\r\n\r\n        ],\r\n        textStyle: {\r\n            color: %27#9EA3B4%27\r\n        },\r\n        pageTextStyle: { color: %27#D9EEF8%27 },\r\n        orient: %27horizontal%27,\r\n        left: 20,\r\n        bottom: 10\r\n    },\r\n    series: [\r\n        {\r\n            name: %27资产额及比例：%27,\r\n            type: %27pie%27,\r\n            center: [%2750%%27, %2755%%27],\r\n            radius: [%2725%%27, %2740%%27],\r\n            avoidLabelOverlap: false,\r\n            label: {\r\n                normal: {\r\n                    formatter: %27{a|{a}}{abg|}\\n{hr|}\\n  {b|{b}：}{c}  {per|{d}%}  %27,\r\n                    backgroundColor: %27#596E8B%27,\r\n                    borderColor: %27#6A84A8%27,\r\n                    borderWidth: 1,\r\n                    borderRadius: 4,\r\n                    rich: {\r\n                        a: {\r\n                            color: %27#D9EEF8%27,\r\n                            lineHeight: 22,\r\n                            align: %27center%27\r\n                        },\r\n                        abg: {\r\n                            \r\n                            width: %27100%%27,\r\n                            align: %27right%27,\r\n                            height: 22,\r\n                            borderRadius: [4, 4, 0, 0]\r\n                        },\r\n                        hr: {\r\n                            borderColor: %27#3B4D65%27,\r\n                            width: %27100%%27,\r\n                            borderWidth: 0.5,\r\n                            height: 0\r\n                        },\r\n                        b: {\r\n                            fontSize: 14,\r\n                            lineHeight: 22\r\n                        },\r\n                        per: {\r\n                            color: %27#eee%27,\r\n                            backgroundColor: %27#334455%27,\r\n                            padding: [2, 4],\r\n                            borderRadius: 2\r\n                        }\r\n                    },\r\n                },\r\n                emphasis: {\r\n                    show: true,\r\n                    textStyle: {\r\n                        fontSize: 14,\r\n                        fontWeight: %27bold%27\r\n                    }\r\n                }\r\n            },\r\n            data: [\r\n                { value: 335, name: %27办公资产%27 },\r\n                { value: 310, name: %27暖通%27 },\r\n                { value: 234, name: %27空调%27 },\r\n                { value: 1548, name: %27建筑装修类%27 },\r\n                { value: 135, name: %27电气%27 },\r\n                { value: 1548, name: %27消防%27 },\r\n                { value: 135, name: %27电梯%27 },\r\n\r\n            ]\r\n        }\r\n    ]\r\n};\r\nchart3.setOption(option3);\r\ndocument.getElementById(%22chart3%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27, function () {\r\n    intoLarge(%27chart3%27, option3, %27资产配比%27);\r\n});"
	}, {
		"id": 13,
		"pageId": 1,
		"title": "资产配比",
		"html": "<div class=\"chart-title\">资产配比<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart4\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option4 = {\r\n        backgroundColor: %27#3B4D65%27,\r\n        grid: {\r\n            left: 10,\r\n            bottom: 10,\r\n            right: 10,\r\n            top: 80,\r\n            containLabel: true\r\n        },\r\n        tooltip: {\r\n            trigger: %27axis%27,\r\n            formatter: %27{a}<br/>{b}:{c}%%27\r\n        },\r\n        xAxis: [\r\n            {\r\n                type: %27category%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                data: [%27烟感装置%27, %27冷冻水泵%27, %27热水循环泵%27, %27电表%27, %27蒸汽流量计%27, %27水表%27, %27热量表%27, %27变压器%27, %27冷却塔%27, %27其他%27],\r\n                axisPointer: {\r\n                    type: %27shadow%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        yAxis: [\r\n            {\r\n                type: %27value%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                name: %27故障率%27,\r\n                min: 0,\r\n                max: 10,\r\n                interval: 5,\r\n                axisLabel: {\r\n                    formatter: %27{value}%%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        series: [\r\n            {\r\n                name: %27故障率%27,\r\n                type: %27bar%27,\r\n                data: [2, 5, 1, 3, 2, 1, 1, 5, 4, 2],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1,\r\n                            [\r\n                                { offset: 0, color: %27#83bff6%27 },\r\n                                { offset: 0.5, color: %27#188df0%27 },\r\n                                { offset: 1, color: %27#188df0%27 }\r\n                            ]\r\n                        )\r\n                    },\r\n                    emphasis: {\r\n                        color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1,\r\n                            [\r\n                                { offset: 0, color: %27#2378f7%27 },\r\n                                { offset: 0.7, color: %27#2378f7%27 },\r\n                                { offset: 1, color: %27#83bff6%27 }\r\n                            ]\r\n                        )\r\n                    }\r\n                }\r\n            }\r\n        ]\r\n    };\r\nvar chart4 = echarts.init(document.getElementById(%22chart4%22),%27macarons%27);\r\nchart4.setOption(option4);\r\ndocument.getElementById(%22chart4%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27,function(){\r\n    intoLarge(%27chart4%27, option4,%27资产配比%27);\r\n});\r\n"
	}, {
		"id": 14,
		"pageId": 1,
		"title": "设备信息_use",
		"html": "<div class=\"chart-title\">设备信息(主要故障分析)<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart5\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option5 = {\r\n    backgroundColor: %27#3B4D65%27,\r\n    grid: {\r\n        left: 10,\r\n        bottom: %273%%27,\r\n        right: 10,\r\n        top: 80,\r\n        containLabel: true\r\n    },\r\n    tooltip: {\r\n        trigger: %27axis%27,\r\n        axisPointer: {\r\n            type: %27shadow%27\r\n        }\r\n    },\r\n    xAxis: [\r\n        {\r\n            type: %27category%27,\r\n            splitLine: {\r\n                show: true,\r\n                lineStyle: {\r\n                    color: %27#5A6378%27\r\n                }\r\n            },\r\n            data: [%27传真机%27, %27电话%27, %27打印机%27, %27电梯%27, %27摄像头%27, %27计算机%27, %27路由器%27],\r\n            axisPointer: {\r\n                type: %27shadow%27\r\n            },\r\n            axisLine: {\r\n                lineStyle: {\r\n                    color: %27#9EA3B4%27\r\n                }\r\n            }\r\n        }\r\n    ],\r\n    yAxis: [\r\n        {\r\n            type: %27value%27,\r\n            splitLine: {\r\n                show: true,\r\n                lineStyle: {\r\n                    color: %27#5A6378%27\r\n                }\r\n            },\r\n            name: %27数量%27,\r\n            min: 0,\r\n            max: 100,\r\n            interval: 20,\r\n            axisLabel: {\r\n                formatter: %27{value}%27\r\n            },\r\n            axisLine: {\r\n                lineStyle: {\r\n                    color: %27#9EA3B4%27\r\n                }\r\n            }\r\n        }, {\r\n            type: %27value%27,\r\n            name: %27比例(%)%27,\r\n            splitLine: {\r\n                show: true,\r\n                lineStyle: {\r\n                    color: %27#5A6378%27\r\n                }\r\n            },\r\n            min: 0,\r\n            max: 100,\r\n            interval: 20,\r\n            axisLabel: {\r\n                formatter: %27{value}%27\r\n            },\r\n            axisLine: {\r\n                lineStyle: {\r\n                    color: %27#9EA3B4%27\r\n                }\r\n            }\r\n        }\r\n    ],\r\n    series: [\r\n        {\r\n            name: %27数量%27,\r\n            type: %27bar%27,\r\n            data: [20, 16, 40, 70, 50, 30, 20]\r\n        }, {\r\n            name: %27比例%27,\r\n            type: %27line%27,\r\n            smooth: true,\r\n            yAxisIndex: 1,\r\n            data: [8, 6.5, 16, 28.5, 20.32, 12.2, 8],\r\n            itemStyle: {\r\n                normal: {\r\n                    color: %27#167EE8%27\r\n                }\r\n            }\r\n        }\r\n    ]\r\n};\r\nvar chart5 = echarts.init(document.getElementById(%22chart5%22));\r\nchart5.setOption(option5);\r\ndocument.getElementById(%22chart5%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27, function () {\r\n    intoLarge(%27chart5%27, option5, %27设备信息(主要故障分析)%27);\r\n});"
	}, {
		"id": 15,
		"pageId": 1,
		"title": "工单数量",
		"html": "<div class=\"chart-title\">工单数量<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart6\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option6 = {\r\n        backgroundColor: %27#3B4D65%27,\r\n        grid: {\r\n            left: 10,\r\n            bottom: %273%%27,\r\n            right: 10,\r\n            top: 60,\r\n            containLabel: true\r\n        },\r\n        legend: {\r\n            type: %27scroll%27,\r\n            data: [\r\n                { name: %27待处理%27, icon: %27circle%27 },\r\n                { name: %27处理中%27, icon: %27circle%27 },\r\n                { name: %27已完成%27, icon: %27circle%27 }\r\n            ],\r\n            textStyle: {\r\n                color: %27#D9EEF8%27\r\n            },\r\n            orient: %27horizontal%27,\r\n            right: 20,\r\n            top: 30\r\n        },\r\n        tooltip: {\r\n            trigger: %27axis%27,\r\n            axisPointer: {\r\n                type: %27shadow%27\r\n            }\r\n        },\r\n        xAxis: [\r\n            {\r\n                type: %27category%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                data: [%27周一%27, %27周二%27, %27周三%27, %27周四%27, %27周五%27, %27周六%27, %27周日%27],\r\n                axisPointer: {\r\n                    type: %27shadow%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        yAxis: [\r\n            {\r\n                type: %27value%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                name: %27数量%27,\r\n                min: 0,\r\n                max: 250,\r\n                interval: 50,\r\n                axisLabel: {\r\n                    formatter: %27{value}%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        series: [\r\n            {\r\n                name: %27待处理%27,\r\n                type: %27bar%27,\r\n                stack: %27one%27,\r\n                data: [20, 40, 100, 120, 50, 70, 175]\r\n            }, {\r\n                name: %27处理中%27,\r\n                type: %27bar%27,\r\n                stack: %27one%27,\r\n                data: [80, 60, 20, 10, 50, 30, 15]\r\n            }, {\r\n                name: %27已完成%27,\r\n                type: %27bar%27,\r\n                stack: %27one%27,\r\n                data: [20, 60, 20, 30, 50, 70, 35]\r\n            }\r\n        ]\r\n    };\r\nvar chart6 = echarts.init(document.getElementById(%22chart6%22),%27macarons%27);\r\nchart6.setOption(option6);\r\ndocument.getElementById(%22chart6%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27,function(){\r\n    intoLarge(%27chart6%27, option6,%27工单数量%27);\r\n});\r\n"
	}, {
		"id": 16,
		"pageId": 1,
		"title": "工单闭合情况",
		"html": "<div class=\"chart-title\">工单闭合情况<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart7\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option7 =  {\r\n        backgroundColor: %27#3B4D65%27,\r\n        tooltip: {\r\n            trigger: %27item%27,\r\n            formatter: %22{a} <br/>{b}: {c} ({d}%)%22\r\n        },\r\n        legend: {\r\n            type: %27plain%27,\r\n            data: [\r\n                { name: %27待处理%27, icon: %27circle%27 },\r\n                { name: %27处理中%27, icon: %27circle%27 },\r\n                { name: %27已完成%27, icon: %27circle%27 }\r\n            ],\r\n            textStyle: {\r\n                color: %27#D9EEF8%27\r\n            },\r\n            orient: %27horizontal%27,\r\n            left: 20,\r\n            bottom: 10\r\n        },\r\n        series: [\r\n            {\r\n                name: %27状态%27,\r\n                type: %27pie%27,\r\n                center: [%2750%%27, %2750%%27],\r\n                radius: [%270%%27, %2750%%27],\r\n                avoidLabelOverlap: false,\r\n                label: {\r\n                    normal: {\r\n                        show: false,\r\n                        position: %27center%27\r\n                    },\r\n                    emphasis: {\r\n                        show: true,\r\n                        textStyle: {\r\n                            fontSize: 20,\r\n                            fontWeight: %27bold%27\r\n                        }\r\n                    }\r\n                },\r\n                labelLine: {\r\n                    normal: {\r\n                        show: false\r\n                    }\r\n                },\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: function (params) {\r\n                            var colorList = [%27#D9534F%27, %27#F0AD4E%27, %27#5BC0DE%27, %27#5CB85C%27, %27#337AB7%27];\r\n                            return colorList[params.dataIndex];\r\n                        }\r\n                    }\r\n                },\r\n                data: [\r\n                    { value: 335, name: %27待处理%27 },\r\n                    { value: 310, name: %27处理中%27 },\r\n                    { value: 234, name: %27已完成%27 }\r\n                ]\r\n            }\r\n        ]\r\n    };\r\nvar chart7 = echarts.init(document.getElementById(%22chart7%22),%27macarons%27);\r\nchart7.setOption(option7);\r\ndocument.getElementById(%22chart7%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27,function(){\r\n    intoLarge(%27chart7%27, option7,%27工单闭合情况%27);\r\n});\r\n"
	}, {
		"id": 17,
		"pageId": 1,
		"title": "维修及时率",
		"html": "<div class=\"chart-title\">维修及时率<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart8\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option8 =  {\r\n        backgroundColor: %27#3B4D65%27,\r\n        grid: {\r\n            left: 10,\r\n            bottom: %273%%27,\r\n            right: 10,\r\n            top: 60,\r\n            containLabel: true\r\n        },\r\n        legend: {\r\n            type: %27plain%27,\r\n            data: [\r\n                { name: %27上月%27, icon: %27circle%27 },\r\n                { name: %27本月%27, icon: %27circle%27 }\r\n            ],\r\n            textStyle: {\r\n                color: %27#D9EEF8%27\r\n            },\r\n            orient: %27horizontal%27,\r\n            right: 20,\r\n            top: 40\r\n        },\r\n        tooltip: {\r\n            trigger: %27axis%27,\r\n            axisPointer: {\r\n                type: %27shadow%27\r\n            }\r\n        },\r\n        xAxis: [\r\n            {\r\n                type: %27category%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                data: [%27暖通%27, %27强电%27, %27弱电%27],\r\n                axisPointer: {\r\n                    type: %27shadow%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        yAxis: [\r\n            {\r\n                type: %27value%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                name: %27百分率（%）%27,\r\n                min: 0,\r\n                max: 100,\r\n                interval: 20,\r\n                axisLabel: {\r\n                    formatter: %27{value}%%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        series: [\r\n            {\r\n                name: %27上月%27,\r\n                type: %27bar%27,\r\n                data: [80, 60, 90],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: %27#70C9C4%27\r\n                    }\r\n                }\r\n            }, {\r\n                name: %27本月%27,\r\n                type: %27bar%27,\r\n                data: [70, 99, 87],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: %27#CA807F%27\r\n                    }\r\n                }\r\n            }\r\n        ]\r\n    };\r\nvar chart8 = echarts.init(document.getElementById(%22chart8%22),%27macarons%27);\r\nchart8.setOption(option8);\r\ndocument.getElementById(%22chart8%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27,function(){\r\n    intoLarge(%27chart8%27, option8,%27维修及时率%27);\r\n});"
	}, {
		"id": 18,
		"pageId": 1,
		"title": "员工完成工单数",
		"html": "<div class=\"chart-title\">员工完成工单数<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart9\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option9 = {\r\n        backgroundColor: %27#3B4D65%27,\r\n        grid: {\r\n            left: 10,\r\n            bottom: 10,\r\n            right: 10,\r\n            top: 60,\r\n            containLabel: true\r\n        },\r\n        tooltip: {\r\n            trigger: %27axis%27,\r\n            axisPointer: {\r\n                type: %27shadow%27\r\n            }\r\n        },\r\n        xAxis: [\r\n            {\r\n                type: %27category%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                data: [%27员工1%27, %27员工2%27, %27员工3%27, %27员工4%27, %27员工5%27, %27员工6%27, %27员工7%27, %27员工8%27, %27员工9%27, %27员工10%27, %27员工11%27, %27员工12%27],\r\n                axisPointer: {\r\n                    type: %27shadow%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        yAxis: [\r\n            {\r\n                type: %27value%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                name: %27数量%27,\r\n                min: 0,\r\n                max: 250,\r\n                interval: 50,\r\n                axisLabel: {\r\n                    formatter: %27{value}%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        series: [\r\n            {\r\n                name: %27工单数%27,\r\n                type: %27bar%27,\r\n                data: [26, 59, 90, 234, 245, 70, 175, 182, 48, 188, 60, 23],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: new window.echarts.graphic.LinearGradient(\r\n                            0, 0, 0, 1,\r\n                            [\r\n                                { offset: 0, color: %27#F49291%27 },\r\n                                { offset: 0.5, color: %27#C1424D%27 },\r\n                                { offset: 1, color: %27#FF0000%27 }\r\n                            ]\r\n                        )\r\n                    },\r\n                    emphasis: {\r\n                        color: new window.echarts.graphic.LinearGradient(\r\n                            0, 0, 0, 1,\r\n                            [\r\n                                { offset: 0, color: %27#FDBABA%27 },\r\n                                { offset: 0.5, color: %27#C1424D%27 },\r\n                                { offset: 1, color: %27#FF0000%27 }\r\n                            ]\r\n                        )\r\n                    }\r\n                }\r\n            }\r\n        ]\r\n    };\r\nvar chart9 = echarts.init(document.getElementById(%22chart9%22),%27macarons%27);\r\nchart9.setOption(option9);\r\ndocument.getElementById(%22chart9%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27,function(){\r\n    intoLarge(%27chart9%27, option9,%27员工完成工单数%27);\r\n});\r\n"
	}, {
		"id": 19,
		"pageId": 1,
		"title": "安全信息_use",
		"html": "<div class=\"chart-title\">安全信息(报警趋势统计)<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart10\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option10 = {\r\n    backgroundColor: %27#3B4D65%27,\r\n    grid: {\r\n        left: 10,\r\n        bottom: %273%%27,\r\n        right: 10,\r\n        top: 80,\r\n        containLabel: true\r\n    },\r\n    legend: {\r\n        type: %27scroll%27,\r\n        data: [\r\n            { name: %27正常%27, icon: %27circle%27 },\r\n            { name: %27重要%27, icon: %27circle%27 },\r\n            { name: %27紧急%27, icon: %27circle%27 }\r\n        ],\r\n        textStyle: {\r\n            color: %27#9EA3B4%27\r\n        },\r\n        orient: %27horizontal%27,\r\n        pageTextStyle: { color: %27#D9EEF8%27 },\r\n        right: 20,\r\n        top: 47\r\n    },\r\n    tooltip: {\r\n        trigger: %27axis%27,\r\n        axisPointer: {\r\n            type: %27shadow%27\r\n        }\r\n    },\r\n    xAxis: [\r\n        {\r\n            type: %27category%27,\r\n            splitLine: {\r\n                show: true,\r\n                lineStyle: {\r\n                    color: %27#5A6378%27\r\n                }\r\n            },\r\n            data: [%27周一%27, %27周二%27, %27周三%27, %27周四%27, %27周五%27, %27周六%27, %27周日%27],\r\n            axisPointer: {\r\n                type: %27shadow%27\r\n            },\r\n            axisLine: {\r\n                lineStyle: {\r\n                    color: %27#9EA3B4%27\r\n                }\r\n            },\r\n            splitArea : {show : false},\r\n        }\r\n    ],\r\n    yAxis: [\r\n        {\r\n            type: %27value%27,\r\n            splitLine: {\r\n                show: true,\r\n                lineStyle: {\r\n                    color: %27#5A6378%27\r\n                }\r\n            },\r\n            name: %27数量%27,\r\n            min: 0,\r\n            max: 60,\r\n            interval: 20,\r\n            axisLabel: {\r\n                formatter: %27{value}%27\r\n            },\r\n            axisLine: {\r\n                lineStyle: {\r\n                    color: %27#9EA3B4%27\r\n                }\r\n            },\r\n            splitArea : {show : false},\r\n        }\r\n    ],\r\n    series: [\r\n        {\r\n            name: %27正常%27,\r\n            type: %27line%27,\r\n            smooth: true,\r\n            data: [20, 35, 20, 35, 26, 17, 28],\r\n            itemStyle: {\r\n                normal: {\r\n                    color: %27#5FE3A1%27\r\n                }\r\n            }\r\n        }, {\r\n            name: %27重要%27,\r\n            type: %27line%27,\r\n            smooth: true,\r\n            data: [32, 28, 46, 22, 30, 22, 32],\r\n            itemStyle: {\r\n                normal: {\r\n                    color: %27#FFDA83%27\r\n                }\r\n            }\r\n        }, {\r\n            name: %27紧急%27,\r\n            type: %27line%27,\r\n            smooth: true,\r\n            data: [28, 22, 32, 16, 18, 30, 16],\r\n            itemStyle: {\r\n                normal: {\r\n                    color: %27#FF8373%27\r\n                }\r\n            }\r\n        }\r\n    ]\r\n};\r\nvar chart10 = echarts.init(document.getElementById(%22chart10%22), %27macarons%27);\r\nchart10.setOption(option10);\r\ndocument.getElementById(%22chart10%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27, function () {\r\n    intoLarge(%27chart10%27, option10, %27安全信息(报警趋势统计)%27);\r\n});"
	}, {
		"id": 20,
		"pageId": 1,
		"title": "报警趋势统计",
		"html": "<div class=\"chart-title\">报警趋势统计(前五位)<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart11\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option11 = {\r\n        backgroundColor: %27#3B4D65%27,\r\n        grid: {\r\n            left: 10,\r\n            bottom: 10,\r\n            right: 10,\r\n            top: 60,\r\n            containLabel: true\r\n        },\r\n        legend: {\r\n            type: %27scroll%27,\r\n            data: [\r\n                { name: %27一级%27, icon: %27circle%27 },\r\n                { name: %27二级%27, icon: %27circle%27 },\r\n                { name: %27三级%27, icon: %27circle%27 },\r\n                { name: %27四级%27, icon: %27circle%27 },\r\n                { name: %27五级%27, icon: %27circle%27 }\r\n            ],\r\n            textStyle: {\r\n                color: %27#D9EEF8%27\r\n            },\r\n            orient: %27horizontal%27,\r\n            pageTextStyle: { color: %27#D9EEF8%27 },\r\n            left: 60,\r\n            top: 30\r\n        },\r\n        tooltip: {\r\n            trigger: %27axis%27,\r\n            axisPointer: {\r\n                type: %27shadow%27\r\n            }\r\n        },\r\n        xAxis: [\r\n            {\r\n                type: %27category%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                data: [%27消防系统%27, %27冷机群控系统%27, %27给排水系统%27],\r\n                axisPointer: {\r\n                    type: %27shadow%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        yAxis: [\r\n            {\r\n                type: %27value%27,\r\n                splitLine: {\r\n                    show: true,\r\n                    lineStyle: {\r\n                        color: %27#5A6378%27\r\n                    }\r\n                },\r\n                name: %27kwh%27,\r\n                min: 0,\r\n                max: 400,\r\n                interval: 100,\r\n                axisLabel: {\r\n                    formatter: %27{value}%27\r\n                },\r\n                axisLine: {\r\n                    lineStyle: {\r\n                        color: %27#ffffff%27\r\n                    }\r\n                }\r\n            }\r\n        ],\r\n        series: [\r\n            {\r\n                name: %27一级%27,\r\n                type: %27bar%27,\r\n                stack: %27one%27,\r\n                data: [50, 59, 90],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: %27#D9534F%27\r\n                    }\r\n                }\r\n            }, {\r\n                name: %27二级%27,\r\n                type: %27bar%27,\r\n                stack: %27one%27,\r\n                data: [50, 59, 70],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: %27#F0AD4E%27\r\n                    }\r\n                }\r\n            }, {\r\n                name: %27三级%27,\r\n                type: %27bar%27,\r\n                stack: %27one%27,\r\n                data: [28, 70, 75],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: %27#5BC0DE%27\r\n                    }\r\n                }\r\n            }, {\r\n                name: %27四级%27,\r\n                type: %27bar%27,\r\n                stack: %27one%27,\r\n                data: [80, 50, 43],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: %27#5CB85C%27\r\n                    }\r\n                }\r\n            }, {\r\n                name: %27五级%27,\r\n                type: %27bar%27,\r\n                stack: %27one%27,\r\n                data: [40, 20, 13],\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: %27#337AB7%27\r\n                    }\r\n                }\r\n            }\r\n        ]\r\n    };\r\nvar chart11 = echarts.init(document.getElementById(%22chart11%22),%27macarons%27);\r\nchart11.setOption(option11);\r\ndocument.getElementById(%22chart11%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27,function(){\r\n    intoLarge(%27chart11%27, option11,%27报警趋势统计(前五位)%27);\r\n});\r\n"
	}, {
		"id": 21,
		"pageId": 1,
		"title": "ajax示例",
		"html": "<div id=\"grid1\"></div>",
		"css": "",
		"js": "function getItemMenu(pageid) {\r\n    var res;\r\n    $.ajax({\r\n        url: %27../../../api?q=PageLayoutItem.GetList%27,\r\n        type: %27get%27,\r\n        data: { pageId: pageid },\r\n        dataType: %27json%27,\r\n        async: false,\r\n        success: function (r) {\r\n            //console.log(r);\r\n            res = r;\r\n        },\r\n        error: function (r) {\r\n            console.log(r);\r\n        }\r\n    });\r\n    return res;\r\n}\r\ndocument.getElementById(%27grid1%27).innerHTML=JSON.stringify(getItemMenu(1));"
	}, {
		"id": 22,
		"pageId": 1,
		"title": "提醒信息_use",
		"html": "<div class=\"chart-title\">提醒信息<span onclick=\"openOrder();\">更多</span></div>\r\n<div class=\"cockpit\" style=\"padding-top:38px;\">\r\n\t<table class=\"cockpit-chart0 chart_0\" style=\"width:100%;\">\r\n\t\t<tr>\r\n\t\t\t<td title=\"综合楼一楼2号电梯出现故障，请立即前往处理。\">综合楼一楼2号电梯出现故障，请立即前往处理。</td>\r\n\t\t\t<td class=\"btn\" onclick=\"openOrder(1);\">立即处理</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td title=\"距二号水箱检修还有2天\">距二号水箱检修还有2天</td>\r\n\t\t\t<td class=\"btn\" onclick=\"openOrder(2);\">立即处理</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td title=\"维修工单（ID:0106-015）超期4天，未注明原因\">维修工单（ID:0106-015）超期4天，未注明原因</td>\r\n\t\t\t<td class=\"btn\" onclick=\"openOrder(3);\">立即处理</td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>",
		"css": ".chart-title span{float:right;color: #02A1F5;padding-right:8px;font-weight: normal;font-size: 14px;}\r\n.cockpit h1 {\r\n    top: 0;\r\n    left: 20px;\r\n    color: #D9EEF8;\r\n    font-size: 16px;\r\n    font-weight: bold;\r\n    text-align: left;\r\n}\r\n.cockpit td:nth-child(odd) {\r\n    color: white;\r\n    font-size: 14px;\r\n}\r\n.cockpit td {\r\n    white-space: nowrap;\r\n    width: 40%;\r\n    font-size: 14px;\r\n    overflow: hidden;\r\n    display: inline-block;\r\n    text-overflow: ellipsis;\r\n    background: none;\r\n    text-align: left;\r\n}\r\n.cockpit td {\r\n    line-height: 200%;\r\n}\r\ntd, th {\r\n    padding: 0;\r\n}\r\n.cockpit td.btn {\r\n    color: #02A1F5;\r\n    cursor: pointer;\r\n    padding: 0;\r\n}\r\n.cockpit .chart_0 td:first-child {width: 80%;text-align: left}\r\n\r\n.cockpit .chart_0 td:last-child{width: 20%;text-align: right;padding: 0;}\r\n.cockpit-chart0,.cockpit-chart0 tbody,.cockpit-chart0 tr{display: block;font-size: 0;}",
		"js": "pageInit();\r\nfunction pageInit(){\r\n    $(%22#grid1%22).jqGrid({\r\n        url:%27data/JSONData.json%27,\r\n        datatype:%22json%22,\r\n        colNames:[%27Inv No%27,%27Date%27,%27Client%27,%27Amount%27,%27Tax%27,%27Total%27,%27Notes%27],\r\n        colModel:[\r\n            {name:%27id%27,index:%27id%27,width:55},{name:%27invdate%27,index:%27invdate%27,width:90},\r\n            {name:%27name%27,index:%27name asc, invdate%27,width:100},\r\n            {name:%27amount%27,index:%27amount%27,width:80,align:%22right%22},\r\n            {name:%27tax%27,index:%27tax%27,width:80,align:%22right%22},\r\n            {name:%27total%27,index:%27total%27,width:80,align:%22right%22},\r\n            {name:%27note%27,index:%27note%27,width:150,sortable:false}\r\n        ],\r\n        rowNum:10,\r\n        rowList:[10,20,30],\r\n        sortname:%27id%27,\r\n        sortorder:%22desc%22,\r\n        mtype:%22get%22,\r\n        viewrecords:true,\r\n        autowidth:true,\r\n        height:$(%27#grid1%27).height(),\r\n        caption:%22提醒信息%22\r\n    });\r\n}"
	}, {
		"id": 23,
		"pageId": 1,
		"title": "资产信息_use",
		"html": "<div class=\"chart-title\">资产信息(关键指标)</div>\r\n<div class=\"cockpit\" style=\"padding-top:38px;\">\t\r\n\t<table class=\"cockpit-chart1 chart_1\" style=\"width: 100%; font-size: 0;\">\r\n\t\t<tr>\r\n\t\t\t<td title=\"资产总额\">资产总额：</td>\r\n\t\t\t<td title=\"3907.9万元\">3907.9万元</td>\r\n\t\t\t<td title=\"检修保养\">检修保养：</td>\r\n\t\t\t<td title=\"2台\">2台</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td title=\"资产总量\">资产总量：</td>\r\n\t\t\t<td title=\"8615\">8615</td>\r\n\t\t\t<td title=\"运行设备\">运行设备：</td>\r\n\t\t\t<td title=\"23台\">23台</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td title=\"本日耗电量\">本日耗电量：</td>\r\n\t\t\t<td title=\"9863kW·h\">9863kW·h</td>\r\n\t\t\t<td title=\"维护保养\">维护保养：</td>\r\n\t\t\t<td title=\"1台\">1台</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td title=\"本月能耗费用\">本月能耗费用：</td>\r\n\t\t\t<td title=\"￥80，289.89\">￥80,289.89</td>\r\n\t\t\t<td></td>\r\n\t\t\t<td></td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>",
		"css": ".cockpit .chart_1 td:nth-child(odd){width: 30%;color: #9EA3B4;}\r\n.chart_1 td:nth-child(2){width: 30%}\r\n.chart_1 td:last-child{width: 10%}",
		"js": ""
	}, {
		"id": 25,
		"pageId": 1,
		"title": "unity_use",
		"html": "<div id=\"unityContainer\" class=\"unity-container\"></div>",
		"css": ".unity-container{\r\n    height: 100%;\r\n    background-color: #3B4D65;\r\n    border-radius: 3px;\r\n    overflow: hidden;\r\n}",
		"js": ""
	}, {
		"id": 30,
		"pageId": 1,
		"title": "示例",
		"html": "<div class=\"chart-title\">工单闭合情况<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart7\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option7 =  {\r\n        backgroundColor: %27#3B4D65%27,\r\n        tooltip: {\r\n            trigger: %27item%27,\r\n            formatter: %22{a} <br/>{b}: {c} ({d}%)%22\r\n        },\r\n        legend: {\r\n            type: %27plain%27,\r\n            data: [\r\n                { name: %27待处理%27, icon: %27circle%27 },\r\n                { name: %27处理中%27, icon: %27circle%27 },\r\n                { name: %27已完成%27, icon: %27circle%27 }\r\n            ],\r\n            textStyle: {\r\n                color: %27#D9EEF8%27\r\n            },\r\n            orient: %27horizontal%27,\r\n            left: 20,\r\n            bottom: 10\r\n        },\r\n        series: [\r\n            {\r\n                name: %27状态%27,\r\n                type: %27pie%27,\r\n                center: [%2750%%27, %2750%%27],\r\n                radius: [%270%%27, %2750%%27],\r\n                avoidLabelOverlap: false,\r\n                label: {\r\n                    normal: {\r\n                        show: false,\r\n                        position: %27center%27\r\n                    },\r\n                    emphasis: {\r\n                        show: true,\r\n                        textStyle: {\r\n                            fontSize: 20,\r\n                            fontWeight: %27bold%27\r\n                        }\r\n                    }\r\n                },\r\n                labelLine: {\r\n                    normal: {\r\n                        show: false\r\n                    }\r\n                },\r\n                itemStyle: {\r\n                    normal: {\r\n                        color: function (params) {\r\n                            var colorList = [%27#D9534F%27, %27#F0AD4E%27, %27#5BC0DE%27, %27#5CB85C%27, %27#337AB7%27];\r\n                            return colorList[params.dataIndex];\r\n                        }\r\n                    }\r\n                },\r\n                data: [\r\n                    { value: 335, name: %27待处理%27 },\r\n                    { value: 310, name: %27处理中%27 },\r\n                    { value: 234, name: %27已完成%27 }\r\n                ]\r\n            }\r\n        ]\r\n    };\r\nvar chart7 = echarts.init(document.getElementById(%22chart7%22));\r\nchart7.setOption(option7);\r\ndocument.getElementById(%22chart7%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27,function(){\r\n    intoLarge(%27chart7%27, option7,%27工单闭合情况%27);\r\n});\r\n"
	}, {
		"id": 31,
		"pageId": 1,
		"title": "示例2",
		"html": "<div class=\"chart-title\">工单闭合情况<span class=\"iconfont icon-enlarge\"></span></div>\r\n<div id=\"chart7\" class=\"chart-style\"></div>",
		"css": "",
		"js": "var option7 =  {\r\n        grid: {\r\n            top: 100,\r\n            left: 10,\r\n            right: 10,\r\n            bottom: 10,\r\n            containLabel: true\r\n        },\r\n        backgroundColor: %27#3B4D65%27,\r\n        tooltip: {\r\n            trigger: %27item%27,\r\n            formatter: %22{a}<br>{b}: {c} ({d}%)%22\r\n        },\r\n        legend: {\r\n            type: %27scroll%27,\r\n            data: [\r\n                { name: %27食堂%27, icon: %27circle%27 },\r\n                { name: %27车库%27, icon: %27circle%27 },\r\n                { name: %27变电所%27, icon: %27circle%27 },\r\n                { name: %27仓库%27, icon: %27circle%27 },\r\n                { name: %27其他%27, icon: %27circle%27 },\r\n                { name: %27综合楼%27, icon: %27circle%27 }\r\n            ],\r\n            textStyle: {\r\n                color: %27#D9EEF8%27\r\n            },\r\n            pageTextStyle: { color:%27#D9EEF8%27},\r\n            orient: %27horizontal%27,\r\n            left: 20,\r\n            bottom: 10\r\n        },\r\n        series: [\r\n            {\r\n                name: %27房屋面积：%27,\r\n                type: %27pie%27,\r\n                center: [%2750%%27, %2750%%27],\r\n                radius: [%2740%%27, %2765%%27],\r\n                avoidLabelOverlap: false,\r\n                label: {\r\n                    normal: {\r\n                        show: false,\r\n                        position: %27center%27\r\n                    },\r\n                    emphasis: {\r\n                        show: true,\r\n                        textStyle: {\r\n                            fontSize: 16,\r\n                            fontWeight: %27bold%27\r\n                        }\r\n                    }\r\n                },\r\n                labelLine: {\r\n                    normal: {\r\n                        show: false\r\n                    }\r\n                },\r\n                data: [\r\n                    { value: 335, name: %27食堂%27 },\r\n                    { value: 310, name: %27车库%27 },\r\n                    { value: 234, name: %27变电所%27 },\r\n                    { value: 135, name: %27仓库%27 },\r\n                    { value: 1548, name: %27其他%27 },\r\n                    { value: 135, name: %27综合楼%27 }\r\n                ]\r\n            }\r\n        ]\r\n    };\r\nvar chart7 = echarts.init(document.getElementById(%22chart7%22));\r\nchart7.setOption(option7);\r\ndocument.getElementById(%22chart7%22).previousElementSibling.querySelector(%27.icon-enlarge%27).addEventListener(%27click%27,function(){\r\n    intoLarge(%27chart7%27, option7,%27工单闭合情况%27);\r\n});\r\n"
	}];
	return res;
}

function getLayoutData(pageid) {
	var res;
	//  $.ajax({
	//      url: '../../BIDashBoard/GetPageLayout',
	//      type: 'post',
	//      data: { id: pageid },
	//      dataType: 'json',
	//      async: false,
	//      success: function (r) {
	//          //console.log(r);
	//          res = r;
	//      },
	//      error: function (r) {
	//          console.log(r);
	//      }
	//  });
	res = {
		"id": 1,
		"title": "BIM驾驶舱",
		"remark": "",
		"layoutData": "[{\"type\":0,\"layouts\":[{\"itemid\":0,\"x\":0,\"y\":28,\"w\":7,\"h\":18,\"i\":\"2\"},{\"itemid\":14,\"x\":9,\"y\":0,\"w\":3,\"h\":14,\"i\":\"4\"},{\"itemid\":23,\"x\":0,\"y\":0,\"w\":3,\"h\":14,\"i\":\"6\"},{\"itemid\":22,\"x\":0,\"y\":14,\"w\":3,\"h\":14,\"i\":\"10\"},{\"itemid\":2,\"x\":7,\"y\":28,\"w\":5,\"h\":18,\"i\":\"11\"},{\"itemid\":19,\"x\":9,\"y\":14,\"w\":3,\"h\":14,\"i\":\"12\"},{\"itemid\":25,\"x\":3,\"y\":0,\"w\":6,\"h\":28,\"i\":\"14\"}]},{\"type\":1,\"layouts\":[{\"itemid\":22,\"x\":0,\"y\":14,\"w\":3,\"h\":14,\"i\":\"1\"},{\"itemid\":2,\"x\":7,\"y\":28,\"w\":5,\"h\":17,\"i\":\"3\"},{\"itemid\":0,\"x\":0,\"y\":28,\"w\":7,\"h\":17,\"i\":\"4\"},{\"itemid\":19,\"x\":9,\"y\":14,\"w\":3,\"h\":14,\"i\":\"5\"},{\"itemid\":23,\"x\":0,\"y\":0,\"w\":3,\"h\":14,\"i\":\"6\"},{\"itemid\":14,\"x\":9,\"y\":0,\"w\":3,\"h\":14,\"i\":\"8\"},{\"itemid\":25,\"x\":3,\"y\":0,\"w\":6,\"h\":28,\"i\":\"9\"}]}]",
		"html": "<div id=\"itemDialog\" class=\"item-dialog\"></div>\r\n",
		"css": "/* 弹窗 */\r\n.item-dialog{\r\n    position: fixed;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgba(0, 0, 0, .5);\r\n    display: none;\r\n} \r\n.chart-dialog-container{\r\n    position: absolute;\r\n    left: 10%;\r\n    top:10%;\r\n    right: 10%;\r\n    bottom: 10%;\r\n}\r\n/* 滚动条样式 */\r\n::-webkit-scrollbar{width:4px;height:4px}\r\n::-webkit-scrollbar-button{display:none}\r\n::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.2);}\r\n::-webkit-scrollbar-corner{background:none}\r\n/*\r\n::-webkit-scrollbar{width:14px;height:14px}\r\n::-webkit-scrollbar-button{display:none}\r\n::-webkit-scrollbar-thumb{\r\n    border:1px solid #1D92CE;\r\n    background:no-repeat center center;\r\n    background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyNjYyNDkzMTg5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg3NCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik01MTAuODk0ODI5MDYgNTA5Ljg3ODY4NTk4bS00NDUuNjMwNDA3MDQgMGE0MzUuNDgxIDQzNS40ODEgMCAxIDAgODkxLjI2MDgxMjk2IDAgNDM1LjQ4MSA0MzUuNDgxIDAgMSAwLTg5MS4yNjA4MTI5NiAwWiIgZmlsbD0iIzEyOTZkYiIgcC1pZD0iODc1Ij48L3BhdGg+PC9zdmc+\");\r\n    background-size:6px;\r\n}\r\n::-webkit-scrollbar-corner{background:none}*/\r\n/*公共样式*/\r\n.chart-style{\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n.cockpit{\r\n    background: #3B4D65;\r\n    width: 100%;\r\n    height: 100%;\r\n    box-sizing: border-box;\r\n    padding:6px; \r\n}\r\n.cockpit h1 {\r\n    top: 0;\r\n    left: 20px;\r\n    color: #D9EEF8;\r\n    font-size: 16px;\r\n    font-weight: bold;\r\n    text-align: left;\r\n}\r\n.cockpit .cockpit-chart0 td:first-child {\r\n    width: 60%;\r\n}\r\n.cockpit td:nth-child(odd) {\r\n    color: #9EA3B4;\r\n    font-size: 14px;\r\n}\r\n.cockpit .cockpit-chart0 td:nth-child(2) {\r\n    padding-right: 16px;\r\n    box-sizing: border-box;\r\n}\r\n.cockpit td:nth-child(even) {\r\n    color: #fff;\r\n    font-size: 14px;\r\n}\r\n.cockpit td.btn {\r\n    color: #02A1F5;\r\n    cursor: pointer;\r\n    padding: 0;\r\n}\r\n.cockpit h2 {\r\n    color: #D9EEF8;\r\n    font-size: 18px;\r\n    margin-top: 40px;\r\n}\r\n\r\n.cockpit td {\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    display: inline-block;\r\n    text-overflow: ellipsis;\r\n    background: none;\r\n    line-height: 200%;\r\n}\r\n.cockpit .cockpit-chart1 td {\r\n    width: 25%;\r\n}\r\n.cockpit tr,.cockpit td{padding: 0}\r\n.chart-title{\r\n    line-height: 2.4;\r\n    font-weight: 500;\r\n    color: white;\r\n    text-align: left;\r\n    font-size: 1rem;\r\n    padding-left: 8px;\r\n    background-color:#38485F;\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    z-index: 200;\r\n    box-sizing: border-box;\r\n}\r\n.chart-title span.iconfont,.chart-title-large span.iconfont{\r\n    background: none;\r\n    float: right;\r\n    margin: 4px 0 0;\r\n    font-size: 20px;\r\n    display: block;\r\n    width: 30px;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    text-align: center;\r\n    color: white;\r\n    border-radius: 30px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease-in-out;\r\n    text-indent: 0;\r\n    box-shadow: none;\r\n}\r\n.chart-title-large{\r\n    width:100%;\r\n    line-height: 2.4;\r\n    font-weight: bold;\r\n    color: white;\r\n    text-align: left;\r\n    font-size: 1rem;\r\n    background-color:rgba(0, 0, 0, .2);\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    z-index: 200;\r\n    text-indent: 8px;\r\n}\r\n.vue-grid-item{border-radius: 3px;overflow: hidden}",
		"js": "$(window).on(%27resize%27, function () {\r\n    throttle(scrollFn);\r\n});\r\n\r\nfunction scrollFn() {\r\n    var ii = 0;\r\n    for (var i = 0; i < 20; i++) {\r\n        if (document.getElementById(%22chart%22 + i)) {\r\n            echarts.init(document.getElementById(%22chart%22 + i)).resize();\r\n            console.log(%27resize:%27 + (ii++));\r\n        }\r\n    }\r\n}\r\n\r\nfunction throttle(method, context) {\r\n    clearTimeout(method.tId);\r\n    method.tId = setTimeout(function () {\r\n        method.call(context)\r\n    }, 500)\r\n}\r\n\r\n\r\nvar unityL = 0;\r\nvar unityT = 0;\r\nvar unityW = 0;\r\nvar unityH = 0;\r\n\r\n\r\nsetInterval(function () {\r\n    var $unityContainer = $(%27#unityContainer%27);\r\n    if (!$unityContainer.length) { return };\r\n    var curUnityL = $unityContainer.offset().left + 0;\r\n    var curUnityT = $unityContainer.offset().top + 60;\r\n    var curUnityW = $unityContainer.width();\r\n    var curUnityH = $unityContainer.height();\r\n\r\n    if (unityL !== curUnityL || unityT !== curUnityT || unityW !== curUnityW || unityH !== curUnityH) {\r\n        //console.log(11)\r\n        unityL = curUnityL;\r\n        unityT = curUnityT;\r\n        unityW = curUnityW;\r\n        unityH = curUnityH;\r\n        window.top.resizeUnity({\r\n            top: unityT,\r\n            width: unityW,\r\n            height: unityH,\r\n            left: unityL\r\n        });\r\n    }\r\n\r\n}, 100);\r\n\r\nfunction intoLarge(ele, options, title) {\r\n    var isUpdatetitle = true;\r\n    var grid = {\r\n        top: 80,\r\n        left: 120,\r\n        bottom: 90,\r\n        right: %2750%%27\r\n    };\r\n    console.log(title);\r\n    //options.toolbox.feature.myensmall.show=true;\r\n    //options.toolbox.feature.myenlarge.show=false;\r\n    $(%27#itemDialog%27).show().html(%27<div class=%22chart-dialog-container%22><div class=%22chart-title-large%22>%27+title+%27<span class=%22iconfont icon-ensmall%22 onclick=%22intoSmall()%22></span></div><div id=%22intoLarge_%27 + ele + %27%22 style=%22width:100%;height:100%;%22></div></div>%27);\r\n    var largeChart = echarts.init(document.getElementById(%27intoLarge_%27 + ele));\r\n    largeChart.setOption(options);\r\n    window.top.resizeUnity({\r\n        height: 0\r\n    });\r\n}\r\nfunction intoSmall() {\r\n    $(%27#itemDialog%27).hide().html(%27%27);\r\n    if (window.top.resizeUnity) {\r\n        window.top.resizeUnity({\r\n            height: unityH\r\n        });\r\n    }\r\n\r\n}\r\n// unity初始化镜头至整栋楼\r\nif (window.parent.RegPageReadyFun) {\r\n    window.parent.RegPageReadyFun(function () {\r\n        window.parent.getUnityWindow().SwitchScene(%22qdg.scene%22, localStorage.buildingid, %22%22);\r\n    });\r\n}\r\nfunction changeEchart1(floorname, dimension) {\r\n    var chart1 = echarts.init(document.getElementById(%22chart1%22), %27macarons%27);\r\n    var total = 0;\r\n    chart1.getOption().dataset[0].source.forEach(function (item) {\r\n        if (typeof item[dimension] === %27number%27) {\r\n            total += item[dimension];\r\n        }\r\n    });\r\n    chart1.setOption({\r\n        title: {\r\n            text: floorname\r\n        },\r\n        series: [\r\n            {\r\n                id: %27pie3%27,\r\n                data: [{ name: %27总面积%27, value: total }]\r\n            }, {\r\n                id: %27pie%27,\r\n                label: {\r\n                    formatter: %27{@%27 + floorname + %27}㎡%27\r\n                },\r\n                encode: {\r\n                    value: dimension,\r\n                    tooltip: dimension\r\n                }\r\n            }, {\r\n                id: %27pie2%27,\r\n                encode: {\r\n                    value: dimension,\r\n                    tooltip: dimension\r\n                }\r\n            }\r\n        ]\r\n    });\r\n    /*缩放dataZoom*/\r\n    var _floorNum = (dimension - 1) * 6;\r\n    chart1.dispatchAction({\r\n        type: %27dataZoom%27,\r\n        start: _floorNum,\r\n        end: _floorNum\r\n    });\r\n}\r\nfunction openOrder(id){\r\n    top.$topNav.find(%27a%27).filter(function(){\r\n        return $(this).text()===%27维保工单%27;\r\n    }).trigger(%27click%27);\r\n    if(id){\r\n        localStorage.orderid=id;\r\n    }\r\n}"
	};
	return res;
}

function updateLayoutData(pageid, layoutDatas) {
	if(isHasType) {
		totalLayoutData.forEach(function(item) {
			if(item.type === type) {
				item.layouts = layoutDatas;
			}
		});
	} else {
		totalLayoutData.push({
			type: type,
			layouts: layoutDatas
		});
	}
	var jsonModel = {
		remark: '',
		title: 'BIM驾驶舱',
		layoutData: JSON.stringify(totalLayoutData)
	};
	$.ajax({
		url: '../../BIDashBoard/PageLayoutUpdate',
		type: 'post',
		data: {
			id: pageid,
			jsonModel: JSON.stringify(jsonModel)
		},
		dataType: 'json',
		async: false,
		success: function(r) {
			alert('保存成功！');
		},
		error: function(r) {
			console.log(r);
		}
	});
}

function deepCopy(o) {
	var n;
	var i;
	if(o instanceof Array) {
		n = [];
		for(i = 0; i < o.length; ++i) {
			n[i] = deepCopy(o[i]);
		}
		return n;
	} else if(o instanceof Function) {
		n = new Function("return " + o.toString())();
		return n;
	} else if(o instanceof Object) {
		n = {};
		for(i in o) {
			if(o.hasOwnProperty(i)) {
				n[i] = deepCopy(o[i]);
			}
		}
		return n;
	} else {
		return o;
	}
}

function mergeData() {
	var datas = deepCopy(layoutOption.layouts);
	datas.forEach(function(item) {
		testList.forEach(function(itemin, index) {
			if(item.itemid === itemin.id) {
				item = Object.assign(item, itemin);
				testList.splice(index, 1);
			}
		});
	});

	return datas;
}

function encode(string) {
	return string.replace(/\'/g, '%27').replace(/\"/g, '%22');
}

function decode(string) {
	return string.replace(/%27/g, "'").replace(/%22/g, '"');
}
getPublicEditDatas(pageid);

function getPublicEditDatas(pageid) {
	//	$.ajax({
	//		url: '../../BIDashBoard/GetPageLayout',
	//		type: 'post',
	//		data: {
	//			id: pageid
	//		},
	//		dataType: 'json',
	//		async: false,
	//		success: function(r) {
	//console.log(r);
	r = {
		"id": 1,
		"title": "BIM驾驶舱",
		"remark": "",
		"layoutData": "[{\"type\":0,\"layouts\":[{\"itemid\":0,\"x\":0,\"y\":28,\"w\":7,\"h\":18,\"i\":\"2\"},{\"itemid\":14,\"x\":9,\"y\":0,\"w\":3,\"h\":14,\"i\":\"4\"},{\"itemid\":23,\"x\":0,\"y\":0,\"w\":3,\"h\":14,\"i\":\"6\"},{\"itemid\":22,\"x\":0,\"y\":14,\"w\":3,\"h\":14,\"i\":\"10\"},{\"itemid\":2,\"x\":7,\"y\":28,\"w\":5,\"h\":18,\"i\":\"11\"},{\"itemid\":19,\"x\":9,\"y\":14,\"w\":3,\"h\":14,\"i\":\"12\"},{\"itemid\":25,\"x\":3,\"y\":0,\"w\":6,\"h\":28,\"i\":\"14\"}]},{\"type\":1,\"layouts\":[{\"itemid\":22,\"x\":0,\"y\":14,\"w\":3,\"h\":14,\"i\":\"1\"},{\"itemid\":2,\"x\":7,\"y\":28,\"w\":5,\"h\":17,\"i\":\"3\"},{\"itemid\":0,\"x\":0,\"y\":28,\"w\":7,\"h\":17,\"i\":\"4\"},{\"itemid\":19,\"x\":9,\"y\":14,\"w\":3,\"h\":14,\"i\":\"5\"},{\"itemid\":23,\"x\":0,\"y\":0,\"w\":3,\"h\":14,\"i\":\"6\"},{\"itemid\":14,\"x\":9,\"y\":0,\"w\":3,\"h\":14,\"i\":\"8\"},{\"itemid\":25,\"x\":3,\"y\":0,\"w\":6,\"h\":28,\"i\":\"9\"}]}]",
		"html": "<div id=\"itemDialog\" class=\"item-dialog\"></div>\r\n",
		"css": "/* 弹窗 */\r\n.item-dialog{\r\n    position: fixed;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background-color: rgba(0, 0, 0, .5);\r\n    display: none;\r\n} \r\n.chart-dialog-container{\r\n    position: absolute;\r\n    left: 10%;\r\n    top:10%;\r\n    right: 10%;\r\n    bottom: 10%;\r\n}\r\n/* 滚动条样式 */\r\n::-webkit-scrollbar{width:4px;height:4px}\r\n::-webkit-scrollbar-button{display:none}\r\n::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.2);}\r\n::-webkit-scrollbar-corner{background:none}\r\n/*\r\n::-webkit-scrollbar{width:14px;height:14px}\r\n::-webkit-scrollbar-button{display:none}\r\n::-webkit-scrollbar-thumb{\r\n    border:1px solid #1D92CE;\r\n    background:no-repeat center center;\r\n    background-image: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyNjYyNDkzMTg5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg3NCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik01MTAuODk0ODI5MDYgNTA5Ljg3ODY4NTk4bS00NDUuNjMwNDA3MDQgMGE0MzUuNDgxIDQzNS40ODEgMCAxIDAgODkxLjI2MDgxMjk2IDAgNDM1LjQ4MSA0MzUuNDgxIDAgMSAwLTg5MS4yNjA4MTI5NiAwWiIgZmlsbD0iIzEyOTZkYiIgcC1pZD0iODc1Ij48L3BhdGg+PC9zdmc+\");\r\n    background-size:6px;\r\n}\r\n::-webkit-scrollbar-corner{background:none}*/\r\n/*公共样式*/\r\n.chart-style{\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n.cockpit{\r\n    background: #3B4D65;\r\n    width: 100%;\r\n    height: 100%;\r\n    box-sizing: border-box;\r\n    padding:6px; \r\n}\r\n.cockpit h1 {\r\n    top: 0;\r\n    left: 20px;\r\n    color: #D9EEF8;\r\n    font-size: 16px;\r\n    font-weight: bold;\r\n    text-align: left;\r\n}\r\n.cockpit .cockpit-chart0 td:first-child {\r\n    width: 60%;\r\n}\r\n.cockpit td:nth-child(odd) {\r\n    color: #9EA3B4;\r\n    font-size: 14px;\r\n}\r\n.cockpit .cockpit-chart0 td:nth-child(2) {\r\n    padding-right: 16px;\r\n    box-sizing: border-box;\r\n}\r\n.cockpit td:nth-child(even) {\r\n    color: #fff;\r\n    font-size: 14px;\r\n}\r\n.cockpit td.btn {\r\n    color: #02A1F5;\r\n    cursor: pointer;\r\n    padding: 0;\r\n}\r\n.cockpit h2 {\r\n    color: #D9EEF8;\r\n    font-size: 18px;\r\n    margin-top: 40px;\r\n}\r\n\r\n.cockpit td {\r\n    white-space: nowrap;\r\n    overflow: hidden;\r\n    display: inline-block;\r\n    text-overflow: ellipsis;\r\n    background: none;\r\n    line-height: 200%;\r\n}\r\n.cockpit .cockpit-chart1 td {\r\n    width: 25%;\r\n}\r\n.cockpit tr,.cockpit td{padding: 0}\r\n.chart-title{\r\n    line-height: 2.4;\r\n    font-weight: 500;\r\n    color: white;\r\n    text-align: left;\r\n    font-size: 1rem;\r\n    padding-left: 8px;\r\n    background-color:#38485F;\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    width: 100%;\r\n    z-index: 200;\r\n    box-sizing: border-box;\r\n}\r\n.chart-title span.iconfont,.chart-title-large span.iconfont{\r\n    background: none;\r\n    float: right;\r\n    margin: 4px 0 0;\r\n    font-size: 20px;\r\n    display: block;\r\n    width: 30px;\r\n    height: 30px;\r\n    line-height: 30px;\r\n    text-align: center;\r\n    color: white;\r\n    border-radius: 30px;\r\n    cursor: pointer;\r\n    transition: all 0.2s ease-in-out;\r\n    text-indent: 0;\r\n    box-shadow: none;\r\n}\r\n.chart-title-large{\r\n    width:100%;\r\n    line-height: 2.4;\r\n    font-weight: bold;\r\n    color: white;\r\n    text-align: left;\r\n    font-size: 1rem;\r\n    background-color:rgba(0, 0, 0, .2);\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    z-index: 200;\r\n    text-indent: 8px;\r\n}\r\n.vue-grid-item{border-radius: 3px;overflow: hidden}",
		"js": "$(window).on(%27resize%27, function () {\r\n    throttle(scrollFn);\r\n});\r\n\r\nfunction scrollFn() {\r\n    var ii = 0;\r\n    for (var i = 0; i < 20; i++) {\r\n        if (document.getElementById(%22chart%22 + i)) {\r\n            echarts.init(document.getElementById(%22chart%22 + i)).resize();\r\n            console.log(%27resize:%27 + (ii++));\r\n        }\r\n    }\r\n}\r\n\r\nfunction throttle(method, context) {\r\n    clearTimeout(method.tId);\r\n    method.tId = setTimeout(function () {\r\n        method.call(context)\r\n    }, 500)\r\n}\r\n\r\n\r\nvar unityL = 0;\r\nvar unityT = 0;\r\nvar unityW = 0;\r\nvar unityH = 0;\r\n\r\n\r\nsetInterval(function () {\r\n    var $unityContainer = $(%27#unityContainer%27);\r\n    if (!$unityContainer.length) { return };\r\n    var curUnityL = $unityContainer.offset().left + 0;\r\n    var curUnityT = $unityContainer.offset().top + 60;\r\n    var curUnityW = $unityContainer.width();\r\n    var curUnityH = $unityContainer.height();\r\n\r\n    if (unityL !== curUnityL || unityT !== curUnityT || unityW !== curUnityW || unityH !== curUnityH) {\r\n        //console.log(11)\r\n        unityL = curUnityL;\r\n        unityT = curUnityT;\r\n        unityW = curUnityW;\r\n        unityH = curUnityH;\r\n        window.top.resizeUnity({\r\n            top: unityT,\r\n            width: unityW,\r\n            height: unityH,\r\n            left: unityL\r\n        });\r\n    }\r\n\r\n}, 100);\r\n\r\nfunction intoLarge(ele, options, title) {\r\n    var isUpdatetitle = true;\r\n    var grid = {\r\n        top: 80,\r\n        left: 120,\r\n        bottom: 90,\r\n        right: %2750%%27\r\n    };\r\n    console.log(title);\r\n    //options.toolbox.feature.myensmall.show=true;\r\n    //options.toolbox.feature.myenlarge.show=false;\r\n    $(%27#itemDialog%27).show().html(%27<div class=%22chart-dialog-container%22><div class=%22chart-title-large%22>%27+title+%27<span class=%22iconfont icon-ensmall%22 onclick=%22intoSmall()%22></span></div><div id=%22intoLarge_%27 + ele + %27%22 style=%22width:100%;height:100%;%22></div></div>%27);\r\n    var largeChart = echarts.init(document.getElementById(%27intoLarge_%27 + ele));\r\n    largeChart.setOption(options);\r\n    window.top.resizeUnity({\r\n        height: 0\r\n    });\r\n}\r\nfunction intoSmall() {\r\n    $(%27#itemDialog%27).hide().html(%27%27);\r\n    if (window.top.resizeUnity) {\r\n        window.top.resizeUnity({\r\n            height: unityH\r\n        });\r\n    }\r\n\r\n}\r\n// unity初始化镜头至整栋楼\r\nif (window.parent.RegPageReadyFun) {\r\n    window.parent.RegPageReadyFun(function () {\r\n        window.parent.getUnityWindow().SwitchScene(%22qdg.scene%22, localStorage.buildingid, %22%22);\r\n    });\r\n}\r\nfunction changeEchart1(floorname, dimension) {\r\n    var chart1 = echarts.init(document.getElementById(%22chart1%22), %27macarons%27);\r\n    var total = 0;\r\n    chart1.getOption().dataset[0].source.forEach(function (item) {\r\n        if (typeof item[dimension] === %27number%27) {\r\n            total += item[dimension];\r\n        }\r\n    });\r\n    chart1.setOption({\r\n        title: {\r\n            text: floorname\r\n        },\r\n        series: [\r\n            {\r\n                id: %27pie3%27,\r\n                data: [{ name: %27总面积%27, value: total }]\r\n            }, {\r\n                id: %27pie%27,\r\n                label: {\r\n                    formatter: %27{@%27 + floorname + %27}㎡%27\r\n                },\r\n                encode: {\r\n                    value: dimension,\r\n                    tooltip: dimension\r\n                }\r\n            }, {\r\n                id: %27pie2%27,\r\n                encode: {\r\n                    value: dimension,\r\n                    tooltip: dimension\r\n                }\r\n            }\r\n        ]\r\n    });\r\n    /*缩放dataZoom*/\r\n    var _floorNum = (dimension - 1) * 6;\r\n    chart1.dispatchAction({\r\n        type: %27dataZoom%27,\r\n        start: _floorNum,\r\n        end: _floorNum\r\n    });\r\n}\r\nfunction openOrder(id){\r\n    top.$topNav.find(%27a%27).filter(function(){\r\n        return $(this).text()===%27维保工单%27;\r\n    }).trigger(%27click%27);\r\n    if(id){\r\n        localStorage.orderid=id;\r\n    }\r\n}"
	};
	if(r.css) {
		var style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = r.css;
		document.body.appendChild(style);
	}
	if(r.js) {
		eval(decode(r.js));
	}
	if(r.html) {
		$('#app').append(r.html);
	}
	//		},
	//		error: function(r) {
	//			console.log(r);
	//		}
	//	});
}