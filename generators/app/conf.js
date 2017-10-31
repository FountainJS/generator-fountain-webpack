/* eslint complexity: "off" */

const lit = require('fountain-generator').lit;
const json = require('fountain-generator').json;

module.exports = function webpackConf(options) {
  const loaderOptionsPlugin = {
    options: {}
  };
  const conf = {
    module: {
      loaders: [
        {test: lit`/\\.json$/`, loaders: ['json-loader']}
      ]
    }
  };

  if (options.js === 'typescript') {
    const test = options.framework === 'react' ? lit`/\\.tsx$/` : lit`/\\.ts$/`;
    conf.module.loaders.push({test, exclude: lit`/node_modules/`, loader: 'tslint-loader', enforce: 'pre'});
  } else {
    conf.module.loaders.push({test: lit`/\\.js$/`, exclude: lit`/node_modules/`, loader: 'eslint-loader', enforce: 'pre'});
  }

  if (options.test === false) {
    conf.plugins = [
      lit`new webpack.optimize.OccurrenceOrderPlugin()`,
      lit`new webpack.NoEmitOnErrorsPlugin()`,
      lit`new HtmlWebpackPlugin({
      template: conf.path.src('index.html')
    })`
    ];
    loaderOptionsPlugin.options.postcss = lit`() => [autoprefixer]`;
  } else {
    conf.plugins = [];
  }

  if (options.framework === 'angular2') {
    // https://github.com/angular/angular/issues/11580
    conf.plugins.push(lit`new webpack.ContextReplacementPlugin(
      /angular(\\\\|\\/)core(\\\\|\\/)(esm(\\\\|\\/)src|src)(\\\\|\\/)linker/,
      conf.paths.src
    )`);
  }

  if (options.dist === false) {
    loaderOptionsPlugin.debug = true;
    conf.devtool = 'source-map';
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
      extensions: ['.webpack.js', '.web.js', '.js', '.ts']
    };

    if (options.framework === 'react') {
      conf.resolve.extensions.push('.tsx');
      if (options.test === true) {
        conf.externals = lit`{
    jsdom: 'window',
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': 'true',
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
    } else if (options.dist === true && options.framework !== 'angular2') {
      const exceptions = [];
      let vendor = 'Object.keys(pkg.dependencies)';
      // if (options.framework === 'angular2') {
      //   exceptions.push(`'zone.js'`);
      // }
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
      output: {comments: false},
      compress: {unused: true, dead_code: true, warnings: false} // eslint-disable-line camelcase
    })`,
        lit`new ExtractTextPlugin('index-[contenthash].css')`,
        lit`new webpack.optimize.CommonsChunkPlugin({name: 'vendor'})`
      );
    }
  }

  if (options.test === false) {
    let cssLoaders;
    let test = lit`/\\.css$/`;
    const mapToLoaders = {
      scss: '!sass-loader',
      less: '!less-loader',
      styl: '!stylus-loader'
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
          fallback: 'style-loader',
          use: 'css-loader?minimize${mapToLoaders[options.css]}!postcss-loader'
        })`;
    } else {
      cssLoaders = ['style-loader', 'css-loader'];
      if (options.css === 'scss') {
        cssLoaders.push('sass-loader');
        test = lit`/\\.(css|scss)$/`;
      }
      if (options.css === 'less') {
        cssLoaders.push('less-loader');
        test = lit`/\\.(css|less)$/`;
      }
      if (options.css === 'styl') {
        cssLoaders.push('stylus-loader');
        test = lit`/\\.(css|styl|stylus)$/`;
      }
      cssLoaders.push('postcss-loader');
    }

    conf.module.loaders.push({test, loaders: cssLoaders});
  }

  const jsLoaders = [];
  if (options.test === false && options.dist === false && options.framework === 'react') {
    jsLoaders.push('react-hot-loader');
  }
  if (options.framework === 'angular1') {
    jsLoaders.push('ng-annotate-loader');
  }
  if (options.js === 'babel' || (options.js === 'js' && options.framework === 'react')) {
    jsLoaders.push('babel-loader');
  }
  if (options.js === 'typescript') {
    jsLoaders.push('ts-loader');
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
  if (options.framework === 'vue') {
    const vueLoader = {
      test: lit`/\\.vue$/`,
      loaders: ['vue-loader']
    };
    conf.module.loaders.push(vueLoader);
  }
  if (options.framework !== 'react' && options.framework !== 'vue') {
    const htmlLoader = {
      test: lit`/\\.html$/`,
      loaders: ['html-loader']
    };
    conf.module.loaders.push(htmlLoader);
  }

  if (options.js === 'typescript') {
    loaderOptionsPlugin.options.resolve = {};
    loaderOptionsPlugin.options = Object.assign(loaderOptionsPlugin.options, {
      resolve: {},
      ts: {
        configFile: 'tsconfig.json'
      },
      tslint: {
        configuration: lit`require('../tslint.json')`
      }
    });
  }

  conf.plugins.push(lit`new webpack.LoaderOptionsPlugin(${json(loaderOptionsPlugin, 4)})`);

  if (options.test === true && options.js !== 'typescript') {
    if (options.framework === 'react') {
      conf.externals = {
        'react/lib/ExecutionEnvironment': 'true',
        'react/lib/ReactContext': 'true'
      };
    }
  }

  return conf;
};
