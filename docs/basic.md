# 基础概念

## 为什么使用？

- 转换ES6、JSX
- CSS预处理
- 代码压缩
- 图片压缩

## webpack.config里的包含项

- entry: 依赖入口，根据入口再形成依赖图，支持多入口文件
- output：打包输出，支持多出口文件
- loaders：webpack本身只支持JS、JSON文件，其他文件类型需要loaders转化。它是一个函数输入为源文件，输出为转换结果。
- plugins：bundle文件优化，资源管理，环境变量注入
- mode：内置函数，会自动开启一些插件，通过内置函数`process.env.NODE_ENV`获取

多入口文件配置示例：

```javascript
const path = require('path');

module.exports = {
  entry: {
    index: "./src/index.js",
    search: './src/search.js'
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: '[name].js'
  },
  mode: "production"
};
```
