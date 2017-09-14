var webpack = require('webpack');
var path = require('path');
var ignoreFiles = new webpack.IgnorePlugin(/\.\/jquery.js$/);


//var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
    devtool: 'eval-source-map',
    context: path.join(__dirname, 'public'),
    entry: {
        index:'./public/unminify/views/index.js',
        vendors: ['jquery', 'moment']
    },
    output: {
        path: path.join(__dirname, 'public/minify'),
        filename: '[name].2.4.js'
    },
    externals:{
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader'},

//		            {   test: /\.html$/,
//		            	//exclude: /index\.html$/,
//		            	loader: 'html-loader'
//		            	},

            {
                test: /\.js$/,
                // excluding some local linked packages.
                // for normal use cases only node_modules is needed.
                exclude: /node_modules/,
                loader: 'babel'
            },
//		            {
//		            	test: /\.(png|jpg|gif)$/,
//		            	loader: 'url-loader?limit=8192&name=./Content/[hash].[ext]'
//		            }
        ]
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime'],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            moment: "moment",
        }),

//		        new HtmlWebpackPlugin({
//        	        filename:path.join(__dirname, 'FindPassword.html'),
//   				template:path.join(__dirname, 'FindPassword-T.html'),
//    				inject: 'head',
//    				hash:true,
//    				chunks:['findPwd','vendors']
//		         }),
//
//		          new HtmlWebpackPlugin({
//        	        filename:path.join(__dirname, 'download.html'),
//   				template:path.join(__dirname, 'download-T.html'),
//    				inject: 'head',
//    				hash:true,
//    				chunks:['download','vendors']
//		           }),

        new webpack.ProvidePlugin({
            _:"lodash",
            $:"jQuery"
        }),

        //第三方库打包生成的文件
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendors",
            filename: "vendor.2.4.js",
            //filename: "vendor.js",
            //filename: "vendor.[hash].js",
            minChunks: Infinity
        }),
        ignoreFiles
    ],
    devServer: {
        contentBase: path.join(__dirname, 'build'),
        publicPath: "http://localhost:8080/build/",
        colors: true,
        historyApiFallback: true,
        hot: true,
        inline: true
    },
}

if (process.env.NODE_ENV === 'production') {
    config.devtool = false;
    config.output.path = path.join(__dirname, 'public/js/minify');
    config.plugins = config.plugins.concat([
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        }),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify('production') }
        })
    ]);
};
module.exports = config;
