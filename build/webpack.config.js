/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin');
const libMode = process.env.LIBMODE
const isFullMode = libMode === 'full'
let externals = [{
    vue: {
        root: 'Vue',
        commonjs: 'vue',
        commonjs2: 'vue',
    },
}, ]
if (!isFullMode) {
    externals.push({
            '@popperjs/core': '@popperjs/core',
            'async-validator': 'async-validator',
            'mitt': 'mitt',
            'normalize-wheel': 'normalize-wheel',
            'resize-observer-polyfill': 'resize-observer-polyfill',
        },
        /^dayjs.*/,
        /^lodash.*/)
}
const publicCopyIgnore = [];
publicCopyIgnore.push({
    glob: './public/index.html',
    matchBase: false
});
const config = {
    mode: 'production',
    entry: path.resolve(__dirname, '../packages/vue-bw-fw/index.js'),
    output: {
        path: path.resolve(__dirname, '../lib'),
        publicPath: '/',
        filename: isFullMode ? 'index.full.js' : 'index.js',
        libraryTarget: 'umd',
        library: 'VueFwLerna',
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
    module: {
        rules: [{
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.json'],
    },
    externals,
    plugins: [
        // new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        // new BundleAnalyzerPlugin(),
        // new HtmlWebpackPlugin({
        //     template: './public/index.html',
        //     filename: 'index.html',
        //     //  favicon:'./src/assets/image/favicon.ico'
        // }),
        // new CopyWebpackPlugin([{ //不需要打包的静态资源
        //     from: 'public',
        //     to: '',
        //     toType: 'dir',
        //     ignore: publicCopyIgnore
        // }])
    ],
}

module.exports = config