var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs'),
  env = require('./utils/env'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin');

// load the secrets
var alias = {
  'react-dom': 'react-dom',
};

var secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js');

var fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
];

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

var options = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    devtools_tab: path.join(__dirname, 'src', 'pages', 'Devtools', 'devtools_page.js'),
    devtools_page: path.join(__dirname, 'src', 'pages', 'Devtools', 'index.jsx'),
    app: path.join(__dirname, 'src', 'pages', 'Content', 'Controller.js'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  //chromeExtensionBoilerplate: {
  //  notHotReload: ['contentScript'],
  //},
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader", "sass-loader"],
        //exclude: /node_modules/,
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: 'file-loader?name=[name].[ext]',
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ],
  },
  resolve: {
    alias: alias,
    extensions: fileExtensions
      .map((extension) => '.' + extension)
      .concat(['.jsx', '.js', '.css']),
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // clean the build folder
    new CleanWebpackPlugin({
      verbose: true,
      // cleanStaleWebpackAssets: false,
    }),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/manifest.json',
          to: path.join(__dirname, 'build'),
          force: true,
          transform: function(content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
      ],
      {
        logLevel: 'info',
        copyUnmodified: true,
      }
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/Content/content_script.js',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ]
    ),
	  new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/Content/ContentSelector.js',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ]
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/Content/ContentScript.js',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ]
    ),			
    new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/Content/BackgroundScript.js',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ]
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/Content/ElementQuery.js',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ]
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/Background/background_script.js',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ]
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/Background/Config.js',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ]
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/src/jquery-2.0.3.js',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ]
    ),
    new CopyWebpackPlugin(
      [
        {
          from: 'src/pages/Content/content_script.css',
          to: path.join(__dirname, 'build'),
          force: true,
        },
      ]
    ),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'Devtools', 'devtools_pse.html'),
      filename: 'pse-extension.html',
      chunks: ['devtools_page','devtools_tab','app']
   }),

    new WriteFilePlugin(),
  ],
};

if (env.NODE_ENV === 'development') {
  options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
