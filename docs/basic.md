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

`babel-loader`，在`.babelrc`文件中配置`preset`和`plugin`。

### 解析 CSS/Less/Sass

`css-loader`，将`.css`转换成 commonjs 对象，把每个`.css`文件转成模块，放在最终生成文件中引用。
`style-loader`，在最终生成文件中把 css 样式通过动态生成`<style>`插入到`<head>`里。
`less-loader`, `sass-loader`是预处理工具，将 less/sass 转换成 css。

在 webpack.config 里`module.rules`里的`use`是链式调用，即从右到左解析，所以需要先使用`css-loader`再调用`style-loader`将解析后结果放入标签中。

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

`file-loader`，支持图片、字体。
`url-loader`，支持图片、字体，并将较小资源自动 base64

## webpack 监听文件

源码有变化，webpack 自动重新构建。

### 开启方式

1. 带`--watch`参数
2. 在 config 中配置`watch:true`

### 原理

通过轮询判断文件的最后编辑时间是否发生变化。当文件发生变化时，会先缓存起来，再告诉监听者。

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
