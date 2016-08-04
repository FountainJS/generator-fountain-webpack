const test = require('ava');
const _ = require('lodash');
const lit = require('fountain-generator').lit;
const webpackConf = require('../../generators/app/conf');

function merge(args) {
  const result = {};
  _.mergeWith(result, ...args, (x, y) => {
    if (_.isArray(x)) {
      return _.uniq(x.concat(y));
    }
  });
  return result;
}

const conf = {
  module: {
    loaders: [
      {test: lit`/\.json$/`, loaders: ['json']}
    ]
  }
};

test('conf dev with react/css/babel', t => {
  const options = {
    test: false,
    dist: false,
    framework: 'react',
    css: 'css',
    js: 'babel'
  };
  const expected = merge([{}, conf, {
    module: {
      loaders: [
        {
          test: lit`/\\.css$/`,
          loaders: ['style', 'css', 'postcss']
        },
        {
          test: lit`/\\.js$/`,
          exclude: lit`/node_modules/`,
          loaders: ['react-hot', 'babel']}
      ]
    },
    plugins: [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`,
      lit`new webpack.HotModuleReplacementPlugin()`
    ],
    postcss: lit`() => [autoprefixer]`,
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: lit`path.join(process.cwd(), conf.paths.tmp)`,
      filename: 'index.js'
    },
    entry: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      lit`\`./\${conf.path.src('index')}\``
    ]
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf dev with react/scss/babel', t => {
  const options = {
    test: false,
    dist: false,
    framework: 'react',
    css: 'scss',
    js: 'babel'
  };
  const expected = merge([{}, conf, {
    module: {
      loaders: [
        {
          test: lit`/\\.(css|scss)$/`,
          loaders: ['style', 'css', 'sass', 'postcss']
        },
        {
          test: lit`/\\.js$/`,
          exclude: lit`/node_modules/`,
          loaders: ['react-hot', 'babel']}
      ]
    },
    plugins: [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`,
      lit`new webpack.HotModuleReplacementPlugin()`
    ],
    postcss: lit`() => [autoprefixer]`,
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: lit`path.join(process.cwd(), conf.paths.tmp)`,
      filename: 'index.js'
    },
    entry: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      lit`\`./\${conf.path.src('index')}\``
    ]
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf dev with react/less/babel', t => {
  const options = {
    test: false,
    dist: false,
    framework: 'react',
    css: 'less',
    js: 'babel'
  };
  const expected = merge([{}, conf, {
    module: {
      loaders: [
        {
          test: lit`/\\.(css|less)$/`,
          loaders: ['style', 'css', 'less', 'postcss']
        },
        {
          test: lit`/\\.js$/`,
          exclude: lit`/node_modules/`,
          loaders: ['react-hot', 'babel']}
      ]
    },
    plugins: [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`,
      lit`new webpack.HotModuleReplacementPlugin()`
    ],
    postcss: lit`() => [autoprefixer]`,
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: lit`path.join(process.cwd(), conf.paths.tmp)`,
      filename: 'index.js'
    },
    entry: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      lit`\`./\${conf.path.src('index')}\``
    ]
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf test with react/css/typescript', t => {
  const options = {
    test: true,
    dist: false,
    framework: 'react',
    css: 'css',
    js: 'typescript'
  };
  const expected = merge([{}, conf, {
    plugins: [],
    module: {
      loaders: [
        {
          test: lit`/\\.tsx$/`,
          exclude: lit`/node_modules/`,
          loaders: ['ts']
        }
      ]
    },
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx']
    },
    externals: lit`{
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'text-encoding': 'window'
  }`,
    ts: {
      configFileName: 'tsconfig.json'
    },
    tslint: {
      configuration: lit`require('../tslint.json')`
    }
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf with angular1/scss/js', t => {
  const options = {
    test: false,
    dist: true,
    framework: 'angular1',
    css: 'scss',
    js: 'js'
  };
  const expected = merge([{}, conf, {
    module: {
      loaders: [
        {
          test: lit`/\\.(css|scss)$/`,
          loaders: lit`ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css?minimize!sass!postcss'
        })`
        },
        {
          test: lit`/\\.js$/`,
          exclude: lit`/node_modules/`,
          loaders: ['ng-annotate']
        },
        {
          test: lit`/\.html$/`,
          loaders: ['html']
        }
      ]
    },
    plugins: [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`,
      lit`new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true} // eslint-disable-line camelcase
    })`,
      lit`new SplitByPathPlugin([{
      name: 'vendor',
      path: path.join(__dirname, '../node_modules')
    }])`,
      lit`new ExtractTextPlugin('index-[contenthash].css')`
    ],
    postcss: lit`() => [autoprefixer]`,
    output: {
      path: lit`path.join(process.cwd(), conf.paths.dist)`,
      filename: '[name]-[hash].js'
    },
    entry: {
      app: lit`\`./\${conf.path.src('index')}\``
    }
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf with angular1/scss/js', t => {
  const options = {
    test: false,
    dist: true,
    framework: 'angular1',
    css: 'scss',
    js: 'js'
  };
  const expected = merge([{}, conf, {
    module: {
      loaders: [
        {
          test: lit`/\\.(css|scss)$/`,
          loaders: lit`ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css?minimize!sass!postcss'
        })`
        },
        {
          test: lit`/\\.js$/`,
          exclude: lit`/node_modules/`,
          loaders: ['ng-annotate']
        },
        {
          test: lit`/\.html$/`,
          loaders: ['html']
        }
      ]
    },
    plugins: [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`,
      lit`new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true} // eslint-disable-line camelcase
    })`,
      lit`new SplitByPathPlugin([{
      name: 'vendor',
      path: path.join(__dirname, '../node_modules')
    }])`,
      lit`new ExtractTextPlugin('index-[contenthash].css')`
    ],
    postcss: lit`() => [autoprefixer]`,
    output: {
      path: lit`path.join(process.cwd(), conf.paths.dist)`,
      filename: '[name]-[hash].js'
    },
    entry: {
      app: lit`\`./\${conf.path.src('index')}\``
    }
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf with angular1/styl/typescript', t => {
  const options = {
    test: false,
    dist: true,
    framework: 'angular1',
    css: 'styl',
    js: 'typescript'
  };
  const expected = merge([{}, conf, {
    module: {
      loaders: [
        {
          test: lit`/\\.(css|styl|stylus)$/`,
          loaders: lit`ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css?minimize!stylus!postcss'
        })`
        },
        {
          test: lit`/\\.ts$/`,
          exclude: lit`/node_modules/`,
          loaders: ['ng-annotate', 'ts']
        },
        {
          test: lit`/\.html$/`,
          loaders: ['html']
        }
      ]
    },
    plugins: [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`,
      lit`new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true} // eslint-disable-line camelcase
    })`,
      lit`new SplitByPathPlugin([{
      name: 'vendor',
      path: path.join(__dirname, '../node_modules')
    }])`,
      lit`new ExtractTextPlugin('index-[contenthash].css')`
    ],
    postcss: lit`() => [autoprefixer]`,
    output: {
      path: lit`path.join(process.cwd(), conf.paths.dist)`,
      filename: '[name]-[hash].js'
    },
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.ts']
    },
    entry: {
      app: lit`\`./\${conf.path.src('index')}\``
    },
    ts: {
      configFileName: 'tsconfig.json'
    },
    tslint: {
      configuration: lit`require('../tslint.json')`
    }
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf with angular2/less/typescript', t => {
  const options = {
    test: false,
    dist: true,
    framework: 'angular2',
    css: 'less',
    js: 'typescript'
  };
  const expected = merge([{}, conf, {
    module: {
      loaders: [
        {
          test: lit`/\\.(css|less)$/`,
          loaders: lit`ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css?minimize!less!postcss'
        })`
        },
        {
          test: lit`/\\.ts$/`,
          exclude: lit`/node_modules/`,
          loaders: ['ts']
        },
        {
          test: lit`/\.html$/`,
          loaders: ['html']
        }
      ]
    },
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.ts']
    },
    plugins: [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`,
      lit`new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })`,
      lit`new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true} // eslint-disable-line camelcase
    })`,
      lit`new SplitByPathPlugin([{
      name: 'vendor',
      path: path.join(__dirname, '../node_modules')
    }])`,
      lit`new ExtractTextPlugin('index-[contenthash].css')`
    ],
    postcss: lit`() => [autoprefixer]`,
    output: {
      path: lit`path.join(process.cwd(), conf.paths.dist)`,
      filename: '[name]-[hash].js'
    },
    entry: {
      app: lit`\`./\${conf.path.src('index')}\``
    },
    ts: {
      configFileName: 'tsconfig.json'
    },
    tslint: {
      configuration: lit`require('../tslint.json')`
    }
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf with react/css/babel', t => {
  const options = {
    test: true,
    dist: false,
    framework: 'react',
    css: 'css',
    js: 'babel'
  };
  const expected = merge([{}, conf, {
    plugins: [],
    module: {
      loaders: [
        {
          test: lit`/\\.js$/`,
          exclude: lit`/node_modules/`,
          loaders: ['babel']
        },
        {
          test: lit`/\\.js$/`,
          exclude: lit`/(node_modules|.*\\.spec\\.js)/`,
          loader: 'isparta'
        }
      ]
    },
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    externals: {
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    }
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf with angular2/css/babel', t => {
  const options = {
    test: true,
    dist: false,
    framework: 'angular2',
    css: 'css',
    js: 'babel'
  };
  const expected = merge([{}, conf, {
    plugins: [],
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    module: {
      loaders: [
        {
          test: lit`/\\.js$/`,
          exclude: lit`/node_modules/`,
          loaders: ['babel']
        },
        {
          test: lit`/\.html$/`,
          loaders: ['html']
        },
        {
          test: lit`/\\.js$/`,
          exclude: lit`/(node_modules|.*\\.spec\\.js)/`,
          loader: 'isparta'
        }
      ]
    }
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf with angular2/css/js', t => {
  const options = {
    test: false,
    dist: true,
    framework: 'angular2',
    css: 'css',
    js: 'js'
  };
  const expected = merge([{}, conf, {
    module: {
      loaders: [
        {
          test: lit`/\\.css$/`,
          loaders: lit`ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css?minimize!!postcss'
        })`
        },
        {
          test: lit`/\.html$/`,
          loaders: ['html']
        }
      ]
    },
    plugins: [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`,
      lit`new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })`,
      lit`new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true} // eslint-disable-line camelcase
    })`,
      lit`new SplitByPathPlugin([{
      name: 'vendor',
      path: path.join(__dirname, '../node_modules')
    }])`,
      lit`new ExtractTextPlugin('index-[contenthash].css')`
    ],
    postcss: lit`() => [autoprefixer]`,
    output: {
      path: lit`path.join(process.cwd(), conf.paths.dist)`,
      filename: '[name]-[hash].js'
    },
    entry: {
      app: lit`\`./\${conf.path.src('index')}\``
    }
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});

test('conf with react/css/typescript', t => {
  const options = {
    test: false,
    dist: false,
    framework: 'react',
    css: 'css',
    js: 'typescript'
  };
  const expected = merge([{}, conf, {
    module: {
      loaders: [
        {
          test: lit`/\\.css$/`,
          loaders: ['style', 'css', 'postcss']
        },
        {
          test: lit`/\\.tsx$/`,
          exclude: lit`/node_modules/`,
          loaders: ['react-hot', 'ts']
        }
      ]
    },
    plugins: [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`,
      lit`new webpack.HotModuleReplacementPlugin()`
    ],
    postcss: lit`() => [autoprefixer]`,
    debug: true,
    devtool: 'cheap-module-eval-source-map',
    output: {
      path: lit`path.join(process.cwd(), conf.paths.tmp)`,
      filename: 'index.js'
    },
    resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx']
    },
    entry: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      lit`\`./\${conf.path.src('index')}\``
    ],
    ts: {
      configFileName: 'tsconfig.json'
    },
    tslint: {
      configuration: lit`require('../tslint.json')`
    }
  }]);
  const result = webpackConf(options);
  t.deepEqual(result, expected);
});
