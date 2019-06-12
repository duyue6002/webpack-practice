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
`url-loader`，支持图片、字体，并将较小资源自动base64
