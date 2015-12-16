const _ = require('lodash');
var fountain = require('fountain-generator');

module.exports = fountain.Base.extend({
  prompting: function () {
    this.options.modules = 'webpack';
    this.fountainPrompting();
  },

  configuring: {
    package: function () {
      var pkg = {
        devDependencies: {
          webpack: '^1.12.9',
          'babel-loader': '^6.2.0'
        }
      };

      if (this.props.framework === 'react') {
        _.merge(pkg, {
          devDependencies: {
            'webpack-dev-middleware': '^1.4.0',
            'webpack-hot-middleware': '^2.6.0',
            'react-hot-loader': '^1.3.0',
            'babel-preset-react': '^6.1.18'
          }
        });
      }

      if (this.props.framework === 'angular1') {
        _.merge(pkg, {
          devDependencies: {
            'ng-annotate-loader': '^0.0.10'
          }
        });
      }

      this.mergeJson('package.json', pkg);
    },

    conf: function () {
      const lit = this.lit;
      const conf = {
        debug: true,
        devtool: '#eval-source-map',
        output: {
          path: lit`path.join(process.cwd(), conf.paths.tmp)`,
          filename: 'index.js'
        },
        plugins: [
          lit`new webpack.optimize.OccurenceOrderPlugin()`,
          lit`new webpack.NoErrorsPlugin()`
        ],
        module: {
          loaders: [{ test: lit`/\.js$/`, exclude: lit`/node_modules/` }]
        }
      };

      if (this.props.framework === 'react') {
        conf.entry = [
          'webpack/hot/dev-server',
          'webpack-hot-middleware/client',
          lit`\`./\${path.join(conf.paths.src, 'index')}\``
        ];
      } else {
        conf.entry = lit`\`./\${path.join(conf.paths.src, 'index')}\``;
      }

      if (this.props.framework === 'react') {
        conf.plugins.push(
          lit`new webpack.HotModuleReplacementPlugin()`
        );
      }

      const loader = conf.module.loaders[0];
      if (this.props.framework === 'react') {
        loader.loaders = ['react-hot', 'babel'];
      } else if (this.props.framework === 'angular1') {
        loader.loaders = ['ng-annotate', 'babel'];
      } else {
        loader.loader = 'babel';
      }

      this.copyTemplate('conf/webpack.conf.js', { webpackConf: conf });
    }
  },

  writing: {
    gulp: function () {
      this.fs.copyTpl(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        { framework: this.props.framework }
      );
    },

    indexHtml: function () {
      this.replaceInFile('src/index.html', /<\/html>/, {
        framework: this.props.framework
      });
    }
  }
});
