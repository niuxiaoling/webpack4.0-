let  path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin =  require('html-webpack-plugin'); //html模板
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');   //extra-text-webpack-plugin 将打包到js的css文件拆分
let CleanWebpackPlugin = require('clean-webpack-plugin');//每次打包后清除dist目录

//基础打包
// module.exports = {
//     entry:'./src/index.js', //入口文件
//     output:{                //出口文件
//         filename:'bundle.js',        //打包后的文件名称
//         path:path.resolve('dist')
//     }
// }

//多入口文件打包
module.exports = {
    mode:'development', //"production" | "development" | "none" 打包的js压缩不压缩的区别
    //1.写成数组的方式可以打出多入口文件,打包后合成一个
    // entry:['./src/index.js','./src/login.js'],
    //2.真正实现需要写成对象的方式
    entry:{
        index:'./src/index.js',
        login:'./src/login.js'
    },
    //[name]可以将入口和出口文件名一一对应
    output:{
        filename:'[name].js',
        path:path.resolve('dist')//打包后会生成index.js和login.js文件
    },
    //配置html模板
    // plugins:[
    //     //new 一下使用这个插件
    //     new HtmlWebpackPlugin({
    //         //用哪个html作为模板
    //         template:'./src/index.html',
    //         hash:true  //会在打包好的bundle.js后面加上hash串
    //     })
    // ],
    //多页面开发
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html',
            chunks:['vendor','index'] //对应关系，index.js对应index.html
        }),
        new HtmlWebpackPlugin({
            template:'./src/login.html',
            filename:'login.html',
            chunks:['vendor','login']
        }),
        //引入单个css
        new ExtractTextWebpackPlugin('css/style.css'),
        //打包前先清空
        new CleanWebpackPlugin('dist') ,
        // 引入webpack配置的热更新js
        new webpack.HotModuleReplacementPlugin() 
    ],
    module:{
        rules:[
            {
                test:/\.css$/,
                // 将css用link的方式引入就不再需要style-loader了
                use:['style-loader', 'css-loader'] // 从右向左解析
            },
            {
                test:/\.(jpe?g|png|gif)$/,
                use:[
                    {
                        loader :'url-loader',
                        options: {
                            limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                            outputPath: 'images/'   // 图片打包后存放的目录
                        }
                    }
                   
                ]
            },
            {
                test:/\.(htm|html)$/,
                use:'html-withimg-loader'  //配置图片在html页面能够使用的插件
            },
            {
                test:/\.(eot|ttf|woff|svg)$/,
                use:'file-loader'
            },
            {
                test:/\.js$/,
                use:'babel-loader',
                include:/src/,   //只转化src目录下 的Js
                exclude:/node_modules/ //忽略node_modules,优化打包速度
            }
        ]
    },
    //启动静态服务器
    devServer:{
        contentBase: './dist',
        host: 'localhost',      // 默认是localhost
        port: 3000,             // 端口
        open: true,             // 自动打开浏览器
        hot: true,               // 开启热更新
    },
    //resolve解析
    resolve:{
        //别名
        alias:{
            $:'./src/jquery.js'
        },
        //省略后缀
        extensions:['.js','.json','.css']
    },
    //提取公共代码
    optimization:{
        splitChunks:{
            cacheGroups:{
                vendor:{  //抽离第三方插件
                    test:/node_modules/, //指定是node_modules下的第三方包
                    chunks:'all',
                    name:'vendor', //打包后的文件名，任意命名
                    //设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority:10
                },
                utils:{ // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks:'initial',
                    name:'utils',
                    minSize:0 //只要超出0 字节就生成一个新包    
                }
            }
        }
    }
}


