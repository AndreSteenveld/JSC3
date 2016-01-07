var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
	replaceString: /^gulp(-|\.)([0-9]+)?/
});

const fs      = require('fs');
const del     = require('del');
const path    = require('path');
const mkdirp  = require('mkdirp');
const isparta = require('isparta');
//const esperanto	 = require('esperanto');

const manifest					= require('./package.json');
const config						= manifest.to5BoilerplateOptions;
const mainFile					= manifest.main;
const destinationFolder = path.dirname(mainFile);
const exportFileName		= path.basename(mainFile, path.extname(mainFile));

function test() {
	return gulp.src(['test/setup/node.js', 'test/unit/**/*.js'], {read: false})
		.pipe($.plumber())
		.pipe($.mocha({reporter: 'spec', globals: config.mochaGlobals}));
}

// Remove the build files
gulp.task('clean', function(cb) {
	del([destinationFolder], cb);
});

// Remove our temporary files
gulp.task('clean-tmp', function(cb) {
	del(['tmp'], cb);
});

// Lint our source code
gulp.task('lint-src', function() {
	return gulp.src(['src/**/*.js'])
		.pipe($.plumber())
		.pipe($.eslint({
			configFile: './.eslintrc',
			envs: [
				'node'
			]
		}))
		.pipe($.eslint.formatEach('stylish', process.stderr))
		.pipe($.eslint.failOnError());
});

// Lint our test code
gulp.task('lint-test', function() {
	return gulp.src(['test/unit/**/*.js'])
		.pipe($.plumber())
		.pipe($.eslint({
			configFile: './test/.eslintrc',
			envs: [
				'node'
			]
		}))
		.pipe($.eslint.formatEach('stylish', process.stderr))
		.pipe($.eslint.failOnError());
});

// Build two versions of the library
gulp.task('build', ['lint-src', 'clean'], function(done) {

	return gulp.src( ['src/**/*.js'] )
		.pipe( $.babel({ "presets": ["es2015"] }) )
		.pipe( gulp.dest( destinationFolder ) );

});

gulp.task('coverage', ['lint-src', 'lint-test'], function(done) {
	require('babel-core/register')({ "presets": ["es2015"] });
	gulp.src(['src/*.js'])
		.pipe($.plumber())
		.pipe($.istanbul({ instrumenter: isparta.Instrumenter }))
		.pipe($.istanbul.hookRequire())
		.on('finish', function() {
			return test()
			.pipe($.istanbul.writeReports())
			.on('end', done);
		});
});

// Lint and run our tests
gulp.task('test', /*['lint-src', 'lint-test'],*/ function() {
	require('babel-core/register')({ "presets": ["es2015"] });
	return test();
});

// An alias of test
gulp.task('default', ['test']);
