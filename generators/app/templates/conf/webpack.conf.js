<% if (test === false || framework === 'angular2') { -%>
const webpack = require('webpack');
const conf = require('./gulp.conf');
<% } -%>
<% if (test === false) { -%>
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
<%   if (dist === true) { -%>
const ExtractTextPlugin = require('extract-text-webpack-plugin');
<%     if (framework !== 'angular2') { -%>
const pkg = require('../package.json');
<%     } -%>
<%   } -%>
const autoprefixer = require('autoprefixer');

<% } -%>
module.exports = <%- json(webpackConf) %>;
