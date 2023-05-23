const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass')); // Explicitly set the Sass compiler
const concat = require('gulp-concat');
//const uglify = require('gulp-uglify');

gulp.task('scripts', function () {
    return gulp
        .src('scripts/login.js')
        //.pipe(concat('bundle.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('wwwroot/js'));
});

gulp.task('sass-login', function () {
    return gulp
        .src('content/sass/login.scss')
        .pipe(sass())
        .pipe(gulp.dest('wwwroot/css'));
});

gulp.task('default', gulp.parallel('sass-login', 'scripts'));


