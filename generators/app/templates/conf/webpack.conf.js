const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

module.exports = <%- json(webpackConf) %>;
