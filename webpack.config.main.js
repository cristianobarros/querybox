var webpack = require('webpack');

module.exports={
  target: 'electron-main',
  entry:'./app/main.js',
  output:{
    filename:'./app/main-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query:{
          presets:['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
  ],
  node: {
    __dirname: false
  }
}
