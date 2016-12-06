const webpack = require('webpack');
<% if (test === false || framework === 'angular2') { -%>
const conf = require('./gulp.conf');
<% } -%>
<% if (test === false) { -%>
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
<%   if (dist === true) { -%>
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('../package.json');
<%   } -%>
const autoprefixer = require('autoprefixer');

<% } -%>
module.exports = <%- json(webpackConf) %>;
