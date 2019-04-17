(function($) {
	"use strict"
	$.extend({
		//轮询添加表格内容
		deepTraverse: function(obj, data) {
			if(!data.datas.length) {
				return '';
			}
			var html = '',
				timeField = ['start', 'end', 'actstart', 'actend'];
			for(var i = 0, len = data.datas.length; i < len; i++) {
				html += '<tr data-level="' + data.datas[i].level + '" class="collapse">';
				for(var _i = 0, length = obj.columns.length; _i < length; _i++) {
					switch(obj.columns[_i].field) {
						case 'name':
							html += '<td style="' + (obj.columns[_i].align ? 'text-align:' + obj.columns[_i].align + ';' : '') + 'padding-left:' + (data.datas[i].level + 1) * 16 + 'px">';
							html += (data.datas[i].datas.length ? '<img class="collapse" style="left:' + ((data.datas[i].level + 1) * 16 - 16) + 'px;" src="img/toggle_collapse.png">' : '');
							html += '<input readonly="readonly" style="text-align:left;" type="text" name="" value="';
							html += timeField.indexOf(obj.columns[_i].field) >= 0 ? $.inputTime(data.datas[i][obj.columns[_i].field]) : data.datas[i][obj.columns[_i].field];
							html += '"/></td>';
							break;
						case 'depends':
							html += '<td><input style="display:none;" type="text" value="';
							html += data.datas[i][obj.columns[_i].field];
							html += '"/></td>';
						default:
							html += '<td ' + (obj.columns[_i].align ? 'style="text-align:' + obj.columns[_i].align + ';"' : '') + '>';
							html += ((obj.columns[_i].field === 'name' && data.datas[i].datas.length) ? '<img src="img/toggle_collapse.png">' : '');
							if(timeField.indexOf(obj.columns[_i].field) >= 0) {
								html += '<input class="timeField" readonly="readonly" ' + (obj.columns[_i].align ? 'style="text-align:' + obj.columns[_i].align + ';' : '') + '" type="text" name="" value="';
								html += $.inputTime(data.datas[i][obj.columns[_i].field]);
							} else {
								html += '<input readonly="readonly" ' + (obj.columns[_i].align ? 'style="text-align:' + obj.columns[_i].align + ';' : '') + '" type="text" name="" value="';
								html += data.datas[i][obj.columns[_i].field];
							}
							html += '"/></td>';
							break;
					}
				}
				html += '<td style="width:1200px;"></td></tr>';
				html += $.deepTraverse(obj, data.datas[i]);
			}
			return html;
		},
		//时间显示样式
		inputTime: function(time) {
			if(time) {
				var newDate = new Date(time),
					arr = [newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()].join('/');
				return arr;
			} else {
				return '';
			}
		},
		//右侧甘特图表格数据处理
		confirmRange: function(arr, showLayer) {
			var totalArr = [],
				filterTime = function(arr, time) {
					return !time ? false : arr.push(new Date(time).getTime());
				};
			arr.forEach(function(item, i) {
				filterTime(totalArr, item.start);
				filterTime(totalArr, item.end);
				filterTime(totalArr, item.actstart);
				filterTime(totalArr, item.actend);
			});
			var minDate = Math.min.apply(null, totalArr),
				maxDate = Math.max.apply(null, totalArr),
				dateLength = (maxDate - minDate) / 86400000,
				final_minDate = minDate - (new Date(minDate).getDay() + 7) * 86400000,
				final_maxDate = maxDate + (6 - new Date(maxDate).getDay() + 7) * 86400000,
				final_dateLength = (final_maxDate - final_minDate) / 86400000 + 1;
			var columns = [],
				curTime = final_minDate,
				days = [],
				dates = [];
			var mapGridStyle = [{
					thWidth: 700,
					fontSize: '14px',
					tdWidth: 100
				}, {
					thWidth: 350,
					fontSize: '14px',
					tdWidth: 50
				}, {
					thWidth: 210,
					fontSize: '14px',
					tdWidth: 30
				}, {
					fontSize: '14px',
					tdWidth: 20
				}, {
					fontSize: '10px',
					tdWidth: 15
				}, {
					fontSize: '14px',
					tdWidth: 7
				}, {
					fontSize: '14px',
					tdWidth: 4
				}, {
					fontSize: '14px',
					tdWidth: 2
				}, {
					fontSize: '14px',
					tdWidth: 0.5
				}],
				week = ['日', '一', '二', '三', '四', '五', '六'];
			var minYear = new Date(final_minDate).getFullYear(),
				maxYear = new Date(final_maxDate).getFullYear(),
				minMonth = new Date(final_minDate).getMonth(),
				maxMonth = new Date(final_maxDate).getMonth(),
				minDate = new Date(final_minDate).getDate(),
				maxDate = new Date(final_maxDate).getDate();
			var from_to_head = function() {
					for(var i = 0, len = final_dateLength / 7; i < len; i++) {
						days.push({
							field: $.inputTime(curTime + i * 86400000 * 7) + '-' + $.inputTime(curTime + (i + 1) * 86400000 * 7 - 86400000),
							width: mapGridStyle[showLayer].thWidth,
							splitNum: 7
						});
					}
				},
				month_head = function() {
					var addMonth = minMonth;
					var timeLag = maxYear - minYear;
					if(timeLag) {
						maxMonth = maxMonth + 12 * timeLag
					}
					do {
						var divide = Math.floor(addMonth / 12) - 1;
						switch(true) {
							case addMonth === minMonth:
								days.push({
									field: minYear + '年' + (minMonth + 1) + '月',
									width: (new Date(minYear, addMonth+1, 0).getDate() - minDate + 1) * mapGridStyle[showLayer].tdWidth,
									splitNum: new Date(minYear, addMonth+1, 0).getDate() - minDate + 1
								});
								break;
							case addMonth === maxMonth:
								days.push({
									field: maxYear + '年' + (maxMonth - 12 * (divide + 1) + 1) + '月',
									width: maxDate * mapGridStyle[showLayer].tdWidth,
									splitNum: maxDate
								});
								break;
							default:
								days.push({
									field: (minYear + 1 * divide + 1) + '年' + (addMonth - 12 *divide  + 1) + '月',
									width: (new Date(minYear + 1 * divide, addMonth - 12 * divide + 1, 0).getDate() - new Date(minYear + 1 * divide, addMonth * divide - 12, 1).getDate() + 1) * mapGridStyle[showLayer].tdWidth,
									splitNum: new Date(minYear + 1 * divide, addMonth - 12 * divide + 1, 0).getDate() - new Date(minYear + 1 * divide, addMonth * divide - 12, 1).getDate() + 1
								});
								break;
						}
						addMonth++;
					} while (addMonth <= maxMonth);
				},
				yearMonth_head = function() {
					var addMonth = minMonth;
					var timeLag = maxYear - minYear;
					if(timeLag) {
						maxMonth = maxMonth + 12 * timeLag
					}
					do {
						var divide = Math.floor(addMonth / 12) - 1;
						switch(true) {
							case addMonth === minMonth:
								days.push({
									field: minYear + '年' + (minMonth + 1) + '月',
									width: (new Date(minYear, addMonth + 1, 0).getDate() - minDate + 1) * mapGridStyle[showLayer].tdWidth,
									splitNum: (new Date(minYear, addMonth + 1, 0).getDate() - minDate + 1)
								});
								break;
							case addMonth === maxMonth:
								days.push({
									field: maxYear + '年' + (maxMonth - 12 * (divide + 1) + 1) + '月',
									width: maxDate * mapGridStyle[showLayer].tdWidth,
									splitNum: maxDate
								});
								break;
							default:
								days.push({
									field: (minYear + 1 * divide + 1) + '年' + (addMonth - 12 * (divide + 1)+1) + '月',
									width: (new Date(minYear + 1 * divide, addMonth - 12 * divide + 1, 0).getDate() - new Date(minYear + 1 * divide, addMonth * divide - 12, 1).getDate() + 1) * mapGridStyle[showLayer].tdWidth,
									splitNum: (new Date(minYear + 1 * divide, addMonth - 12 * divide + 1, 0).getDate() - new Date(minYear + 1 * divide, addMonth * divide - 12, 1).getDate() + 1)
								});
								break;
						}
						addMonth++;
					} while (addMonth <= maxMonth);
				},
				year_head = function() {
					var minus = showLayer === 8 ? maxYear - minYear + 2 : maxYear - minYear + 1;
					var min_YearfirstDate = final_minDate,
						min_YearLastDate = new Date(minYear, 12, 0).getTime();
					for(var i = 0; i < minus; i++) {
						switch(i) {
							case 0:
								days.push({
									field: (minYear + 1 * i) + '年',
									width: ((min_YearLastDate - min_YearfirstDate) / 86400000 + 1) * mapGridStyle[showLayer].tdWidth,
									splitNum: (min_YearLastDate - min_YearfirstDate) / 86400000 + 1
								});
								break;
							case minus - 1:
								min_YearfirstDate = new Date(minYear + 1 * i, 0, 1).getTime();
								min_YearLastDate = final_maxDate;
								days.push({
									field: (minYear + 1 * i) + '年',
									width: ((min_YearLastDate - min_YearfirstDate) / 86400000 + 1) * mapGridStyle[showLayer].tdWidth,
									splitNum: (min_YearLastDate - min_YearfirstDate) / 86400000 + 1
								});
								break;
							default:
								min_YearfirstDate = new Date(minYear + 1 * i, 0, 1).getTime();
								min_YearLastDate = new Date(minYear + 1 * i, 12, 0).getTime();
								days.push({
									field: (minYear + 1 * i) + '年',
									width: ((min_YearLastDate - min_YearfirstDate) / 86400000 + 1) * mapGridStyle[showLayer].tdWidth,
									splitNum: (min_YearLastDate - min_YearfirstDate) / 86400000 + 1
								});
								break;
						}

					}
				},
				date_region = function() {
					for(var i1 = 0, leng = final_dateLength; i1 < leng; i1++) {
						dates.push({
							field: (function() {
								var tdField;
								switch(true) {
									case showLayer < 1:
										tdField = week[new Date(curTime + i1 * 86400000).getDay()] + ' ' + new Date(curTime + i1 * 86400000).getDate();
										break;
									case showLayer <= 2:
										tdField = week[new Date(curTime + i1 * 86400000).getDay()];
										break;
									case showLayer >= 3 && showLayer <= 4:
										tdField = new Date(curTime + i1 * 86400000).getDate();
										break;
									default:
										break;
								};
								return tdField;
							})(),
							width: mapGridStyle[showLayer].tdWidth,
							itemSplitNum: 1
						});
					}
				},
				week_region = function() {
					var minTime = new Date(final_minDate-14*86400000).getTime(),
						min_YearfirstDay = new Date(minYear, 0, 1).getDay(),
						min_firstWeekTime = min_YearfirstDay ? new Date(minYear, 0, 7-min_YearfirstDay+1).getTime() : new Date(minYear, 0, 1).getTime();
					var midYear = minYear,
						addYear, num = 0;
					for(var i1 = 0, leng = final_dateLength / 7; i1 < leng; i1++) {
						addYear = new Date(minTime + (i1 - num + 1) * 7 * 86400000).getFullYear();
						dates.push({
							field: (function() {
								if(addYear === midYear) {
									var weekNum = 'w.' + (Math.floor((minTime - min_firstWeekTime + 7 * (i1 - num) * 86400000) / 7 / 86400000) + 1);
									return weekNum;
								} else {
									//console.log(i1)
									num = i1;
									midYear = addYear;
									minTime = new Date(addYear, 0, 1).getTime();
									min_firstWeekTime = new Date(addYear, 0, 1).getTime();
									return 'w.1';
								}
							})(),
							width: mapGridStyle[showLayer].tdWidth * 7,
							itemSplitNum: 7
						});
					}
				},
				month_region = function() {
					var addMonth = minMonth;
					var timeLag = maxYear - minYear;
					if(timeLag) {
						maxMonth = maxMonth + 12 * timeLag
					}
					do {
						var divide = Math.floor(addMonth / 12) - 1;
						switch(true) {
							case addMonth === minMonth:
								dates.push({
									field: (minMonth + 1) + '月',
									width: (new Date(minYear, addMonth + 1, 0).getDate() - new Date(final_minDate).getDate() + 1) * mapGridStyle[showLayer].tdWidth,
									itemSplitNum: new Date(minYear, addMonth + 1, 0).getDate() - new Date(final_minDate).getDate() + 1
								});
								break;
							case addMonth === maxMonth:
								dates.push({
									field: (maxMonth - 12 * (divide + 1) + 1) + '月',
									width: (new Date(final_maxDate).getDate() - new Date(maxYear, addMonth, 1).getDate() + 1) * mapGridStyle[showLayer].tdWidth,
									itemSplitNum: new Date(final_maxDate).getDate() - new Date(maxYear, addMonth, 1).getDate() + 1
								});
								break;
							default:
								dates.push({
									field: (addMonth - 12 * (divide + 1) + 1) + '月',
									width: (new Date(minYear + 1 * divide, addMonth - 12 * (divide + 1) + 1, 0).getDate() - new Date(minYear + 1 * divide, addMonth * divide - 12, 1).getDate() + 1) * mapGridStyle[showLayer].tdWidth,
									itemSplitNum: new Date(minYear + 1 * divide, addMonth - 12 * (divide + 1) + 1, 0).getDate() - new Date(minYear + 1 * divide, addMonth * divide - 12, 1).getDate() + 1
								});
								break;
						}
						addMonth++;
					} while (addMonth <= maxMonth);
				},
				halfyear_region = function() {
					var minus = showLayer === 8 ? maxYear - minYear + 2 : maxYear - minYear + 1;
					var min_YearfirstDate = final_minDate,
						min_YearLastDate = new Date(minYear, 12, 0).getTime();
					for(var i = 0; i < minus; i++) {
						switch(i) {
							case 0:
								var fullYDate = (min_YearLastDate - min_YearfirstDate) / 86400000 + 1;
								dates.push({
									field: 'Sem1',
									width: fullYDate * mapGridStyle[showLayer].tdWidth / 2,
									itemSplitNum: Math.floor(fullYDate / 2)
								});
								dates.push({
									field: 'Sem2',
									width: fullYDate * mapGridStyle[showLayer].tdWidth / 2,
									itemSplitNum: fullYDate - Math.floor(fullYDate / 2)
								});
								break;
							case minus - 1:
								min_YearfirstDate = new Date(minYear + 1 * i, 0, 1).getTime();
								min_YearLastDate = final_maxDate;
								var fullYDate = (min_YearLastDate - min_YearfirstDate) / 86400000 + 1;
								dates.push({
									field: 'Sem1',
									width: fullYDate * mapGridStyle[showLayer].tdWidth / 2,
									itemSplitNum: Math.floor(fullYDate / 2)
								});
								dates.push({
									field: 'Sem2',
									width: fullYDate * mapGridStyle[showLayer].tdWidth / 2,
									itemSplitNum: fullYDate - Math.floor(fullYDate / 2)
								});
								break;
							default:
								min_YearfirstDate = new Date(minYear + 1 * i, 0, 1).getTime();
								min_YearLastDate = new Date(minYear + 1 * i, 12, 0).getTime();
								var fullYDate = (min_YearLastDate - min_YearfirstDate) / 86400000 + 1;
								dates.push({
									field: 'Sem1',
									width: fullYDate * mapGridStyle[showLayer].tdWidth / 2,
									itemSplitNum: Math.floor(fullYDate / 2)
								});
								dates.push({
									field: 'Sem2',
									width: fullYDate * mapGridStyle[showLayer].tdWidth / 2,
									itemSplitNum: fullYDate - Math.floor(fullYDate / 2)
								});
								break;
						}

					}
				};
			switch(true) {
				case showLayer <= 2:
					from_to_head();
					date_region();
					break;
				case showLayer >= 3 && showLayer <= 4:
					month_head();
					date_region();
					break;
				case showLayer === 5:
				    minDate = new Date(final_minDate-7*86400000).getDate();
				    maxDate = new Date(final_maxDate+7*86400000).getDate();
				    final_dateLength = (final_maxDate - final_minDate+14*86400000) / 86400000 + 1;
					yearMonth_head();
					week_region();
					final_minDate = new Date(final_minDate-7*86400000).getTime();
					break;
				case showLayer >= 6 && showLayer <= 7:
					final_minDate = new Date(minYear, minMonth-1, 1).getTime();
					final_maxDate = new Date(maxYear, maxMonth + 2, 0).getTime();
					year_head();
					month_region();
					break;
				default:
					final_minDate = minMonth > 5 ? new Date(minYear, 0, 1).getTime() : new Date(minYear - 1, 6, 1).getTime();
					final_maxDate = maxMonth > 5 ? new Date(maxYear + 1, 12, 0).getTime() : new Date(maxYear + 1, 6, 0).getTime();
					year_head();
					halfyear_region();
					break;
			};
			columns.days = days;
			columns.dates = dates;
			columns.itemW = mapGridStyle[showLayer].tdWidth;
			columns.fontSize = mapGridStyle[showLayer].fontSize;
			columns.arr = arr;
			columns.final_minDate = final_minDate;
			//columns.final_maxDate=final_maxDate;
			return columns;
		},
		//轮询添加duration参数
		deepClone: function(arr) {
			arr.forEach(function(item, index) {
				var durationDate = (new Date(item.end).getTime() - new Date(item.start).getTime()) / 86400000,
					actdurationDate = (new Date(item.actend).getTime() - new Date(item.actstart).getTime()) / 86400000;
				item.duration = durationDate;
				item.actduration = actdurationDate;
				if(item.datas.length) {
					$.deepClone(item.datas);
				}
			});
		}
	});
	$.fn.extend({
		//树形表单核心函数
		treeGrid: function(obj) {
			obj = {
				datas: obj.data,
				columns: obj.columns
			};
			var grid_html = '',
				$that = $(this),
				$xToolbar = $('.xToolbar'),
				txt;
			window.criticalpath=obj.datas[0].criticalpath;
			//绘制表格
			var drawMap = function() {
					var $tr = $that.find('tbody tr:not(:hidden)'),
						$th = $that.find('thead th'),
						trarr = [];
					$tr.each(function(index) {
						var tdObj = {},
							$input = $(this).find('input');
						obj.columns.forEach(function(item, index) {
							tdObj[item.field] = $input.eq(index).val();
						});
						tdObj['level'] = $tr.eq(index).attr('data-level');
						trarr.push(tdObj);
					});
					$('#xMap_table').mapGrid({
						rowData: trarr,
						criticalpath: obj.datas[0].criticalpath
					});
					trArr = trarr;
				},
				//duration同步更新
				changeDuration = function(index, $this) {
					switch(true) {
						case(index === 2 || index === 5):
							var start = new Date($this.val()).getTime(),
								end = new Date($this.parent().next().find('input').val()).getTime();
							if(isNaN(end - start) || (end - start) < 0) {
								$this.parent().next().next().find('input').val('');
							} else {
								$this.parent().next().next().find('input').val((end - start) / 86400000);
							}
							break;
						case(index === 3 || index === 6):
							var end = $this.val() ? new Date($this.val()).getTime() : new Date().getTime(),
								start = new Date($this.parent().prev().find('input').val()).getTime();
							if(isNaN(end - start) || (end - start) < 0) {
								$this.parent().next().find('input').val('');
							} else {
								$this.parent().next().find('input').val(Math.round((end - start) / 86400000));
							}
							break;
						default:
							break;
					}
				},
				//表单验证
				tooBig = function($this, oldVal, colIndex) {
					var $thatParent = $this.parent(),
						isNo_Validate = isNaN(new Date($this.val()).getTime()) && $this.val() !== '',
						isokToDraw;
					if(isNo_Validate) {
						txt = '您输入的时间格式有误，请重新输入！';
						$xToolbar.toolTip(txt);
						$this.val(oldVal);
						isokToDraw = false;
					} else {
						if($this.val() === '') {
							$this.removeClass('errorRed');
							$thatParent.next().find('input').removeClass('errorRed');
							$thatParent.next().find('input').val('');
							$thatParent.next().next().find('input').val('');
							isokToDraw = false;
						} else {
							if(new Date($thatParent.next().find('input').val()) < new Date($this.val())) {
								$this.attr('class', 'errorRed');
								txt = obj.columns[$thatParent.index()].title + '不能大于' + obj.columns[$thatParent.index() + 1].title;
								$xToolbar.toolTip(txt);
								isokToDraw = false;
							} else {
								$this.removeClass('errorRed');
								$thatParent.next().find('input').removeClass('errorRed');
								changeDuration(colIndex, $this);
								isokToDraw = true;
							}
						}
					}
					return isokToDraw;
				},
				tooSmall = function($this, oldVal, colIndex) {
					var $thatParent = $this.parent(),
						isNo_Validate = isNaN(new Date($this.val()).getTime()) && $this.val() !== '',
						isokToDraw;
					if(isNo_Validate) {
						txt = '您输入的时间格式有误，请重新输入！';
						$xToolbar.toolTip(txt);
						$this.val(oldVal);
						isokToDraw = false;
					} else {
						if($this.val() === '') {
							$this.removeClass('errorRed');
							changeDuration(colIndex, $this);
							isokToDraw = true;
						} else {
							if(!$thatParent.prev().find('input').val()) {
								$thatParent.prev().find('input').attr('class', 'errorRed');
								txt = '请设置' + obj.columns[$thatParent.index() - 1].title + '！';
								$xToolbar.toolTip(txt);
								isokToDraw = false;
							} else if(new Date($thatParent.prev().find('input').val()) > new Date($this.val())) {
								$this.attr('class', 'errorRed');
								txt = obj.columns[$thatParent.index()].title + '不能小于' + obj.columns[$thatParent.index() - 1].title;
								$xToolbar.toolTip(txt);
								isokToDraw = false;
							} else {
								$this.removeClass('errorRed');
								$thatParent.prev().find('input').removeClass('errorRed');
								changeDuration(colIndex, $this);
								isokToDraw = true;
							}
						}
					}
					return isokToDraw;
				},
				chooseTime=function ($ele, currentVal, oldVal) {
					var colIndex = $ele.parent().index(),
						isokToDraw;
					switch(true) {
						case(colIndex === 2 || colIndex === 5):
							tooBig($ele, oldVal, colIndex) && drawMap();
							break;
						case(colIndex === 3 || colIndex === 6):
							tooSmall($ele, oldVal, colIndex) && drawMap();
							break;
						default:
							break;
					}
					$ele.attr('readonly', 'readonly').removeClass('activeInput');
				};
			grid_html += '<table class="thead"><thead><tr>';
			for(var th_i in obj.columns) {
				if(obj.columns[th_i].field === 'depends') {
					grid_html += '';
				} else {
					grid_html += '<th style="' + (obj.columns[th_i].nowrap ? 'white-space:nowrap;' : '') +
						'min-width:' + obj.columns[th_i].width + ';">' + obj.columns[th_i].title + '</th>';
				}
			}
			grid_html += '<th style="min-width:1202px;"></th></tr></thead></table><table><thead><tr>';
			for(var th_i in obj.columns) {
				if(obj.columns[th_i].field === 'depends') {
					grid_html += '';
				} else {
					grid_html += '<th style="min-width:' + obj.columns[th_i].width + ';"></th>';
				}
			}
			grid_html += '<th style="min-width:1200px;"></th></tr></thead><tbody>';
			grid_html += $.deepTraverse(obj, obj);
			for(var i = 7; i >= 0; i--) {
				grid_html += '<tr>';
				for(var th_i in obj.columns) {
					grid_html += '<td> </td>';
				}
				grid_html += '<td style="width:1200px;"></td></tr>';
			}
			grid_html += '</tbody><table>';
			$that.attr('cellspacing', 0).html(grid_html).css({
				textAlign: obj.align
			});
			//treeButton@click
			$that.find('img').on('click', function() {
				var $this = $(this),
					$row = $this.parents('tr'),
					rowIndex = $row.index(),
					level = $row.attr('data-level'),
					$Childrens = $row.nextUntil('tr[data-level=' + level + ']').filter(function() {
						return +$(this).attr('data-level') >= (+level + 1);
					});
				if($row.hasClass('collapse')) {
					if($Childrens.hasClass('expand')) {
						$Childrens = $Childrens.not('.expandChild');
						$Childrens.slideUp(200, function() {
							drawMap();
						});
					} else {
						$Childrens.slideUp(200, function() {
							drawMap();
						}).addClass('expandChild');
					}
					$row.attr('class', 'expand');
					$this.attr('src', 'img/toggle_expand.png');
				} else {
					if($Childrens.hasClass('expand')) {
						$Childrens = $Childrens.not('.expandChild');
						$Childrens.slideDown(200, function() {
							drawMap();
						});
					} else {
						$Childrens.slideDown(200, function() {
							drawMap();
						}).removeClass('expandChild');
					}
					$row.attr('class', 'collapse');
					$this.attr('src', 'img/toggle_collapse.png');
				}
			});
			var oldVal = '';
			//tr@click
			$that.find('tbody tr').on('click', function() {
				$selectedRow = $(this);
				$(this).siblings().css('background-color', 'white').end().css('background-color', '#EAF8FF');
				//$('#xMap_table tbody tr').eq($(this).index()).siblings().css('background-color', 'white').end().css('background-color', '#EAF8FF');
			});
			//tr input@click、blur
			$that.find('input').on('click', function() {
				var colIndex = $(this).parent().index(),
					$tr = $(this).parents('tr');
				if(colIndex !== 4 && colIndex !== 7) {
					if($(this).hasClass('errorRed')) {
						$(this).removeClass('errorRed');
					}
					$(this).removeAttr('readonly').addClass('activeInput');
					oldVal = $(this).val();
				}
				$selectedRow = $tr;
				$tr.siblings().css('background-color', 'white').end().css('background-color', '#EAF8FF');
				//$('#xMap_table tbody tr').eq($tr.index()).siblings().css('background-color', 'white').end().css('background-color', '#EAF8FF');
			}).on('blur', function() {
				var $this = $(this),isokToDraw,
					colIndex = $this.parent().index();
				if($this.val() !== oldVal && $this.hasClass('activeInput')) {
					switch(true) {
						case(colIndex === 2 || colIndex === 5):
							tooBig($this, oldVal, colIndex) && drawMap();
							break;
						case(colIndex === 3 || colIndex === 6):
							tooSmall($this, oldVal, colIndex) && drawMap();
							break;
						case(colIndex === 8):
							drawMap();
							break;
						default:
							break;
					}
				}
				$this.attr('readonly', 'readonly').removeClass('activeInput');
			});
			//时间插件jeDate引用&&回调验证
			$.jeDate('.timeField', {
				isinitVal: false,
				format: 'YYYY/MM/DD', // 分隔符可以任意定义，该例子表示只显示年月 
				festival: false,
				choosefun: function($ele, currentVal, oldVal)  {
					chooseTime($ele, currentVal, oldVal);
				},
				okfun: function($ele, currentVal, oldVal) {
					chooseTime($ele, currentVal, oldVal);
				},
				clearfun: function($ele, oldVal) {
					var currentVal = '';
					chooseTime($ele, currentVal, oldVal);
				}
			});
			//调用函数绘制mapGrid
			drawMap();
			window.drawMap = drawMap;
		},
		//绘制右侧表格
		mapGrid: function(obj) {
			obj = {
				total: obj.rowData.length,
				border: obj.border,
				trBorder: obj.trBorder,
				tdBorder: obj.tdBorder,
				columns: $.confirmRange(obj.rowData, showLayer),
				criticalpath: obj.criticalpath
			};
			var grid_html = '';
			grid_html += '<table class="thead1"><thead>';
			grid_html += '<tr>';
			for(var th_i = 0, len = obj.columns.days.length; th_i < len; th_i++) {
				grid_html += '<th colspan="' + obj.columns.days[th_i].splitNum + '" style="white-space:nowrap;min-width:' + obj.columns.days[th_i].width + 'px;">' + obj.columns.days[th_i].field + '</th>';
			}
			grid_html += '</tr><tr>';
			for(var th_i1 = 0, leng = obj.columns.dates.length; th_i1 < leng; th_i1++) {
				grid_html += '<th style="white-space:nowrap;width:' + obj.columns.dates[th_i1].width + 'px;" colspan="' + obj.columns.dates[th_i1].itemSplitNum + '">' + obj.columns.dates[th_i1].field + '</th>';
			}
			grid_html += '</tr></thead></table><table style="position:relative;"><thead><tr>';
			for(var th_i2 = 0, len = obj.columns.days.length; th_i2 < len; th_i2++) {
				grid_html += '<th colspan="' + obj.columns.days[th_i2].splitNum + '" style="min-width:' + obj.columns.days[th_i2].width + 'px;">1</th>';
			}
			grid_html += '</tr><tr>';
			for(var th_i3 = 0, leng = obj.columns.dates.length; th_i3 < leng; th_i3++) {
				grid_html += '<th style="width:' + obj.columns.dates[th_i3].width + 'px;" colspan="' + obj.columns.dates[th_i3].itemSplitNum + '">1</th>';
			}
			grid_html += '</tr></thead><tbody>';
			for(var maplen = obj.total - 1; maplen >= 0; maplen--) {
				grid_html += '<tr>';
				for(var th_i2 = 0, leng2 = obj.columns.days.length; th_i2 < leng2; th_i2++) {
					grid_html += '<td style="white-space:nowrap;width:' + obj.columns.days[0].width + 'px;" colspan="' + obj.columns.days[th_i2].splitNum + '">' + ' ' + '</td>';
				}
				grid_html += '</tr>';
			}
			grid_html += '</tbody><table>';
			$(this).html(grid_html).attr('cellspacing', 0).css({
				textAlign: obj.align,
				borderTop: obj.border,
				fontSize: obj.columns.fontSize,
				borderLeft: obj.border
			});
			/*DrawRect*/
			var $tbody = $(this).find('tbody');
			$tbody.drawRect(obj.columns.final_minDate, obj.columns.arr, obj.columns.itemW, obj.criticalpath);
		},
		//绘制svg进度条
		drawRect: function(startPoint, arr, itemW, criticalpath) {
			//console.log(startPoint);
			//console.log(arr);
			var $tr = $(this).find('tr'),
				svgHtml = [];
			var getFrom_point = function(To_x, To_y, From_id,level) {
				var pathHtml = '';
				arr.filter(function(item, i, Array) {
					if(item.id === From_id) {
						var start = arr[i].start ? new Date(arr[i].start) : false,
							end = arr[i].end ? new Date(arr[i].end) : new Date().getTime(),
							timeSlot_DateLength = ((end - start) / 86400000 + 1) * itemW,
							x = (start - startPoint) / 86400000 * itemW;
						var From_x = x + timeSlot_DateLength,
							From_y = 28 * i + 7 + 44;
						var levelColor;
						switch(level) {
							case '1':
								levelColor = '#3F0FDC';
								levelColor=showCriticalPath && $.inArray(arr[i].id, criticalArr)>=0 ? 'red' : '#3F0FDC';
								break;
							case '2':
								levelColor = '#2F97C6';
								break;
							case '3':
								levelColor = '#AC6DF3';
								break;
							case '4':
								levelColor = '#E2E406';
								break;
							default:
								break;
						}
						//console.log('FromPoint:' + From_x + '--' + From_y);
						//console.log('ToPoint:' + To_x + '--' + To_y);
						From_y = From_y + 10;
						To_y = To_y + 10;
						var dif_x = Math.abs(To_x - From_x),
							dif_y = Math.abs(To_y - From_y);
						switch(true) {
							case To_x - From_x <= 10:
								pathHtml += '<path d="';
								pathHtml += 'M' + From_x + ' ' + From_y;
								pathHtml += ',L' + (From_x + 5) + ' ' + From_y;
								pathHtml += ',A5 5,45,0,1,' + (From_x + 10) + ' ' + (From_y + 5);
								pathHtml += ',L' + (From_x + 10) + ' ' + (From_y + 10);
								pathHtml += ',A5 5,45,0,1,' + (From_x + 5) + ' ' + (From_y + 15);
								pathHtml += ',L' + (To_x - 5) + ' ' + (From_y + 15);
								pathHtml += ',A5 5,45,0,0,' + (To_x - 10) + ' ' + (From_y + 20);
								pathHtml += ',L' + (To_x - 10) + ' ' + (To_y - 5);
								pathHtml += ',A5 5,45,0,0,' + (To_x - 5) + ' ' + To_y;
								pathHtml += ',L' + To_x + ' ' + To_y;
								pathHtml += '" stroke="' + levelColor + '" fill="none" style="stroke-width: 2px;"></path>';
								break;
							case To_x - From_x > 10 && To_x - From_x <= 20:
								pathHtml += '<path d="';
								pathHtml += 'M' + From_x + ' ' + From_y;
								pathHtml += ',L' + (From_x + 5) + ' ' + From_y;
								pathHtml += ',A5 5,45,0,1,' + (From_x + 10) + ' ' + (From_y + 5);
								pathHtml += ',L' + (From_x + 10) + ' ' + (From_y + 10);
								pathHtml += ',A5 5,45,0,1,' + (From_x + 5) + ' ' + (From_y + 15);
								pathHtml += ',L' + (To_x - 5 - (dif_x / 2)) + ' ' + (From_y + 15);
								pathHtml += ',A5 5,45,0,0,' + (To_x - 10 - (dif_x / 2)) + ' ' + (From_y + 20);
								pathHtml += ',L' + (To_x - 10 - (dif_x / 2)) + ' ' + (To_y - 5);
								pathHtml += ',A5 5,45,0,0,' + (To_x - 5 - (dif_x / 2)) + ' ' + To_y;
								pathHtml += ',L' + To_x + ' ' + To_y;
								pathHtml += '" stroke="' + levelColor + '" fill="none" style="stroke-width: 2px;"></path>';
								break;
							case To_x - From_x > 20:
								pathHtml += '<path d="';
								pathHtml += 'M' + From_x + ' ' + From_y;
								pathHtml += ',L' + (From_x + (dif_x / 2) - 5) + ' ' + From_y;
								pathHtml += ',A5 5,45,0,1,' + (From_x + (dif_x / 2)) + ' ' + (From_y + 5);
								pathHtml += ',L' + (From_x + (dif_x / 2)) + ' ' + (To_y - 5);
								pathHtml += ',A5 5,45,0,0,' + (To_x - (dif_x / 2) + 5) + ' ' + To_y;
								pathHtml += ',L' + To_x + ' ' + To_y;
								pathHtml += '" stroke="' + levelColor + '" fill="none" style="stroke-width: 2px;"></path>';
								break;
							default:
								break;
						}
						pathHtml += '<polygon points="' + To_x + ',' + To_y + ' ' + (To_x - 5) + ',' + (To_y - 5) + ' ' + (To_x - 5) + ',' + (To_y + 5) + '" style="fill:' + levelColor + ';stroke:none;stroke-width:1" />';
					}
				});
				//console.log(pathHtml)
				return pathHtml;
			};
			svgHtml.push('<svg xmlns="http://www.w3.org/2000/svg" version="1.1">');
			for(var i = 0, length = $tr.length; i < length; i++) {
				//console.log(Boolean(arr[i].id))
				if(arr[i].id) {
					var criticalArr = criticalpath.split(':'),
						strokeRed = showCriticalPath && $.inArray(arr[i].id, criticalArr)>=0 ? 'stroke:red' : '';
					var start = arr[i].start ? new Date(arr[i].start) : false,
						end = arr[i].end ? new Date(arr[i].end) : new Date().getTime(),
						actstart = arr[i].actstart ? new Date(arr[i].actstart) : false,
						actend = arr[i].actend ? new Date(arr[i].actend) : new Date().getTime();
					var timeSlot_DateLength = ((end - start) / 86400000 + 1) * itemW,
						timeSlot_actDateLength = actstart && ((actend - actstart) / 86400000 + 1) * itemW,
						x = (start - startPoint) / 86400000 * itemW,
						actx = actstart && (actstart - startPoint) / 86400000 * itemW,
						progress = timeSlot_DateLength * arr[i].progress / 100;
					//depends_Line
					if(arr[i].depends) {
						svgHtml.push(getFrom_point(x, 28 * i + 49, arr[i].depends,arr[i].level));
					}
					//start-to-end
					svgHtml.push('<rect x="');
					svgHtml.push(x);
					svgHtml.push('"y="');
					svgHtml.push(28 * i + 7 + 44);
					svgHtml.push('"width="');
					svgHtml.push(timeSlot_DateLength);
					svgHtml.push('"height="20"style="fill:rgba(59,191,103,1);stroke-width:2;' + strokeRed + '"/>');
					svgHtml.push('<text x="' + (x + timeSlot_DateLength + 10) + '" y="' + (28 * i + 66) + '" fill="#6E6E6E">' + arr[i].name + '</text>');
					//progress
					svgHtml.push('<rect x="');
					svgHtml.push(x);
					svgHtml.push('"y="');
					svgHtml.push(28 * i + 7 + 44);
					svgHtml.push('"width="');
					svgHtml.push(progress);
					svgHtml.push('"height="20"style="fill:rgba(0,0,0,0.5);stroke-width:1;"/>');
					svgHtml.push('<text x="' + (x - 40) + '" y="' + (28 * i + 66) + '" fill="#8C8C8C">' + arr[i].progress + '%</text>');
					//actstart-to-actend
					if(actstart) {
						svgHtml.push('<rect x="');
						svgHtml.push(actx);
						svgHtml.push('"y="');
						svgHtml.push(26 * i + 12 + 44);
						svgHtml.push('"width="');
						svgHtml.push(timeSlot_actDateLength);
						svgHtml.push('"height="10"style="fill:rgba(255,0,0,1);stroke-width:1;"/>');
					}
				}
			}
			svgHtml.push('</svg>');
			$(this).parent().append(svgHtml.join(''));
		},
		//提示窗口
		toolTip: function(txt) {
			if($('#toolTip').length) {
				$('#toolTip').html(txt + '<button class="icon-close"></button>').show();
			} else {
				var tipHtml = '<div id="toolTip"><p>' + txt + '<p><button class="icon-close"></button></div>';
				$(this).append(tipHtml).show();
				$(this).find('button').on('click', function() {
					$('#toolTip').hide();
				});
			}
			setTimeout(function() {
				$('#toolTip').hide();
			}, 5000);
		}
	});
})(jQuery);