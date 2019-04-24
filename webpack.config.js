const resolve = require('path').resolve;
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        MapboxAccessToken: JSON.stringify('pk.eyJ1IjoibGVpemVuZ3hpYW5nIiwiYSI6ImNqNTM4NnV3YjA0Z2cyd3BnOXFuajg1YmoifQ.xC1N6Uxu4k-1LMjbSSM8NQ')
      }
    })],
  devServer: {
    contentBase: './dist',
    hot: true
  }
};
