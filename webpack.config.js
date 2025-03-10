import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyPlugin from 'copy-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import dotenv from 'dotenv';
dotenv.config()

// to allow the use of __dirname
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './client/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(tsx?)$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    //   {
    //     test: /\.module\.css$/,
    //     use: [
    //         MiniCssExtractPlugin.loader,
    //       {
    //         loader: 'css-loader',
    //         options: { modules: true },
    //       },
    //     ],
    //   },
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
    new CopyPlugin({
        patterns: [{ from: './client/styles/app.css' }], 
    }), 
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL || 'http://localhost:8081'),
    }),
    // new MiniCssExtractPlugin({
    //     filename: '[name].css', // Output CSS file names
    //     chunkFilename: '[id].css',
    //   }),
  ],
  devServer: {
    port: 8081,
  },
};
