'use strict';
const loaderUtils = require('loader-utils')
const path = require('path')
const fs = require('fs')
const Velocity = require('velocityjs')
const {
  Compile,
  parse
} = Velocity

let watcher;

const macros = (resourcePath, mock) => {
  return {
    parse(filePath) {
      return this.eval(this.include(filePath), mock);
    },
    include(filePath) {
      const absPath = path.resolve(path.dirname(resourcePath), filePath);
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
  const filePath = this.resourcePath;
  const fileName = path.basename(filePath).split('.')[0];
  const fileDirPath = path.dirname(filePath);
  const mockPath = path.join(fileDirPath, `${fileName}.mock.js`);

  watcher = this.addDependency
  watcher(mockPath);

  const mock = require(mockPath);
  let result = new Compile(parse(content))
    .render(mock, macros(filePath, mock));
  callback(null, result);
}
