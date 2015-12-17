const gulp = require('gulp');
const gutil = require('gulp-util');

const webpack = require('webpack');
const webpackConf = require('../conf/webpack.conf');
const webpackDistConf = require('../conf/webpack-dist.conf');

<% if (framework !== 'react') { -%>

const browserSync = require('browser-sync');
<% } -%>

gulp.task('scripts', done => {
  webpackWrapper(false, webpackConf, done);
});

gulp.task('scripts:watch', done => {
  webpackWrapper(true, webpackConf, done);
});

gulp.task('scripts:dist', done => {
  webpackWrapper(false, webpackDistConf, done);
});

function webpackWrapper(watch, conf, done) {
  var webpackBundler = webpack(conf);

  var webpackChangeHandler = function(err, stats) {
    if(err) {
      conf.errorHandler('Webpack')(err);
    }
    gutil.log(stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false
    }));
    if(watch) {
      watch = false;
      done();
<% if (framework == 'react') { -%>
    }
<% } else { -%>
    } else {
      browserSync.reload();
    }
<% } -%>
  };

  if (watch) {
    webpackBundler.watch(200, webpackChangeHandler);
  } else {
    webpackBundler.run(webpackChangeHandler);
    done();
  }
}
