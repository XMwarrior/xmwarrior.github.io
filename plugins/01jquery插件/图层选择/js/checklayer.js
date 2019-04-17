/*切换底图*/
var $basicsLayer_ul = $('.basicsLayer ul'),
	$basicsLayer_li = $('.basicsLayer li');
$basicsLayer_ul.on('click', function() {
	var $active_item = $(this).find('.active');
	/*switch(true){
	    case $(this).is('.base_map1'):
	        $active_item.is('.d3') ? changeBaseMap(map1, '2d', $active_item.siblings()[0]) : changeBaseMap(map1, 'st', $active_item.siblings()[0]);
	        break;
	    case $(this).is('.base_map2'):
	        $active_item.is('.d3') ? changeBaseMap(map2, '2d', $active_item.siblings()[0]) : changeBaseMap(map2, 'st', $active_item.siblings()[0]);
	        break;
	    case $(this).is('.base_map3'):
	        $active_item.is('.d3') ? changeBaseMap(map3, '2d', $active_item.siblings()[0]) : changeBaseMap(map3, 'st', $active_item.siblings()[0]);
	        break;
	    case $(this).is('.base_map4'):
	        $active_item.is('.d3') ? changeBaseMap(map4, '2d', $active_item.siblings()[0]) : changeBaseMap(map4, 'st', $active_item.siblings()[0]);
	        break;
	    default:
	        break;
	}*/

	$active_item.animate({
		left: '-5px',
		top: '-5px'
	}, 200).removeClass('active').siblings('li').
	animate({
		left: 0,
		top: 0
	}, 200).addClass('active');
});
//切换历史影像
var $yearsLayer_li = $('.yearsLayer li');
$yearsLayer_li.on('click', function(e) {
	$(this).siblings().removeAttr('class').each(function(index) {
		$(this).addClass('z' + (index + 1));
	});
	$(this).attr('class', 'z0');
});
//倾斜摄影toggle
var $check3dBox_li = $('.check3dBox li');
$check3dBox_li.on('click', function() {
	$(this).is('.active') ? ($(this).removeClass('active'), $(this).parent().is('.checkview2')? show3d(map2, '3d', this, false) : show3d(map1, '3d', this, false)) :
		($(this).addClass('active'), $(this).parent().is('.checkview2') ? show3d(map2, '3d', this, true) : show3d(map1, '3d', this, true));
});
/*切换图层函数*/
function checkLayer(datas, $box) {
    //console.log(datas)
    var $menv0 = $('.menv0'),
        $menv1 = $('.menv1'),
        $menv2 = $('.menv2');
    var checkFunction = function () {
        console.log(111)
    };
    var h = '<ul>', h_in = '<ul>', h_in_in='<ul>';
    for (var i = 0, len = datas.length; i < len; i++) {
        h += i === 0?'<li class="active m_'+i+'">':'<li class="m_'+i+'">';
        h += datas[i].text;
        h += '</li>';
        h_in += i === 0 ? '<li class="menv1_child m_' + i + ' active"><ul>' : '<li class="menv1_child m_' + i + '"><ul>';
        h_in_in += i === 0 ? '<li class="menv2_child m_' + i + ' active"><ul>' : '<li class="menv2_child m_' + i + '"><ul>';
        for (var a = 0, length = datas[i].children.length; a < length; a++) {
            var item0 = datas[i].children[a];
            h_in += '<li id="' + item0.id + '_anchor" menu_id="' + item0.id + '" class="' + ((i === 0 && a === 0) ? 'active' : '') + ' m_' + i + '_' + a + '">';
            h_in_in += (i === 0 && a === 0) ? '<li class="menv2_child m_' + i + '_' + a + ' active"><ul>' : '<li class="menv2_child m_' + i + '_' + a + '"><ul>';
            for (var b = 0, length2 = datas[i].children[a].children.length; b < length2; b++) {
                var item1 = datas[i].children[a].children[b];
                h_in_in +='<li id="' + item1.id + '">';
                h_in_in += item1.text;
                h_in_in += '</li>';
            }
            h_in_in += '</ul></li>';
            h_in += item0.text;
            h_in += '</li>';
        }
        h_in += '</ul></li>';
        h_in_in += '</ul></li>';
    }
    h += '</ul>';
    h_in += '</ul>';
    $menv0.html(h);
    $menv1.html(h_in);
    $menv2.html(h_in_in);
    $box.slideDown(200);
    //二级菜单点击
    $menv0.find('li').on('click', function () {
        var index = $(this).index(),
            rowId = $.trim($(this).attr('class')),
            $menv1_li = $(this).parents('.menv0').next().find('.menv1_child');
        $(this).siblings().removeClass('active').end().addClass('active');
        $menv1_li.eq(index).siblings().removeClass('active').end().addClass('active');

        !$menv1_li.eq(index).find('.active').length && ($menv1_li.eq(index).find('li:first-child').addClass('active'));
        var menv1_rowId = $.trim($menv1_li.eq(index).find('.active').attr('class').replace(/[active]/g, '')),
            $menv2_li = $(this).parents('.menv0').next().next().find('.' + rowId),
            $menv2_item = $menv2_li.find('.' + menv1_rowId);
        $menv2_li.siblings().removeClass('active').end().addClass('active');
        $menv2_item.siblings().removeClass('active').end().addClass('active');
    });
    //三级菜单点击
    $menv1.find('.menv1_child li').on('click', function () {
        var index = $(this).index(),
            rowId=$.trim($(this).attr('class')),
            parentIndex = $(this).parents('.menv1_child').index(),
           $menv2_li = $(this).parents('.menv1').next().find('.m_' + parentIndex),
           $menv2_item = $menv2_li.find('.' + rowId);
        $(this).siblings().removeClass('active').end().addClass('active');
        $menv2_li.siblings().removeClass('active').end().addClass('active');
        $menv2_item.siblings().removeClass('active').end().addClass('active');
    });
    //四级菜单点击
    $menv2.find('ul ul ul li').on('click', function () {
        $(this).parent().parent().siblings().addBack().find('li').removeClass('active');
        $(this).addClass('active');
        $(this).parents('.checkLayerBox').slideUp().prev().html($(this).text());
        //调用地图
        var mapTarget = $(this).closest(".checkLayerBox").attr("map_target");
        console.log('选择图层')
        //changeCompareLayer(mapTarget, $(this).attr("id"));
    });
};
