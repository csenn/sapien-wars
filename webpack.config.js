const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const BUILD_DIR = path.resolve(__dirname, 'build')
const APP_DIR = path.resolve(__dirname, 'client')
const STATIC_DIR = path.resolve(__dirname, 'public')

const config = {
  entry: {
    index: path.join(APP_DIR, 'index.js')
  },
  output: {
    path: BUILD_DIR,
    // publicPath: '/build',
    filename: '[name].js'
  },
  plugins: [
    new CleanWebpackPlugin([BUILD_DIR], { watch: true }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new HtmlWebpackPlugin({
      template: `${APP_DIR}/index.html`,
      filename: `${BUILD_DIR}/index.html`
    }),
    new CopyWebpackPlugin([
      { from: STATIC_DIR, BUILD_DIR }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory',
        options: {
          presets: ['@babel/preset-env', '@babel/react']
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  devServer: {
    // stats: 'errors-only',
    port: '9222',
    proxy: {
      '*': { target: 'http://localhost:8020' }
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  config.mode = 'production'
} else {
  config.mode = 'development'
  config.devtool = 'cheap-module-source-map'
}

module.exports = config
