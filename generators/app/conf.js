'use strict';

const lit = require('fountain-generator').lit;

module.exports = function webpackConf(props) {
  const conf = {
    module: {
      loaders: [
        { test: lit`/\.json$/`, loaders: ['json'] }
      ]
    }
  };

  if (props.test === false) {
    conf.plugins = [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`
    ];
    conf.postcss = lit`() => [autoprefixer]`;
  }

  if (props.dist === false) {
    conf.debug = true;
    conf.devtool = 'cheap-module-eval-source-map';
    if (props.test === false) {
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

  if (props.js === 'typescript') {
    conf.resolve = {
      extensions: ['', '.webpack.js', '.web.js', '.js', '.ts']
    };

    if (props.framework === 'react') {
      conf.resolve.extensions.push('.tsx');
    }
  }

  if (props.test === false) {
    const index = lit`\`./\${conf.path.src('index')}\``;
    if (props.dist === false && props.framework === 'react') {
      conf.entry = [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        index
      ];
    } else if (props.dist === true && props.framework === 'angular1') {
      conf.entry = [index];

      if (props.js === 'typescript') {
        conf.entry.push(lit`\`./\${conf.path.tmp('templateCacheHtml.ts')}\``);
      } else {
        conf.entry.push(lit`\`./\${conf.path.tmp('templateCacheHtml.js')}\``);
      }
    } else {
      conf.entry = index;
    }

    if (props.dist === false && props.framework === 'react') {
      conf.plugins.push(
        lit`new webpack.HotModuleReplacementPlugin()`
      );
    }

    if (props.dist === true) {
      conf.plugins.push(
        lit`new webpack.optimize.UglifyJsPlugin({
      compress: {unused: true, dead_code: true} // eslint-disable-line camelcase
    })`
      );
    }
  }

  if (props.test === false) {
    const cssLoaders = ['style', 'css'];
    let test;
    if (props.css === 'scss') {
      cssLoaders.push('sass');
      test = lit`/\\.(css|scss)$/`;
    }
    if (props.css === 'less') {
      cssLoaders.push('less');
      test = lit`/\\.(css|less)$/`;
    }
    cssLoaders.push('postcss');
    conf.module.loaders.push({ test, loaders: cssLoaders });
  }

  const jsLoaders = [];
  if (props.test === false && props.dist === false && props.framework === 'react') {
    jsLoaders.push('react-hot');
  }
  if (props.framework === 'angular1') {
    jsLoaders.push('ng-annotate');
  }
  if (props.js === 'babel' || props.js === 'js' && props.framework === 'react') {
    jsLoaders.push('babel');
  }
  if (props.js === 'typescript') {
    jsLoaders.push('ts');
  }
  if (jsLoaders.length > 0) {
    const jsLoader = { test: lit`/\\.js$/`, exclude: lit`/node_modules/`, loaders: jsLoaders };

    if (props.js === 'typescript') {
      jsLoader.test = lit`/\\.ts$/`;
      if (props.framework === 'react') {
        jsLoader.test = lit`/\\.tsx$/`;
      }
    }

    conf.module.loaders.push(jsLoader);
  }

  if (props.js === 'typescript') {
    conf.ts = {
      configFileName: 'conf/ts.conf.json'
    };
    conf.tslint = {
      configuration: lit`require('./tslint.conf.json')`
    };
  }

  if (props.test === true && props.js !== 'typescript') {
    conf.module.loaders.push({
      test: lit`/\\.js$/`,
      exclude: lit`/(node_modules|.*\\.spec\\.js)/`,
      loader: 'isparta'
    });

    if (props.framework === 'react') {
      conf.externals = {
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
      };
    }
  }

  return conf;
};
