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
          webpack: '^1.12.9',
          'babel-loader': '^6.2.0',
          'html-webpack-plugin': '^1.7.0'
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

    conf() {
      const props = Object.assign({ dist: false }, this.props);

      this.copyTemplate(
        'conf/webpack.conf.js',
        'conf/webpack.conf.js',
        { webpackConf: webpackConf(props) }
      );

      props.dist = true;

      this.copyTemplate(
        'conf/webpack.conf.js',
        'conf/webpack-dist.conf.js',
        { webpackConf: webpackConf(props) }
      );
    }
  },

  writing: {
    gulp() {
      this.fs.copyTpl(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        { framework: this.props.framework }
      );

      this.fs.delete(this.destinationPath('gulp_tasks/build.js'));
    }
  }
});
