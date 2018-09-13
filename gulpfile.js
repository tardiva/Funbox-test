'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    reload = browserSync.reload,
    clean = require('gulp-clean'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    runSequence = require('run-sequence'),
    util = require('gulp-util'),
    newer = require('gulp-newer'),
    image = require('gulp-image');


// var listing of files for docs build
var filesToDist = [
    './src/img/**/*.*',
    './src/fonts/**/*.*'
];

// Use for stand-alone autoprefixer
var gulpautoprefixer = require('gulp-autoprefixer');

// Build Handlebars
gulp.task('build:hbs', ['clean:html'], function () {
    var products = require('./src/data/products.json');
    var templateData = {products: products },
        options = {
            partials : { },
            batch : ['./src/partials'],
            helpers : { }
        };

    return gulp.src('src/index.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('docs'));
});

// Build CSS
gulp.task('build:css', ['clean:css'], function() {
    gulp.src('./src/sass/{,*/}*.{scss,sass}')
        .pipe(sourcemaps.init())
        .pipe(sass({
        errLogToConsole: true,
        outputStyle: 'expanded' //alt options: nested, compact, compressed
    }))
        .pipe(gulpautoprefixer({
        browsers: ['last 4 versions'],
        cascade: false
    }))
        .pipe(!!util.env.production ? cleanCSS() : util.noop())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./docs/css'))
        .pipe(reload({stream: true}));
});

// Build JS
gulp.task('build:js', ['clean:js'], function () {
    return gulp.src('src/js/main.js')
        .pipe(!!util.env.production ? uglify() : util.noop())
        .pipe(gulp.dest('./docs/js'));
});

// Optimize images that changed and move them to /docs dir
gulp.task('images', function() {
    return gulp.src('src/img/**/*')
        .pipe(newer('./docs/img'))
        .pipe(image())
        .pipe(gulp.dest('./docs/img'));
});

// Move font assets that changed to /docs dir
gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(newer('./docs/fonts'))
        .pipe(gulp.dest('./docs/fonts'));
});

// Static Server + watching scss/hbs/js files
gulp.task('serve', ['build:css', 'build:hbs'], function() {

    browserSync.init({
        server: "./docs/",
        port: 8080
    });

    gulp.watch('./src/**/*.hbs', ['build:hbs']);
    gulp.watch('./src/sass/{,*/}*.{scss,sass}', ['build:css']);
    gulp.watch('./src/js/*.*', ['build:js']);
    gulp.watch('./src/img/*.{png,jpg,jpeg,gif,svg}', {cwd: './'} ['images']);
    gulp.watch('./src/fonts/*.*', {cwd: './'} ['fonts']);
    gulp.watch("./docs/index.html").on('change', browserSync.reload);
});

// Resource cleaning tasks
gulp.task('clean', function(){
  return gulp.src(['docs/*'], {read:false})
  .pipe(clean());
});

gulp.task('clean:html', function(){
    return gulp.src(['docs/index.html'], {read:false})
        .pipe(clean());
});

gulp.task('clean:css', function(){
    return gulp.src(['docs/css/*'], {read:false})
        .pipe(clean());
});

gulp.task('clean:js', function(){
    return gulp.src(['docs/js/*'], {read:false})
        .pipe(clean());
});

// Move assets and scripts to docs directory
gulp.task('move', function() {
    return gulp.src(filesToDist, {base: './src/'})
        .pipe(gulp.dest('docs'));
});

// Build. Use production flag if needed
gulp.task('build', function () {
    runSequence('clean',
        ['build:css', 'build:hbs', 'build:js'],
        'move'
    );
});

gulp.task('default', ['build', 'serve']);
