'use strict';

const lit = require('fountain-generator').lit;

module.exports = function webpackConf(options) {
  const conf = {
    module: {
      loaders: [
        {test: lit`/\.json$/`, loaders: ['json']}
      ]
    }
  };

  if (options.test === false) {
    conf.plugins = [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`
    ];
    conf.postcss = lit`() => [autoprefixer]`;
  } else {
    conf.plugins = [];
  }

  if (options.dist === false) {
    conf.debug = true;
    conf.devtool = 'cheap-module-eval-source-map';
    if (options.test === false) {
      conf.output = {
        path: lit`path.join(process.cwd(), conf.paths.tmp)`,
        filename: 'index.js'
      };
    }
  } else {
    conf.output = {
      path: lit`path.join(process.cwd(), conf.paths.dist)`,
      filename: '[name]-[hash].js'
    };
  }

  if (options.js === 'typescript') {
    conf.resolve = {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.ts']
    };

    if (options.framework === 'react') {
      conf.resolve.extensions.push('.tsx');
      if (options.test === true) {
        conf.externals = lit`{
    'jsdom': 'window',
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'text-encoding': 'window'
  }`;
      }
    }
  }

  if (options.test === false) {
    const index = lit`\`./\${conf.path.src('index')}\``;
    if (options.dist === false && options.framework === 'react') {
      conf.entry = [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        index
      ];
    } else if (options.dist === true) {
      const exceptions = [];
      let vendor = 'Object.keys(pkg.dependencies)';
      if (options.framework === 'angular2') {
        exceptions.push(`'zone.js'`);
        exceptions.push(`'reflect-metadata'`);
      }
      if (options.sample === 'todoMVC') {
        exceptions.push(`'todomvc-app-css'`);
      }
      if (exceptions.length) {
        vendor += `.filter(dep => [${exceptions.join(', ')}].indexOf(dep) === -1)`;
      }
      conf.entry = {
        app: index,
        vendor: lit`${vendor}`
      };
    } else {
      conf.entry = index;
    }

    if (options.dist === false && options.framework === 'react') {
      conf.plugins.push(
        lit`new webpack.HotModuleReplacementPlugin()`
      );
    }

    if (options.dist === true && options.framework !== 'angular1') {
      conf.plugins.push(
        lit`new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })`
      );
    }

    if (options.dist === true) {
      conf.plugins.push(
        lit`new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true} // eslint-disable-line camelcase
    })`,
        lit`new ExtractTextPlugin('index-[contenthash].css')`,
        lit`new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })`
      );
    }
  }

  if (options.test === false) {
    let cssLoaders;
    let test = lit`/\\.css$/`;
    const mapToLoaders = {
      scss: 'sass',
      less: 'less',
      styl: 'stylus'
    };

    if (options.dist === true) {
      if (options.css === 'scss') {
        test = lit`/\\.(css|scss)$/`;
      }
      if (options.css === 'less') {
        test = lit`/\\.(css|less)$/`;
      }
      if (options.css === 'styl') {
        test = lit`/\\.(css|styl|stylus)$/`;
      }
      cssLoaders = lit`ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: 'css?minimize!${mapToLoaders[options.css]}!postcss'
        })`;
    } else {
      cssLoaders = ['style', 'css'];
      if (options.css === 'scss') {
        cssLoaders.push('sass');
        test = lit`/\\.(css|scss)$/`;
      }
      if (options.css === 'less') {
        cssLoaders.push('less');
        test = lit`/\\.(css|less)$/`;
      }
      if (options.css === 'styl') {
        cssLoaders.push('stylus');
        test = lit`/\\.(css|styl|stylus)$/`;
      }
      cssLoaders.push('postcss');
    }

    conf.module.loaders.push({test, loaders: cssLoaders});
  }

  const jsLoaders = [];
  if (options.test === false && options.dist === false && options.framework === 'react') {
    jsLoaders.push('react-hot');
  }
  if (options.framework === 'angular1') {
    jsLoaders.push('ng-annotate');
  }
  if (options.js === 'babel' || options.js === 'js' && options.framework === 'react') {
    jsLoaders.push('babel');
  }
  if (options.js === 'typescript') {
    jsLoaders.push('ts');
  }
  if (jsLoaders.length > 0) {
    const jsLoader = {test: lit`/\\.js$/`, exclude: lit`/node_modules/`, loaders: jsLoaders};

    if (options.js === 'typescript') {
      jsLoader.test = lit`/\\.ts$/`;
      if (options.framework === 'react') {
        jsLoader.test = lit`/\\.tsx$/`;
      }
    }

    conf.module.loaders.push(jsLoader);
  }
  if (options.framework !== 'react') {
    const htmlLoader = {
      test: lit`/\.html$/`,
      loaders: ['html']
    };
    conf.module.loaders.push(htmlLoader);
  }

  if (options.js === 'typescript') {
    conf.ts = {
      configFileName: 'tsconfig.json'
    };
    conf.tslint = {
      configuration: lit`require('../tslint.json')`
    };
  }

  if (options.test === true && options.js !== 'typescript') {
    conf.module.loaders.push({
      test: lit`/\\.js$/`,
      exclude: lit`/(node_modules|.*\\.spec\\.js)/`,
      loader: 'isparta'
    });

    if (options.framework === 'react') {
      conf.externals = {
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      };
    }
  }

  return conf;
};
