const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

module.exports = {
  entry: {
    index: './src/js/index.js',
    //'chart-page': './src/js/chart-page.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),

    inline: true,
    port: 8000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.JS$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,

            options: {
              publicPath: '../',
            },
          },
          {
            // Translates CSS into CommonJS
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            // Then we apply postCSS fixes like autoprefixer and minifying
            loader: 'postcss-loader',
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              implementation: require('node-sass'),
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              publicPath: './fonts',
            },
          },
        ],
      },

      {
        test: /\.(gif|png|jpe?g)$/i,

        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: 'images/',
              useRelativePaths: true,
            },
          },

          {
            loader: 'image-webpack-loader',

            options: {
              mozjpeg: {
                progressive: true,
                quality: 60,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      chunks: ['index'],
      filename: './index.html', //ovo je destinacija, minimiziran original, ima vec src ka main.js
    }),
    // new HtmlWebPackPlugin({
    //   template: path.resolve(__dirname, 'src', 'asteroid-chart.html'),
    //   chunks: ['chart-page'],
    //   filename: './asteroid-chart.html',
    // }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  ],
};
