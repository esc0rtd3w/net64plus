const webpack = require('webpack')
const BabiliPlugin = require('babili-webpack-plugin')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = [
  {
    target: 'electron-renderer',
    entry: {
      renderer: path.join(__dirname, 'src/renderer.js')
    },
    output: {
      filename: 'renderer.js',
      path: path.join(__dirname, 'build')
    },
    devtool: 'inline-source-map',
    node: {
      __dirname: true,
      __filename: false,
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        VERSION: process.env.npm_package_version
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/template.html'
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new BabiliPlugin({
        keepFnName: true
      })
    ],
    externals: {
      winprocess: 'require(require("path").resolve(__dirname, "winprocess"))'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            babelrc: false,
            presets: [
              ['env', {
                targets: {
                  electron: '1.6.14'
                },
                useBuiltIns: true
              }]
            ],
            plugins: ['transform-react-jsx']
          }
        },
        {
          test: /\.(png|jpg)$/,
          loader: 'url-loader',
          options: {
            limit: 25000,
            prefix: path.join(__dirname, 'build')
          }
        },
        {
          test: /\.(woff|ttf)$/,
          loader: 'url-loader',
          options: {
            limit: 25000,
            prefix: path.join(__dirname, 'build')
          }
        }
      ]
    }
  },
  {
    target: 'electron',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
      filename: 'index.js',
      path: path.join(__dirname, 'build')
    },
    devtool: 'inline-source-map',
    node: {
      __dirname: false,
      __filename: false
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'production',
        VERSION: process.env.npm_package_version
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new BabiliPlugin({
        keepFnName: true
      })
    ]
  }
]
