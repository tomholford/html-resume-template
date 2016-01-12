// .pipe(debug())

var gulp = require('gulp');
var browserSync = require('browser-sync');
var debug = require('gulp-debug');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  });
});

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(debug())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(debug())
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(debug())
    .pipe(gulp.dest('dist'))
    .pipe(debug());
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('jshint', function() {
  return gulp.src(['app/js/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/scss/**/*.sass', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('build', function(callback) {
  runSequence('clean:dist', 'jshint', 'sass', ['useref', 'images', 'fonts'],
    callback
  );
});

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync', 'watch'],
    callback
  );
});
