const path = require('path');

const gulp = require('gulp');
const gutil = require('gulp-util');

const conf = require('../conf/gulp.conf');

const webpack = require('webpack');
const webpackConf = require('../conf/webpack.conf');

<% if (framework !== 'react') { -%>

const browserSync = require('browser-sync');
<% } -%>

gulp.task('scripts', done => {
  webpackWrapper(false, false, done);
});

gulp.task('scripts:watch', done => {
  webpackWrapper(true, false, done);
});

function webpackWrapper(watch, test, done) {
  var webpackBundler = webpack(webpackConf);

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
