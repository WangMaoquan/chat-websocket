const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const resolve = (dir) => path.resolve(__dirname, dir);
let port = 8000;
module.exports = (env) => ({
  mode: env.production ? 'production' : 'development',
  entry: './src/main.ts',
  output: {
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      {
        test: /\.css$/,
        use: [
          env.production !== 'production'
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/.vue$/],
            },
          },
        ],
      },
      {
        test: /\.tsx$/,
        use: ['vue-loader', 'vue-tsx-loader?template=html'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'vue3 chat',
      template: 'public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename:
        env.production !== 'production' ? '[name].css' : '[name].[hash].css',
      chunkFilename:
        env.production !== 'production' ? '[id].css' : '[id].[hash].css',
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': resolve('src'),
    },
  },
  devServer: {
    port: port,
    hot: true,
    historyApiFallback: true,
  },
  optimization: {
    usedExports: true,
  },
});
