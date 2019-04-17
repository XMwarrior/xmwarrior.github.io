$(function() {
	"use strict"
	var $xGantt = $('#xGantt'),
		$split = $('.xSplit'),
		$xGrid = $('#xGrid'),
		$xGrid_table = $('#xGrid_table'),
		$xMap = $('#xMap'),
		$xToolbar = $('.xToolbar'),
		$toolBtn = $('.xToolbar span'),
		$xMap_table = $('#xMap_table'),
		windowHeight = $(window).height(),
		ishover = false,
		scrollIsLeft,
		canResize = true;
	window.$selectedRow = null;
	window.showLayer = 7;
	window.trArr = [];
	window.showCriticalPath = false;
	/*初始化xGrid数据*/
	$.getJSON('gantt.json', function(r) {
		//console.log(r);
		$.deepClone(r);
		$xGrid_table.treeGrid({
			data: r,
			align: 'center',
			columns: [{
					field: 'id',
					title: 'id',
					width: '50px'
				},
				{
					field: 'name',
					title: '项目名称',
					width: '110px',
					nowrap: true,
					align: 'left'
				},
				{
					field: 'start',
					title: '计划开始时间',
					width: '110px'
				},
				{
					field: 'end',
					title: '计划结束时间',
					width: '110px'
				},
				{
					field: 'duration',
					title: '计划周期',
					width: '110px'
				},
				{
					field: 'actstart',
					title: '实际开始时间',
					width: '110px'
				},
				{
					field: 'actend',
					title: '实际结束时间',
					width: '110px'
				},
				{
					field: 'actduration',
					title: '实际周期',
					width: '110px'
				},
				{
					field: 'progress',
					title: '进度（%）',
					width: '100px'
				},
				{
					field: 'depends',
					title: '依赖',
					width: '0px'
				}
			]
		});
	});
	/*初始化xMap宽度*/
	$xGantt.height(windowHeight - 60);
	$split.css({
		height: windowHeight - 60,
		left: $xGrid.width() - 15,
		top: 60
	});
	$xMap.css({
		left: $xGrid.width() - 5,
		width: $xGantt.width() - $xGrid.width() + 5
	});
	/*window@resize*/
	$(window).on('resize', function() {
		if(canResize) {
			$xGrid.width('60%');
			$xMap.css({
				left: $xGrid.width() + 10,
				width: $xGantt.width() - $xGrid.width() - 10
			});
			$split.css('left', $xGrid.width());
		}
	});
	/*xSplit条拖动事件*/
	$split.on('mousedown', function() {
		ishover = true;
	});
	$xGantt.on('mousemove', function(e) {
		if(ishover) {
			$xGrid.width(e.pageX);
			$xMap.css({
				width: $xGantt.width() - e.pageX + 5,
				left: e.pageX - 5
			});
			$split.css('left', e.pageX - 15);
		}
		return false;
	}).on('mouseup', function() {
		ishover = false;
	});
	/*同步scroll*/
	$xGantt.find('>div').hover(function() {
		scrollIsLeft = $(this).is('#xGrid');
	}, function() {
		scrollIsLeft = !scrollIsLeft;
	}).on('scroll', function() {
		scrollIsLeft ? $xMap.scrollTop($xGrid.scrollTop()) : $xGrid.scrollTop($xMap.scrollTop());
		if($(this).is('#xGrid')) {
			var $thead = $(this).find('.thead');
			$thead.css('left', -$(this).scrollLeft());
		} else {
			var $thead = $(this).find('.thead1');
			$thead.css('top', $xMap.scrollTop());
		}
	});
	/*toolTip@click*/
	$toolBtn.on('click', function() {
		var targetClassName = $(this).attr('class');
		switch(targetClassName) {
			case 'icon-print':
				canResize = false;
				$xToolbar.hide();
				$xGrid.css({
					width: '100%',
					height: $xGrid_table.height() - 223,
					overflow: 'hidden'
				});
				$split.css('left', '100%');
				$xMap.css({
					width: '100%',
					height: $xGrid_table.height() - 223,
					left: '0',
					top: $xGrid_table.height() - 223,
					position: 'relative',
					overflow: 'hidden'
				});
				window.print();
				canResize = true;
				$xToolbar.show();
				$xGrid.css({
					width: '60%',
					overflow: 'auto',
					height: windowHeight - 60,
				});
				$split.css('left', $xGrid.width() - 15);
				$xMap.css({
					top: 0,
					width:$xGantt.width() - $xGrid.width() + 5,
					left: $xGrid.width() - 5,
					height: windowHeight - 60,
					position: 'absolute',
					overflow: 'auto'
				});
				break;
			case 'icon-expand':
				if($selectedRow) {
					var $img = $selectedRow.find('img'),
						level = $selectedRow.attr('data-level'),
						$Childrens = $selectedRow.nextUntil('tr[data-level=' + level + ']').filter(function() {
							return +$(this).attr('data-level') >= (+level + 1);
						});
					if($img.length && $img.attr('src') === 'img/toggle_expand.png') {
						$img.attr('src', 'img/toggle_collapse.png');
						$Childrens.slideDown(function() {
							drawMap();
						}).attr('class', 'collapse').find('img').attr('src', 'img/toggle_collapse.png');
					}
				}
				break;
			case 'icon-collpase':
				if($selectedRow) {
					var $img = $selectedRow.find('img'),
						level = $selectedRow.attr('data-level'),
						$Childrens = $selectedRow.nextUntil('tr[data-level=' + level + ']').filter(function() {
							return +$(this).attr('data-level') >= (+level + 1);
						});
					if($img.length && $img.attr('src') === 'img/toggle_collapse.png') {
						$img.attr('src', 'img/toggle_expand.png');
						$Childrens.slideUp(function() {
							drawMap();
						});
					}
				}
				break;
			case 'icon-enlarge':
				if(showLayer > 0) {
					showLayer--;
					console.log(showLayer)
					$('#xMap_table').mapGrid({
						rowData: trArr,
						criticalpath: criticalpath
					});
				}
				break;
			case 'icon-shrink':
				if(showLayer < 8) {
					showLayer++;
					console.log(showLayer)
					$('#xMap_table').mapGrid({
						rowData: trArr,
						criticalpath: criticalpath
					});
				}
				break;
			case 'icon-criticalPath':
				showCriticalPath = !showCriticalPath;
				drawMap();
				break;
			default:
				break;
		}
	});
});