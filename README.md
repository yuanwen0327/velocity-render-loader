<div align="center">
  <h1>Velocity Render Loader</h1>
</div>

在[webpack](https://github.com/webpack/webpack)中使用[Velocity.js](https://github.com/shepherdwind/velocity.js)解析vm模板，支持`#parse`指令。


<h2 align="center">Install</h2>

```bash
npm install --save-dev velocity-render-loader html-loader
```

<h2 align="center">Usage</h2>


首先在webpack配置中匹配规则
```javascript
module: {
  rules: [
    {
      test: /\.vm$/,
      use:[
        {
          loader: 'html-loader'
        },
        {
          loader: 'velocity-render-loader'
        }
      ]
    }
  ]
}
```

自动生成html文件
```javascript
new HtmlWebpackPlugin({
  filename: 'a.html',
  template: '/path/to/a.vm', 
  inject: true
}
```

velocity-render-loader会自动读取vm文件旁的同名mock文件，假设结构如下

```
=====================
- src
  - modules
    - a
      - a.vm
      - a.mock.js
  - shared
    - components
      - header
        - header.vtl
======================
```


在mock中定义变量并通过模块暴露出来
```javascript
//a.mock.js
module.exports = {
  title : "Hello World!"
}
```

在vm中使用变量
```html
<!--a.vm-->

<!--编译前-->
<head>
  <title>$title</title>
</head>

<!--编译后-->
<head>
  <title>Hello World!</title>
</head>
```

更多可以支持的指令见 https://github.com/shepherdwind/velocity.js

### Options


```javascript
options: {
  basePath: path.join(__dirname, 'src')
}
```

配置项:

* `basePath`: 定义`#parse`指令中绝对路径的起始位置
  ```html
    #parse("/shared/components/header/header.vtl")
  ```
  > 在某些情况下，后端渲染vm时的相对路径与前端环境不同。最好使用绝对路径来查找文件位置。 




