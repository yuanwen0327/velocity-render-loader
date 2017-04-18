'use strict';
const loaderUtils = require('loader-utils')
const path = require('path')
const fs = require('fs')
const Velocity = require('velocityjs')
const {
  Compile,
  parse
} = Velocity

module.exports = function (content) {
  this.cacheable()
  const callback = this.async();
  const fileName=path.basename(this.resourcePath, '.vm')
  const filePath=path.dirname(this.resourcePath);
  const mockPath = path.join(filePath,`${fileName}.mock.json`);

  this.addDependency(mockPath);
  fs.readFile(mockPath, 'utf-8', function (err, text) {
    const mock = Object.assign(JSON.parse(text))
    let result = new Compile(parse(content))
      .render(err ? {} : mock);
    callback(null, result);
  })
}
