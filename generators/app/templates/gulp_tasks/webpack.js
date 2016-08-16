const gulp = require('gulp');
const gutil = require('gulp-util');

const webpack = require('webpack');
const webpackConf = require('../conf/webpack.conf');
const webpackDistConf = require('../conf/webpack-dist.conf');
const gulpConf = require('../conf/gulp.conf');
<% if (js === 'babel') { -%>
const env = require('gulp-env');
<% } -%>
<% if (framework !== 'react') { -%>
const browsersync = require('browser-sync');
<% } -%>

gulp.task('webpack:dev', done => {
  env.set({BABEL_ENV: 'dev'});
  webpackWrapper(false, webpackConf, done);
});

gulp.task('webpack:watch', done => {
  env.set({BABEL_ENV: 'dev'});
  webpackWrapper(true, webpackConf, done);
});

gulp.task('webpack:dist', done => {
  env.set({BABEL_ENV: 'production'});
  webpackWrapper(false, webpackDistConf, done);
});

function webpackWrapper(watch, conf, done) {
  const webpackBundler = webpack(conf);

  const webpackChangeHandler = (err, stats) => {
    if (err) {
      gulpConf.errorHandler('Webpack')(err);
    }
    gutil.log(stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false
    }));
    if (done) {
      done();
      done = null;
<% if (framework !== 'react') { -%>
    } else {
      browsersync.reload();
    }
<% } else { -%>
    }
<% } -%>
  };

  if (watch) {
    webpackBundler.watch(200, webpackChangeHandler);
  } else {
    webpackBundler.run(webpackChangeHandler);
  }
}
