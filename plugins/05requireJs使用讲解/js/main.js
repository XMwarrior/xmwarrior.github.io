console.log('成功');
require.config({
	baseUrl:'js',//指定包含插件的文件夹路径
	paths: {
		'jquery': 'jquery1.8.3.min'
	},
	shim: {
		css3Slide: {//名称一定要与js文件名称一致
			deps:[],
			exports: 'mySlide'//一定要与自定义插件css3里的全局变量name一致
		}
	}
})
require(['jquery', 'css3Slide'], function($, mySlide) {//如果js插件相互依赖，则按依赖顺序从左到右编写数组
	$('#a').html('加载成功');
	var data = ['img/sale.png', 'img/sale.png', 'img/sale.png'];
	console.log(mySlide)
	mySlide('SlideBox', data, 2000, 700);

});