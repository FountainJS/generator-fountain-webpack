const path = require('path');
const spies = require('chai-spies');
const chai = require('chai');
const should = chai.should(); // eslint-disable-line no-unused-vars
chai.use(spies);
const expect = chai.expect;
const _ = require('lodash');
const test = require('ava');
const TestUtils = require('fountain-generator').TestUtils;

let context;

test.before(() => {
  context = TestUtils.mock('app');
  require('../../generators/app/index');
  process.chdir(path.resolve(__dirname, '../../'));
});

test.beforeEach(() => {
  context.mergeJson['package.json'] = null;
});

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

test('Configuring package.json with react/babel/css', t => {
  const expected = _.merge({}, pkg, {
    devDependencies: {
      'webpack-dev-middleware': '^1.10.1',
      'webpack-hot-middleware': '^2.17.0',
      'react-hot-loader': '^1.3.1'
    }
  });
  TestUtils.call(context, 'configuring.package', {framework: 'react', js: 'babel', css: 'css'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular1/babel/css', t => {
  const expected = _.merge({}, pkg, {
    devDependencies: {
      'ng-annotate-loader': '^0.2.0',
      'html-loader': '^0.4.4'
    }
  });
  TestUtils.call(context, 'configuring.package', {framework: 'angular1', js: 'babel', css: 'css'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular2/typescript/css', t => {
  const expected = _.merge({}, pkg, {
    devDependencies: {
      'ts-loader': '^2.0.0',
      'html-loader': '^0.4.4'
    }
  });
  TestUtils.call(context, 'configuring.package', {framework: 'angular2', js: 'typescript', css: 'css'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular2/babel/scss', t => {
  const expected = _.merge({}, pkg, {
    devDependencies: {
      'sass-loader': '^6.0.1',
      'node-sass': '^4.5.0',
      'html-loader': '^0.4.4'
    }
  });
  TestUtils.call(context, 'configuring.package', {framework: 'angular2', js: 'babel', css: 'scss'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular2/babel/less', t => {
  const expected = _.merge({}, pkg, {
    devDependencies: {
      'less-loader': '^2.2.3',
      'less': '^2.7.2',
      'html-loader': '^0.4.4'
    }
  });
  TestUtils.call(context, 'configuring.package', {framework: 'angular2', js: 'babel', css: 'less'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with angular2/babel/styl', t => {
  const expected = _.merge({}, pkg, {
    devDependencies: {
      'stylus-loader': '^2.5.0',
      'stylus': '^0.54.5',
      'html-loader': '^0.4.4'
    }
  });
  TestUtils.call(context, 'configuring.package', {framework: 'angular2', js: 'babel', css: 'styl'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Configuring package.json with vue/babel/styl', t => {
  const expected = _.merge({}, pkg, {
    devDependencies: {
      'stylus-loader': '^2.5.0',
      'stylus': '^0.54.5',
      'vue-loader': '^11.1.0',
      'vue-template-compiler': '^2.1.10'
    }
  });
  TestUtils.call(context, 'configuring.package', {framework: 'vue', js: 'babel', css: 'styl'});
  t.deepEqual(context.mergeJson['package.json'], expected);
});

test('Copy webpack conf with correct options', t => {
  context.copyTemplate = (a, b, opts) => {
    context.copyTemplate[b] = _.clone(opts);
  };
  const spy = chai.spy.on(context, 'copyTemplate');
  const base = {framework: 'angular2', js: 'babel', css: 'styl', modules: 'webpack', sample: 'techs', router: 'router'};
  TestUtils.call(context, 'configuring.conf', base);
  expect(spy).to.have.been.called.exactly(3);
  t.is(context.copyTemplate['conf/webpack.conf.js'].test, false);
  t.is(context.copyTemplate['conf/webpack.conf.js'].dist, false);
  t.is(context.copyTemplate['conf/webpack-test.conf.js'].test, true);
  t.is(context.copyTemplate['conf/webpack-test.conf.js'].dist, false);
  t.is(context.copyTemplate['conf/webpack-dist.conf.js'].test, false);
  t.is(context.copyTemplate['conf/webpack-dist.conf.js'].dist, true);
});

test('gulp(): call this.fs.copyTpl', () => {
  context.templatePath = context.destinationPath = path => path;
  context.fs = {
    copyTpl: () => {}
  };
  const spy = chai.spy.on(context.fs, 'copyTpl');
  TestUtils.call(context, 'writing.gulp');
  expect(spy).to.have.been.called.once();
});
