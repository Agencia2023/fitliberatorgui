const path = require('path')
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const WorkerPlugin = require('worker-plugin');

module.exports = {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    port: 9000,
    host: '0.0.0.0',
    disableHostCheck: true,
    noInfo: false,
    stats: 'errors-only',
    
  },  
  target: 'electron-renderer',

  
  entry: {
    app: ["@babel/polyfill", path.resolve(__dirname, 'src/Index.js')]    
  },
  output: {
    path: path.resolve(__dirname, 'public/build'),
    filename: 'js/[name].js'    ,
  },
  plugins: [  
    // new WorkerPlugin({globalObject: 'self' }),
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: "./css/[name].css",
      chunkFilename: "[id].[chunkhash].css"
    })
  ],
  module: {
    rules: [      
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },   
      // {
      //   test: /\.js$/,
      //   use: ["source-map-loader"],
      //   enforce: "pre"  ,
      //   exclude:[
      //     /(node_modules)/
      //    ]      
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env',{
                "targets": {
                  "esmodules": true
                }
              }], 
              '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        },
        resolve: { extensions: [".js", ".jsx"] },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader']
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
