# 基础概念

## 为什么使用？

- 转换 ES6、JSX
- CSS 预处理
- 代码压缩
- 图片压缩

## webpack.config 里的包含项

- entry: 依赖入口，根据入口再形成依赖图，支持多入口文件
- output：打包输出，支持多出口文件
- loaders：webpack 本身只支持 JS、JSON 文件，其他文件类型需要 loaders 转化。它是一个函数输入为源文件，输出为转换结果。
- plugins：bundle 文件优化，资源管理，环境变量注入
- mode：内置函数，会自动开启一些插件，通过内置函数`process.env.NODE_ENV`获取

多入口文件配置示例：

```javascript
const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js",
    search: "./src/search.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  mode: "production"
};
```

## 配置 loader 解析文件

### 解析 ES6 和 JSX

babel-loader，在.babelrc 文件中配置 preset 和 plugin。

### 解析 CSS/Less/Sass

- css-loader，将.css 转换成 commonjs 对象，把每个.css 文件转成模块，放在最终生成文件中引用。
- style-loader，在最终生成文件中把 css 样式通过动态生成`<style>`插入到`<head>`里。
- less-loader, sass-loader 是预处理工具，将 less/sass 转换成 css。

在 webpack.config 里 module.rules 里的 use 是链式调用，即从右到左解析，所以需要先使用 css-loader 再调用 style-loader 将解析后结果放入标签中。

```javascript
module: {
  rules: [
    {
      test: /.less$/,
      use: ["style-loader", "css-loader", "less-loader"]
    }
  ];
}
```

### 解析图片/字体

- file-loader，支持图片、字体。
- url-loader，支持图片、字体，并将较小资源自动 base64

## webpack 监听文件

源码有变化，webpack 自动重新构建。

### 开启方式

1. 带`--watch`参数
2. 在 config 中配置`watch:true`

### 原理

通过轮询判断文件的最后编辑时间是否发生变化。当文件发生变化时，会先缓存起来，再告诉监听者。缓存放在磁盘中。

```javascript
module.export = {
  watch: true,
  watchOptions: {
    ignored: /node_modules/, // 提高性能
    aggregateTimeout: 300, // 监听到变化后300ms再去执行动作，用于缓存，防止更新太快
    poll: 1000 // 每秒询问1000次
  }
};
```

性能方面：增加忽略文件，降低重新构建频率，降低检查频率

注意：这种监听方式需要**手动**刷新浏览器

## 热更新

在 dev 模式下，使用 webpack-dev-server，不输出文件，缓存放在内存中。

### 开启方式

`webpack-dev-server --open`负责热更新，不支持初次构建输出 dist。

```javascript
module.export = {
  mode: "development",
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: "./dist", // 指定webpack打包输出目录
    hot: true
  }
};
```

### 原理

![原理图](http://ww4.sinaimg.cn/large/006tNc79ly1g3yf72gnnqj312w0g40tw.jpg)

- bundle server，提供文件在浏览器可以访问
- bundle.js，构建输出的文件
- HMR Server，将热更新文件输出到 HMR Runtime
- HMR Runtime，被注入到浏览器，更新文件变化

构建阶段：1 - 2 - A - B

热更新阶段：1 - 2 - 3 - 4

进阶文章：

- [webpack 热更新流程](https://github.com/kaola-fed/blog/issues/238)
- [Webpack 热更新实现原理分析](https://zhuanlan.zhihu.com/p/30623057)

## 文件指纹

文件指纹就是打包输出文件名的后缀，一般是一段哈希值。

作用：方便做版本管理，未修改的文件其文件指纹不变，浏览器可以从缓存中读取。

### 类型

- hash: hash of the module identifier, 可用于图片、字体、PDF 等
- chunkhash 与 chunk 有关，不同的 entry 会生成不同的 chunkhash
- contenthash 一般用于处理 css，内容不变则不会变。css 用 chunkhash 时，引用的 js 变化时，css 的 chunkhash 也会变，这是不必要的

### 使用

需要使用占位符：

- [ext] 文件的类型名
- [name]
- [path] 相对路径
- [folder]
- 三种 hash，md5 生成，默认长度 20 个字符，可使用 [hash:X] 配置
  - [contenthash]
  - [hash]
  - [chunkhash]
- [emoji]

```javascript
// js
output: {
  filename: '[name]_[chunkhash:8].js'
}
// img / font
use: [
  {
    loader: 'file-loader',
    options: {
      name: '[name]_[hash:8].[ext]'
    }
  }
]
// css
module.rules: [{
  test: /.less$/,
  // 不能与'style-loader'一起使用，因为作用相反，一个提取，一个压缩
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'] 
}],
plugins: [
  new MiniCssExtractPlugin({
    filename: '[name]_[contenthash:8].css'
  })
]
```
