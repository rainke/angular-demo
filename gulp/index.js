var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var through = require('through2');
var config = require('./config.js');
var browserSync = require('browser-sync').create();
var historyApiFallback = require('connect-history-api-fallback');
var url = require('url');
var proxy = require('proxy-middleware');

var opts = {
	entries:'./app/app.js',
	requires:[],
	debug: true,
	cache: {},
    packageCache: {},
    fullPaths: true
}

var bundler = watchify(browserify(opts));
bundler.external('angular');
bundler.external('angular-ui-bootstrap');
bundler.external('angular-block-ui');
bundler.external('angular-ui-router');

gulp.task('build:app', bundle);
gulp.task('build:vendor', function() {
	var bundler = browserify({});
	bundler.require('angular');
	bundler.require('angular-ui-router');
	bundler.require('angular-ui-bootstrap');
	bundler.require('angular-block-ui');
	
	return bundler.bundle().pipe(source('vendor.js')).pipe(gulp.dest('./build'));
})

gulp.task('watch-app', function() {
	bundler.on('update', function(ids) {
		ids.forEach(function(v) {
			console.log('bundle file:'+v)
		});
		gulp.start('build:app');
	});
	return bundle();
})

gulp.task('default', ['browser-sync']);


function bundle() {
	return bundler.bundle()
	.on('error', function(err,cb) {
		console.log(err.message);
		this.emit('end');
	})
	.pipe(source('app.js'))
	.pipe(gulp.dest('./build'))
	.pipe(browserSync.stream());
}

gulp.task('view', function() {
	return gulp.src('tpl/**/*.html')
		.pipe(templateCache({
	      module: 'app.templates',
	      standalone: true
	    }))
		.pipe(gulp.dest('./public'))
})

gulp.task('watch-view', function() {
	gulp.start('view');
	gulp.watch(config.view.src,function(a,b) {
		gulp.start('view');
	});
})

// gulp.task('browser-sync', ['watch-app', 'build:vendor', 'watch-view'], function() {
// 	browserSync.init({
//     //在html5mode中不能刷新页面
//     serveStatic:[{
//       dir:'./',
//     }],
//     //代理：用于代理本地的ajax请求
//     // middleware:[ historyApiFallback() ],
//     proxy: {
//     	target:"https://api.douban.com/"
//     }
//   })
// })
gulp.task('browser-sync', ['watch-app', 'build:vendor', 'watch-view'], function() {
  var proxyOptions = url.parse('https://api.douban.com/v2/');
  //   /v2/x => https://api.douban.com/v2/x
  proxyOptions.route = '/v2';
  browserSync.init({
    server: {
     baseDir:'./',
     middleware: [ historyApiFallback(), proxy(proxyOptions)]
    }
  })
})