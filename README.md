# webpack4.0 练习
> webpack只能操作js,其他不能操作的都必须转化，webpack是基于node来使用的。
### 安装webpack
- 首先包初始化 npm init,生成package.json
- 安装node,版本>8
> webpack 除了正常安装webpack外，还需要安装webpack-cli。
```
  npm i webpack webpack-cli -D
  //npm install  --save-dev的简写
```
### 初始说明
- webpack打包的时候，默认会将src下的入口文件(index.js)进行打包
- node 8.2以上版本以后都有1个npx
- npx webpack //不设置mode时，打包的代码会自动压缩
- npx webpack --mode development //开发模式不自动压缩
### 0配置基础架构
```
在项目下创建一个webpack.config.js(默认，可修改)文件来配置webpack
  module.exports = {
    entry: '',       // 入口文件
    output: {},     // 出口文件
    module: {},      // 处理对应模块
    plugins: [],    // 对应的插件
    devServer: {},   // 开发服务器配置
    mode: 'development'   // 模式配置
}
```
### 设置入口文件
```
// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/index.js',    // 入口文件
    output: {
        filename: 'bundle.js',      // 打包后的文件名称
        path: path.resolve('dist')  // 打包后的目录，必须是绝对路径
    }
}
```
### 配置执行文件
```
 //package.json
 "scripts": {
    "build": "webpack",//打包后的文件，上线需要的文件
    "dev": "webpack-dev-server"
    //开发环境打包的文件，dev-server将文件存入内存中，不会输出打包后的dist文件
  },
```
### 多入口文件
```
let path = require('path');

module.exports = {
    // 1.写成数组的方式就可以打出多入口文件，不过这里打包后的文件都合成了一个
    // entry: ['./src/index.js', './src/login.js'],
    // 2.真正实现多入口和多出口需要写成对象的方式
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        // 1. filename: 'bundle.js',
        // 2. [name]就可以将出口文件名和入口文件名一一对应
        filename: '[name].js',      // 打包后会生成index.js和login.js文件
        path: path.resolve('dist')
    }
}

```
### 配置html模板
####  html-webpack-plugin 插件
```
 npm i html-webpack-plugin -D
```
```
let path = require('path');
// 插件都是一个类，所以我们命名的时候尽量用大写开头
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        // 添加hash可以防止文件缓存，每次都会生成4位的hash串
        filename: 'bundle.[hash:4].js',   
        path: path.resolve('dist')
    },
    plugins: [
        // 通过new一下这个类来使用插件
        new HtmlWebpackPlugin({
            // 用哪个html作为模板
            // 在src目录下创建一个index.html页面当做模板来用
            template: './src/index.html',
            hash: true, // 会在打包好的bundle.js后面加上hash串
        })
    ]
}

```
### 多页面开发
```
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 多页面开发，怎么配置多页面
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    // 出口文件  
    output: {                       
        filename: '[name].js',
        path: path.resolve('dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',   
            filename: 'index.html',
            chunks: ['index']   // 对应关系,index.js对应的是index.html
        }),
        new HtmlWebpackPlugin({
            template: './src/login.html',
            filename: 'login.html',
            chunks: ['login']   // 对应关系,login.js对应的是login.html
        })
    ]
}

```
### 引入css文件
#### style-loader css-loader  引入css文件
#### less less-loader 引入less 文件
```
// webpack.config.js
module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,     // 解析css
                use: ['style-loader', 'css-loader'] // 从右向左解析
                /* 
                    也可以这样写，这种方式方便写一些配置参数
                    use: [
                        {loader: 'style-loader'},
                        {loader: 'css-loader'}
                    ]
                */
            }
        ]
    }
}

```
### 拆分css
#### extract-text-webpack-plugin 插件
```
//webpack.config.js
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
// 拆分css样式的插件
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filaneme: 'bundle.js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    // 将css用link的方式引入就不再需要style-loader了
                    use: 'css-loader'       
                })
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        // 拆分后会把css文件放到dist目录下的css/style.css
        new ExtractTextWebpackPlugin('css/style.css')  
    ]
}

``` 

### 拆分成多个css
#### extract-text-webpack-plugin 安装的时候加@next
#### mini-css-extract-plugin 不支持拆分多个css
```
// 正常写入的less
let styleLess = new ExtractTextWebpackPlugin('css/style.css');
// reset
let resetCss = new ExtractTextWebpackPlugin('css/reset.css');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: resetCss.extract({
                    use: 'css-loader'
                })
            },
            {
                test: /\.less$/,
                use: styleLess.extract({
                    use: 'css-loader'
                })
            }
        ]
    },
    plugins: [
        styleLess,
        resetCss
    ]
}

```
### 打包图片
#### file-loader url-loader
```
//背景引入图片处理
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: 'css-loader',
                    publicPath: '../'
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/'   // 图片打包后存放的目录
                        }
                    }
                ]
            }
        ]
    }
}

```
### 页面img打包图片
#### html-withimg-loader
```
module.exports = {
    module: {
        rules: [
            {
                test: /\.(htm|html)$/,
                use: 'html-withimg-loader'
            }
        ]
    }
}
```
### 打包字体图片和svg
#### file-loader
```
module.exports = {
    module: {
        rules: [
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            }
        ]
    }
}
```
### css加前缀
> 通过postcss中的autoprefixer可以实现将CSS3中的一些需要兼容写法的属性添加响应的前缀
#### 在页面新建个postcss.config.js,加入如下代码
```
module.exports = {
    plugins:{
        'autoprefixer':{browsers:'last 5 version'}
    }
}
```
### es6转义
#### babel-core babel-loader babel-preset-env babel-preset-stage-0
由于要兼容的代码不仅仅包含ES6还有之后的版本和那些仅仅是草案的内容，通过一个.babelrc文件来配置一下，对这些版本的支持
```
// .babelrc
{
    "presets": ["env", "stage-0"]   // 从右向左解析
}
//webpack.config.js
module.exports = {
    module: {
        rules: [
            {
                test:/\.js$/,
                use: 'babel-loader',
                include: /src/,          // 只转化src目录下的js
                exclude: /node_modules/  // 排除掉node_modules，优化打包速度
            }
        ]
    }
}

```
### 优化打包
在我们每次npm run build的时候都会在dist目录下创建很多打好的包，如果积累过多可能也会混乱

所以应该在每次打包之前将dist目录下的文件都清空，然后再把打好包的文件放进去
#### clean-webpack-plugin 插件
```
let CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        // 打包前先清空
        new CleanWebpackPlugin('dist')  
    ]
}

```
### 启动静态服务器
> 启动一个静态服务器，默认会自动刷新,对文件更改后自动刷新展示的效果
```
module.exports = {
    devServer: {
        contentBase: './dist',
        host: 'localhost',      // 默认是localhost
        port: 3000,             // 端口
        open: true,             // 自动打开浏览器
        hot: true               // 开启热更新
    }
}
```
如果开启了热更新，还需要引入webpack插件
```
// webpack.config.js
let webpack = require('webpack');

module.exports = {
    plugins: [
        // 热更新，热更新不是刷新
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 3000
    }
}
```
此时还没完虽然配置了插件和开启了热更新，但实际上并不会生效
```
// index.js
let a = 'hello world';
document.body.innerHTML = a;
console.log('这是webpack打包的入口文件');

// 还需要在主要的js文件里写入下面这段代码
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}

```
### resolve 
在webpack的配置中，resolve我们常用来配置别名和省略后缀名
```
module.exports = {
    resolve: {
        // 别名
        alias: {
            $: './src/jquery.js'
        },
        // 省略后缀
        extensions: ['.js', '.json', '.css']
    },
}

```
### 提取公共代码
```
 / 假设a.js和b.js都同时引入了jquery.js和一个写好的utils.js
// a.js和b.js
import $ from 'jquery';
import {sum} from 'utils';
```
那么他们两个js中其中公共部分的代码就是jquery和utils里的代码了

可以针对第三方插件和写好的公共文件
```
module.exports = {
    entry: {
        a: './src/a.js',
        b: './src/b.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve('dust')
    },
    // 提取公共代码
+   optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'initial',
                    name: 'vendor',  // 打包后的文件名，任意命名    
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10    
                },
                utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    name: 'utils',  // 任意命名
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
            }
        }
+   },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'a.html',
            template: './src/index.html',  // 以index.html为模板
+           chunks: ['vendor', 'a']
        }),
        new HtmlWebpackPlugin({
            filename: 'b.html',
            template: './src/index.html',  // 以index.html为模板
+           chunks: ['vendor', 'b']
        })
    ]
}

```
最后打包后的文件就会多一个vendor.js和utils.js
### 指定webpack不同执行文件
```
 "scripts": {
    "build": "cross-env NODE_ENV=production webpack",
    "dev": "cross-env NODE_ENV=development webpack-dev-server",
    "vue":"webpack --config webpack.cong.vue.js"
  }
```
- 感谢大牛的文章，此提交仅供自己学习https://juejin.im/post/5adea0106fb9a07a9d6ff6de

