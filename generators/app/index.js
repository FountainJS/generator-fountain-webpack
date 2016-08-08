const fountain = require('fountain-generator');
const webpackConf = require('./conf');

module.exports = fountain.Base.extend({
  configuring: {
    package() {
      const pkg = {
        devDependencies: {
          'webpack': '2.1.0-beta.20',
          'html-webpack-plugin': '^2.9.0',
          'style-loader': '^0.13.0',
          'css-loader': '^0.23.1',
          'postcss-loader': '^0.8.0',
          'autoprefixer': '^6.2.2',
          'json-loader': '^0.5.4',
          'webpack-split-by-path': '^0.0.10',
          'extract-text-webpack-plugin': '^1.0.1'
        }
      };

      if (this.options.framework === 'react') {
        Object.assign(pkg.devDependencies, {
          'webpack-dev-middleware': '^1.4.0',
          'webpack-hot-middleware': '^2.6.0',
          'react-hot-loader': '^1.3.0'
        });
      }

      if (this.options.framework === 'angular1') {
        Object.assign(pkg.devDependencies, {
          'ng-annotate-loader': '^0.0.10'
        });
      }

      if (this.options.framework !== 'react') {
        Object.assign(pkg.devDependencies, {
          'html-loader': '^0.4.3'
        });
      }

      if (this.options.js === 'typescript') {
        Object.assign(pkg.devDependencies, {
          'ts-loader': '^0.8.2'
        });
      }

      if (this.options.css === 'scss') {
        Object.assign(pkg.devDependencies, {
          'sass-loader': '^3.1.2',
          'node-sass': '^3.4.2'
        });
      }

      if (this.options.css === 'less') {
        Object.assign(pkg.devDependencies, {
          'less-loader': '^2.2.2',
          'less': '^2.3.1'
        });
      }

      if (this.options.css === 'styl') {
        Object.assign(pkg.devDependencies, {
          'stylus-loader': '^2.1.0',
          'stylus': '^0.54.5'
        });
      }

      this.mergeJson('package.json', pkg);
    },

    conf() {
      const options = Object.assign({}, this.options, {
        dist: false,
        test: false
      });

      options.webpackConf = webpackConf(options);

      this.copyTemplate('conf/webpack.conf.js', 'conf/webpack.conf.js', options);

      options.test = true;
      options.webpackConf = webpackConf(options);

      this.copyTemplate('conf/webpack.conf.js', 'conf/webpack-test.conf.js', options);

      options.test = false;
      options.dist = true;
      options.webpackConf = webpackConf(options);

      this.copyTemplate('conf/webpack.conf.js', 'conf/webpack-dist.conf.js', options);
    }
  },

  writing: {
    gulp() {
      this.fs.copyTpl(
        this.templatePath('gulp_tasks'),
        this.destinationPath('gulp_tasks'),
        this.options
      );
    }
  }
});
