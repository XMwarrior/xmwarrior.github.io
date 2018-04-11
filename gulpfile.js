var gulp = require("gulp"),
	babel = require("gulp-babel"),//转义es6
	watch = require("gulp-watch"),//自动刷新
	less=require("gulp-less"),//转义less
	cleanCss=require("gulp-clean-css"),//压缩css
	imagemin=require("gulp-imagemin"),//压缩图片
	base64=require("gulp-base64"),//(图片转base64,默认转换规则见api)
	uglify = require('gulp-uglify'),//压缩js
	notify = require('gulp-notify'),//展示错误信息
    plumber = require('gulp-plumber'),//解决报错进程中断问题
    rename= require('gulp-rename'),//重命名文件名
    autoprefixer = require('gulp-autoprefixer'),//兼容浏览器前缀
    concat = require('gulp-concat');//文件合并
var config = {
	es6file: 'src/js/*.js',
	es5file: 'dist/js',
	less:['src/css/*.less', '!src/css/{reset,test,main}.less'],//不生成reset.less、test.less
	css:'dist/css',
	imgfrom:'src/img/*.{png,jpg,gif,ico}',
	imgto:'dist/img'
};
//es6转义
gulp.task("babeljs", function() {
	return gulp.src(config.es6file)
		.pipe(babel())
		.pipe(uglify())
		.pipe(concat('index.js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.es5file));
});
gulp.task("watch", function() {
	gulp.watch(config.es6file, ['babeljs']);
});
//less转义
gulp.task("less", function() {
	return gulp.src(config.less)
	    .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(less())
		.pipe(base64())
		.pipe(autoprefixer())
		.pipe(cleanCss())
		//.pipe(concat('index.css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.css));
});
gulp.task("watchLess", function() {
	gulp.watch(config.less, ['less']);
});
//img压缩
gulp.task('imagemin', function () {
    gulp.src(config.imgfrom)
        .pipe(imagemin({
            optimizationLevel: 3, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(config.imgto));
});
gulp.task("watchImagemin", function() {
	gulp.watch(config.imgfrom, ['imagemin']);
});
//指令合并
gulp.task('default', ['watch','watchLess','watchImagemin', 'babeljs','less','imagemin']);