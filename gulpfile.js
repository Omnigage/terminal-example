// Add our dependencies
var gulp = require('gulp'), // Main Gulp module
  concat = require('gulp-concat'), // Gulp File concatenation plugin
  connect = require('gulp-connect'); // Gulp Web server runner plugin

// Configuration
var configuration = {
  paths: {
    src: {
      html: './*.html',
      css: [
        './node_modules/bootstrap/dist/css/bootstrap.min.css',
        './node_modules/pickr-widget/dist/pickr.min.css',
        './node_modules/notyf/dist/notyf.min.css',
        './css/styles.css'
      ],
      js: [
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/pickr-widget/dist/pickr.min.js',
        './node_modules/notyf/dist/notyf.min.js',
        './js/main.js'
      ]
    },
    dist: './dist'
  },
  localServer: {
    port: 8001,
    url: 'http://localhost:8001/'
  }
};

// Gulp task to copy HTML files to output directory
gulp.task('html', function() {
  gulp.src(configuration.paths.src.html)
    .pipe(gulp.dest(configuration.paths.dist))
    .pipe(connect.reload());
});

// Gulp task to concatenate our css files
gulp.task('css', function () {
  gulp.src(configuration.paths.src.css)
    .pipe(concat('site.css'))
    .pipe(gulp.dest(configuration.paths.dist + '/css'))
    .pipe(connect.reload());
});

// Gulp task to concatenate our js files
gulp.task('js', function () {
  gulp.src(configuration.paths.src.js)
    .pipe(concat('site.js'))
    .pipe(gulp.dest(configuration.paths.dist + '/js'))
    .pipe(connect.reload());
});

// Gulp task to create a web server
gulp.task('connect', function () {
  connect.server({
    root: 'dist',
    port: configuration.localServer.port,
    livereload: true
  });
});

// Watch the file system and reload the website automatically
gulp.task('watch', function () {
  gulp.watch(configuration.paths.src.html, ['html']);
  gulp.watch(configuration.paths.src.css, ['css']);
  gulp.watch(configuration.paths.src.js, ['js']);
});

// Gulp build
gulp.task('build', ['html', 'css', 'js']);

// Gulp default task
gulp.task('default', ['html', 'css', 'js', 'connect', 'watch']);
