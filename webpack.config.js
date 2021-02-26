const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'production',
    plugins: [
        new Dotenv(),
        new MiniCssExtractPlugin({
            filename: "./css/[name].css",
            chunkFilename: "[id].[chunkhash].css"
        }),
        new CleanWebpackPlugin(),        
        new ManifestPlugin(),
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: true,
            appMountId: 'app',
            filename: 'index.html'
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            // chunks: 'all'
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    // chunks: 'all',
                    name: 'vendor',
                    test: 'vendor',
                    enforce: true
                }
            }
        }
    },
    // performance: { hints: false },
    target: 'electron-renderer',
    // target: "node",
    entry: {
        app: ["@babel/polyfill", path.resolve(__dirname, 'src/Index.js')]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                },
                resolve: { extensions: [".js", ".jsx"] },
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
                sideEffects: true

            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1000000,
                            fallback: 'file-loader',
                            name: 'images/[name].[hash].[ext]',
                        }
                    }
                ]
            }
        ]
    }
}