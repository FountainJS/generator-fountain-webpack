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
      filename: 'index-[hash].js'
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
    } else if (options.dist === true && options.framework === 'angular1') {
      conf.entry = [index];

      if (options.js === 'typescript') {
        conf.entry.push(lit`\`./\${conf.path.tmp('templateCacheHtml.ts')}\``);
      } else {
        conf.entry.push(lit`\`./\${conf.path.tmp('templateCacheHtml.js')}\``);
      }
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
    })`
      );
    }
  }

  if (options.test === false) {
    const cssLoaders = ['style', 'css'];
    let test = lit`/\\.css$/`;
    if (options.css === 'scss') {
      cssLoaders.push('sass');
      test = lit`/\\.(css|scss)$/`;
    }
    if (options.css === 'less') {
      cssLoaders.push('less');
      test = lit`/\\.(css|less)$/`;
    }
    if (options.sample === 'jhipster') {
      if (options.css === 'styl') {
        conf.module.loaders.push({test: lit`/\\.css$/`, loaders: cssLoaders});
        conf.module.loaders.push({test: lit`/\\.(styl|stylus)$/`, loaders: cssLoaders.concat(['stylus', 'postcss'])});
      } else {
        conf.module.loaders.push({test, loaders: cssLoaders});
      }
    } else {
      if (options.css === 'styl') {
        cssLoaders.push('stylus');
        test = lit`/\\.(css|styl|stylus)$/`;
      }
      cssLoaders.push('postcss');
      conf.module.loaders.push({test, loaders: cssLoaders});
    }
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

  if (options.js === 'typescript') {
    conf.ts = {
      configFileName: 'conf/ts.conf.json'
    };
    conf.tslint = {
      configuration: lit`require('../tslint.json')`
    };
  }

  if (options.sample === 'jhipster') {
    conf.module.loaders.push({test: lit`/\.(woff|woff2)$/`, loader: 'url-loader?limit=10000&mimetype=application/font-woff'});
    conf.module.loaders.push({test: lit`/\.ttf$/`, loader: 'file-loader'});
    conf.module.loaders.push({test: lit`/\.eot$/`, loader: 'file-loader'});
    conf.module.loaders.push({test: lit`/\.svg$/`, loader: 'file-loader'});
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
