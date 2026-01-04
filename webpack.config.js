const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'cheap-module-source-map',
    entry: {
      popup: './src/popup.js',
      setup: './src/setup.js',
      background: './src/background.js',
      content: './src/content/imageProcessor.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].bundle.js',
      clean: true
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      fallback: {
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser"),
        "path": require.resolve("path-browserify")
      },
      alias: {
        "process/browser": require.resolve("process/browser.js")
      }

    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          // Webpack 5 Asset Modules replace file-loader/url-loader
          test: /\.(ico|eot|otf|webp|ttf|woff|woff2)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[hash][ext][query]'
          }
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[hash][ext][query]'
          }
        }
      ]
    },
    performance: {
      hints: false
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new HtmlWebpackPlugin({
        inject: true,
        chunks: ['popup'],
        filename: 'popup.html',
        template: './src/popup.html'
      }),
      new HtmlWebpackPlugin({
        inject: true,
        chunks: ['setup'],
        filename: 'setup.html',
        template: './src/setup.html'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: './src/manifest.json' },
          { from: './src/assets/icon-*.png', to: 'assets/[name][ext]' }
        ]
      }),
      // Provide polyfills for Node.js globals
      new webpack.ProvidePlugin({
        process: require.resolve("process/browser.js"),
        Buffer: [require.resolve("buffer"), 'Buffer'],
      }),
      // Define environment variables
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      })
    ],
    // Handle Node.js globals for browser environment
    node: {
      global: true,
      __filename: false,
      __dirname: false,
    }
  };
};