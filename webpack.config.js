
module.exports = {
  mode: 'development',
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/public/dist"
  },
  devtool: "source-map",

  resolve: {
    extensions: ['.js', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  },
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDom'
  // }
};