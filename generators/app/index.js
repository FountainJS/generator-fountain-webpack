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
          'webpack': '^v2.1.0-beta.3',
          'html-webpack-plugin': '^2.9.0',
          'style-loader': '^0.13.0',
          'css-loader': '^0.23.1',
          'postcss-loader': '^0.8.0',
          'autoprefixer': '^6.2.2',
          'json-loader': '^0.5.4'
        }
      };

      if (this.props.framework === 'react') {
        Object.assign(pkg.devDependencies, {
          'webpack-dev-middleware': '^1.4.0',
          'webpack-hot-middleware': '^2.6.0',
          'react-hot-loader': '^1.3.0'
        });
      }

      if (this.props.framework === 'angular1') {
        Object.assign(pkg.devDependencies, {
          'ng-annotate-loader': '^0.0.10'
        });
      }

      if (this.props.js === 'typescript') {
        Object.assign(pkg.devDependencies, {
          'ts-loader': '^0.7.2'
        });
      }

      if (this.props.css === 'scss') {
        Object.assign(pkg.devDependencies, {
          'sass-loader': '^3.1.2',
          'node-sass': '^3.4.2'
        });
      }

      if (this.props.css === 'less') {
        Object.assign(pkg.devDependencies, {
          'less-loader': '^2.2.2',
          'less': '^2.3.1'
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
