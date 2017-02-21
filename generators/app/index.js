const fountain = require('fountain-generator');
const webpackConf = require('./conf');

module.exports = fountain.Base.extend({
  configuring: {
    package() {
      const pkg = {
        devDependencies: {
          'webpack': '^2.2.1',
          'html-webpack-plugin': '^2.28.0',
          'style-loader': '^0.13.1',
          'css-loader': '^0.26.1',
          'postcss-loader': '^1.3.1',
          'autoprefixer': '^6.7.3',
          'json-loader': '^0.5.4',
          'extract-text-webpack-plugin': '^2.0.0-rc.3',
          'webpack-fail-plugin': '^1.0.5'
        }
      };

      if (this.options.framework === 'react') {
        Object.assign(pkg.devDependencies, {
          'webpack-dev-middleware': '^1.10.1',
          'webpack-hot-middleware': '^2.17.0',
          'react-hot-loader': '^1.3.1'
        });
      }

      if (this.options.framework === 'angular1') {
        Object.assign(pkg.devDependencies, {
          'ng-annotate-loader': '^0.2.0'
        });
      }

      if (this.options.framework !== 'react' && this.options.framework !== 'vue') {
        Object.assign(pkg.devDependencies, {
          'html-loader': '^0.4.4'
        });
      }

      if (this.options.framework === 'vue') {
        Object.assign(pkg.devDependencies, {
          'vue-loader': '^11.1.0',
          'vue-template-compiler': '^2.1.10'
        });
      }

      if (this.options.js === 'typescript') {
        Object.assign(pkg.devDependencies, {
          'ts-loader': '^2.0.0'
        });
      }

      if (this.options.css === 'scss') {
        Object.assign(pkg.devDependencies, {
          'sass-loader': '^6.0.1',
          'node-sass': '^4.5.0'
        });
      }

      if (this.options.css === 'less') {
        Object.assign(pkg.devDependencies, {
          'less-loader': '^2.2.3',
          'less': '^2.7.2'
        });
      }

      if (this.options.css === 'styl') {
        Object.assign(pkg.devDependencies, {
          'stylus-loader': '^2.5.0',
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
