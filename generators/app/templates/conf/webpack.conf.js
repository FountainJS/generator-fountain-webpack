const webpack = require('webpack');
<% if (test === false || framework === 'angular2') { -%>
const conf = require('./gulp.conf');
<% } -%>
<% if (test === false) { -%>
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
<%   if (dist === true) { -%>
const FailPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
<%     if (framework !== 'angular2') { -%>
const pkg = require('../package.json');
<%     } -%>
<%   } -%>
const autoprefixer = require('autoprefixer');

<% } -%>
module.exports = <%- json(webpackConf) %>;
