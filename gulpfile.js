const gulp = require('gulp');
const sass = require('gulp-sass');

const SCRIPTS = {
	SASS: [
		'public/sass/*.scss'
	]
}

gulp.task('default', ['sass', 'watch']);

gulp.task('sass', () => {
	return gulp.src(SCRIPTS.SASS)
			.pipe(sass().on('error', sass.logError))
			.pipe(gulp.dest('public/css'));
});

gulp.task('watch', () => {
	gulp.watch(SCRIPTS.SASS, ['sass']);
})