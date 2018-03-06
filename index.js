'use strict';
const loaderUtils = require('loader-utils')
const path = require('path')
const fs = require('fs')
const Velocity = require('velocityjs')
const {
  Compile,
  parse
} = Velocity
const _ = require('lodash')

let watcher;

// resourcePath vm文件路径
const macros = (resourcePath, options, mock) => {
  return {
    parse(filePath) {
      return this.eval(this.include(filePath), mock);
    },
    include(filePath) {
      // console.log(filePath, 'filePath')

      //获取真实路径
      let absPath;
      if (options.basePath) {
        absPath = path.join(options.basePath, filePath);
        // console.log(absPath, 'absPath')

      } else {
        absPath = path.resolve(path.dirname(resourcePath), filePath);
      }
      // console.log(absPath, 'absPath')
      if (!fs.existsSync(absPath)) return "";
      watcher(absPath);
      return fs.readFileSync(absPath, "utf8");
    }
  }
}

module.exports = function (content) {
  if (this.cacheable) {
    this.cacheable(true)
  }
  const callback = this.async();
  const options = _.defaults(loaderUtils.getOptions(this), {
    compileVm: true,
    compileEjs: false,
    removeComments: false
  })
  // console.log(options);
  const filePath = this.resourcePath;
  const fileName = path.basename(filePath).split('.')[0];
  const fileDirPath = path.dirname(filePath);

  watcher = this.addDependency

  const mockPath = path.join(fileDirPath, `${fileName}.mock.js`);
  let mock = {}

  if (fs.existsSync(mockPath)) {
    watcher(mockPath);
    delete require.cache[mockPath]
    mock = require(mockPath);
  }

  //解析vm
  if (options.compileVm) {
    content = new Compile(parse(content), {
        escape: false
      })
      .render(mock, macros(filePath, options, mock));
  }

  //解析ejs
  if (options.compileEjs) {
    var _compile = _.template(content);
    content = _compile(mock.CONFIG || {})
  }

  if (options.removeComments) {
    content = content
      .replace(/#\*[\s\S]*?\*#/g, '')
      .replace(/##[\s\S]*?\n/g, '')
  }

  callback(null, content);
}