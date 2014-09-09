var gulp = require('gulp');
var del = require('del');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', function(cb) {
	del(['dist', cb]);
})

gulp.task('build', function() {
  return gulp.src('src/storage.js')
    .pipe(jshint({
		camelcase: true,
		curly: true,
		unused: true,
		strict: true,
	    globals: {
	    	angular: true
	    }
    }))
    .pipe(jshint.reporter(stylish))
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(concat('storage.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(concat('storage.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
})