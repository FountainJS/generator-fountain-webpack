<% if (test === false) { -%>
const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
<%   if (dist === true) { -%>
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FailPlugin = require('webpack-fail-plugin');
const pkg = require('../package.json');
<%   } -%>
const autoprefixer = require('autoprefixer');

<% } -%>
module.exports = <%- json(webpackConf) %>;
