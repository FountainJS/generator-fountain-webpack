const _ = require('lodash');
const fountain = require('fountain-generator');
const webpackConf = require('./conf');

module.exports = fountain.Base.extend({
  prompting() {
    this.options.modules = 'webpack';
    this.fountainPrompting();
  },

  configuring: {
    package() {
      const pkg = {
        devDependencies: {
          'webpack': '^1.12.9',
          'babel-loader': '^6.2.0',
          'html-webpack-plugin': '^1.7.0',
          'style-loader': '^0.13.0',
          'css-loader': '^0.23.1',
          'sass-loader': '^3.1.2',
          'node-sass': '^3.4.2',
          'postcss-loader': '^0.8.0',
          'autoprefixer': '^6.2.2'
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

      if (this.props.js === 'typescript') {
        _.merge(pkg, {
          devDependencies: {
            'ts-loader': '^0.7.2'
          }
        });
      }

      this.mergeJson('package.json', pkg);
    },

    conf() {
      const props = Object.assign({}, this.props, {
        dist: false,
        test: false
      });

      props.webpackConf = webpackConf(props);

      this.copyTemplate('conf/webpack.conf.js', 'conf/webpack.conf.js', props);

      props.test = true;
      props.webpackConf = webpackConf(props);

      this.copyTemplate('conf/webpack.conf.js', 'conf/webpack-test.conf.js', props);

      props.test = false;
      props.dist = true;
      props.webpackConf = webpackConf(props);

      this.copyTemplate('conf/webpack.conf.js', 'conf/webpack-dist.conf.js', props);
    },

    ts() {
      if (this.props.js === 'typescript') {
        this.copyTemplate(
          'conf/ts.conf.json',
          'conf/ts.conf.json'
        );
      }
    }
  },

  writing: {
    gulp() {
      this.fs.copyTpl(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        this.props
      );
    }
  }
});
