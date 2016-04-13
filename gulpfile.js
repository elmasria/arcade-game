

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

gulp.task('default', ['dist'], function(){

});

gulp.task('dist', [
	'copy-html',
	'copy-images',
	'copy-js',
	'styles',
	'server'
]);

gulp.task('copy-html', function(){
	gulp.src('./index.html')
	.pipe(gulp.dest('./dist'))
	.pipe(reload({stream: true}));
});

gulp.task('copy-js', function(){
	gulp.src('js/**/*.js')
	.pipe(gulp.dest('dist/js'))
	.pipe(reload({stream: true}));
});


gulp.task('copy-images', function(){
	gulp.src('images/**/*')
	.pipe(gulp.dest('dist/images'));
});

gulp.task('styles', function () {
	gulp.src('css/**/*.css')
	.pipe(gulp.dest('dist/css'));
});

gulp.task('server', function(){
	browserSync.init({
		server: {
			baseDir: './dist/'
		},
		port: 8080,
		ui: {
    		port: 8000
		}
	});
	gulp.watch('./css/**/*.css',['styles']);
	gulp.watch('./index.html', ['copy-html']);
	gulp.watch('./js/**/*.js',['copy-js']);
});