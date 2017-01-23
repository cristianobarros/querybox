var webpack = require('webpack');

module.exports={
  target: 'electron',
  entry:'./app/renderer.js',
  output:{
    filename:'./app/renderer-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query:{
          presets:['react','es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
    }),
  ],
}
