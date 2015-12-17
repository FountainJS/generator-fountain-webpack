const lit = require('fountain-generator').lit;

module.exports = function webpackConf(props) {
  const conf = {
    output: { filename: 'index.js' },
    plugins: [
      lit`new webpack.optimize.OccurenceOrderPlugin()`,
      lit`new webpack.NoErrorsPlugin()`
    ],
    module: {
      loaders: [{ test: lit`/\.js$/`, exclude: lit`/node_modules/` }]
    }
  };


  if (props.dist === false) {
    conf.debug = true;
    conf.devtool = 'cheap-module-eval-source-map';
    conf.output.path = lit`path.join(process.cwd(), conf.paths.tmp)`;
  } else {
    conf.output.path = lit`path.join(process.cwd(), conf.paths.dist)`;
  }

  if (props.dist === false && props.framework === 'react') {
    conf.entry = [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      lit`\`./\${path.join(conf.paths.src, 'index')}\``
    ];
  } else {
    conf.entry = lit`\`./\${path.join(conf.paths.src, 'index')}\``;
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

  const loader = conf.module.loaders[0];
  if (props.dist === false && props.framework === 'react') {
    loader.loaders = ['react-hot', 'babel'];
  } else if (props.framework === 'angular1') {
    loader.loaders = ['ng-annotate', 'babel'];
  } else {
    loader.loader = 'babel';
  }

  return conf;
};
