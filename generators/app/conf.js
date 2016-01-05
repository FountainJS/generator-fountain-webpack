'use strict';

const lit = require('fountain-generator').lit;

module.exports = function webpackConf(props) {
  const conf = {
    module: {
      loaders: []
    }
  };

  if (props.test === false) {
    conf.plugins = [
      lit`new webpack.optimize.OccurenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html'),
      inject: true
    })`
    ];
    conf.module.loaders.push([
      { test: lit`/\\.scss$/`, loaders: ['style', 'css', 'sass', 'postcss'] }
    ]);
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
        compress: { unused: true, dead_code: true }
      })`
      );
    }
  }

  const loaders = [];
  if (props.test === false && props.dist === false && props.framework === 'react') {
    loaders.push('react-hot');
  }
  if (props.framework === 'angular1') {
    loaders.push('ng-annotate');
  }
  if (props.js === 'babel' || props.js === 'js' && props.framework === 'react') {
    loaders.push('babel');
  }
  if (props.js === 'typescript') {
    loaders.push('ts');
  }
  if (loaders.length > 0) {
    const loader = { test: lit`/\\.js$/`, exclude: lit`/node_modules/`, loaders };

    if (props.js === 'typescript') {
      loader.test = lit`/\\.ts$/`;
      if (props.framework === 'react') {
        loader.test = lit`/\\.tsx$/`;
      }
    }

    if (props.test === false) {
      conf.module.loaders.push(loader);
    } else {
      conf.module.postLoaders = [loader];
    }
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
      loader: 'isparta-instrumenter'
    });
  }

  return conf;
};
