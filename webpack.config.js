const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const theme = require('./theme.js');

const nodeEnv = process.env.NODE_ENV || 'development';
const isDev = nodeEnv !== 'production';
const ASSET_PATH = process.env.ASSET_PATH || '/';

// 环境
const PORT_ENV = process.env.PORT || 3000;
const HOST_ENV = process.env.HOST || '';
const APIPORT_ENV = process.env.APIPORT || 18081;
const PREVIEW = process.env.PREVIEW || false;

// const tslint = true;
const stylelint = false;

// 设置插件环境 development/prodcution
const getPlugins = () => {
  // Common
  const plugins = [
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].css',
      allChunks: true,
      disable: isDev
    }),
    new HtmlWebpackPlugin({
      title: 'webpack-antd',
      inject: true,
      template: path.join(process.cwd(), '/public/index.html')
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: JSON.stringify(nodeEnv) }),
    new webpack.DefinePlugin({
      'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
      __DEV__: isDev,
      __PORT__: PORT_ENV,
      __HOST__: JSON.stringify(HOST_ENV),
      __APIPORT__: JSON.stringify(APIPORT_ENV),
      __PREVIEW__: PREVIEW
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ];
  if (isDev) {
    plugins.push(
      new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
      new webpack.HotModuleReplacementPlugin(),
      new StyleLintPlugin({ failOnError: stylelint }),
      new webpack.NamedModulesPlugin()
    );
  } else {
    plugins.push(
      new CleanWebpackPlugin(['public/dist']),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new UglifyJSPlugin({
        uglifyOptions: {
          beautify: true, // 最紧凑的输出
          comments: true, // 删除所有的注释
          compress: {
            warnings: false,
            drop_console: !PREVIEW, // 删除所有的 `console` 语句
            collapse_vars: true,
            reduce_vars: true, // 提取出出现多次但是没有定义成变量去引用的静态值
          }
        }
      }),
    );
  }
  return plugins;
};

const getOptimization = () => {
  const optimization = {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
    
  };
  return optimization;
}

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.tsx'
  },
  output: {
    filename: "index.js",
    path: __dirname + "/public/dist"
  },
  devtool: "source-map",
  devServer: {
    contentBase: path.join(__dirname, "public"),
    historyApiFallback: true, // 如果使用 createBrowserHistory 那么应该设置为 true
    overlay: true,
    hot: true,
    port: PORT_ENV,
    stats: {
      modules: false,
      colors: true
    }
  },
  plugins: getPlugins(),
  optimization: getOptimization(),
  resolve: {
    modules: [path.resolve(__dirname, 'src/'), 'node_modules'],
    extensions: ['.js', '.webpack.js', '.ts', '.tsx', '.jsx', '.json', '.css', '.less']
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader',
      },
      {
        enforce: 'pre',
        test: /\.(j|t)sx?$/,
        include: [path.resolve(__dirname, 'src/')],
        use: ['tslint-loader', 'source-map-loader']
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use:['typings-for-css-modules-loader', 'postcss-loader']
          },
        )
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use:['typings-for-css-modules-loader', 'postcss-loader']
          },
        )
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use:[
              'typings-for-css-modules-loader', 'postcss-loader', 
                {
                  loader: 'less-loader',
                  options: {
                    javascriptEnabled: true,
                    modifyVars: theme
                  }
                }
            ]
          }
        )
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use:[
              {
                loader: 'typings-for-css-modules-loader',
                options: {
                  modules: true,
                  // namedExport: true
                  // 支持 import * as styles from './index.less'; 的写法
                  // https://medium.com/@sapegin/css-modules-with-typescript-and-webpack-6b221ebe5f10
                  namedExport: true,
                  // 支持驼峰
                  camelCase: true,
                  importLoaders: 1,
                  localIdentName: '[path]__[name]__[local]__[hash:base64:5]',
                  sourceMap: true
                }
              },
              { loader: 'postcss-loader', options: { sourceMap: true } },
              {
                loader: 'less-loader',
                options: {
                  outputStyle: 'expanded',
                  sourceMap: true,
                  javascriptEnabled: true,
                  sourceMapContents: !isDev
                }
              }
            ]
          }
        )
      },
    ]
  },
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDom'
  // }
};