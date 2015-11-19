var gulp = require('gulp')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
    files: ['app/**/*', '!app/**/*.js'],
    js: ['app/**/*.js'],
    filesdist: ['dist/**/*', '!dist/**/*.js'],
    jsdist: ['dist/**/*.js'],
}

gulp.task('clean:js', function() {
    del(paths.jsdist);
});
gulp.task('clean:files', function() {
    del(paths.filesdist);
});

gulp.task('js', ['clean:js'], function () {
    gulp.src(paths.js)
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concat('all.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
})

gulp.task('files', ['clean:files'], function () {
    gulp.src(paths.files)
        .pipe(gulp.dest('dist'))
})

gulp.task('build', ['files', 'js']);

gulp.task('watch', function() {
    gulp.watch(paths.files, ['files']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('deploy', ['build'], function() {
    return gulp.src("./dist/**/*")
        .pipe(deploy())
});
