// for generate path (path - node.js module)
const path                 = require('path');
// for connection scripts
const HTMLWebpackPlugin    = require('html-webpack-plugin');
// for cleaning directory 'dist' and regenerate existing files
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin    = require('copy-webpack-plugin');
// the plugin and for working with loader for .css by creating a SEPARATE file of .css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// the plugin for minimize .css
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
// build in Webpack 5 plugin for minimize .js, which doesn't need to be installed
const TerserWebpackPlugin = require('terser-webpack-plugin');


/*** Additional variables for more convenient work ***/
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

/*** Additional functions for more convenient work ***/
// function for optimization
const optimization = () => {
  const config = {
      /*splitChunks: {
          chunks: 'all'
      },
      runtimeChunk: 'single'*/
      splitChunks: {
          cacheGroups: {
              vendors: {
                  name: `chunk-vendors`,
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  chunks: 'initial'
              },
              common: {
                  name: `chunk-common`,
                  minChunks: 2,
                  priority: -20,
                  chunks: 'initial',
                  reuseExistingChunk: true
              }
          }
      },
      runtimeChunk: 'single'
  };
  if (isProd) {
      config.minimizer = [
          new CssMinimizerWebpackPlugin (),
          new TerserWebpackPlugin ()
      ]
  }
    return config
};


// [name] - webpack takes source-file name,
// [contenthash] - webpack generate random hash number
const fileName = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const cssLoaders = (addition) => {
    const loader = [
          {
              loader: MiniCssExtractPlugin.loader
          },
            'css-loader'
        ];

    if (addition) {
        loader.push(addition)
    }
    return loader
};

// fore React-components-css/scss/less
const cssModuleLoaders = (addition) => {
    const loader = [
          {
              loader: MiniCssExtractPlugin.loader
          },
          {
              loader: 'css-loader',
              options: {
                  modules: {
                      localIdentName: '[local]__[sha1:hash:hex:7]',
                  }
              }
          }
        ];

    if (addition) {
        loader.push(addition)
    }
    return loader
};

const babelOptions = (preset) => {
     const opt = {
        presets: [
            '@babel/preset-env',
        ],
    };
    if (preset) {
        opt.presets.push(preset)
    }
    return opt
};

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }];
    if (isDev) {
        loaders.push({loader: 'eslint-loader'})
    }
    return loaders
};

// min configuration for webpack
module.exports = {
    //mode: 'development', // for development (to expand code)
    // indicates where the application sources are located
    context: path.resolve(__dirname, 'src'),
    entry: { // 2 files From which webpack generate 2 bundles
        main: ['@babel/polyfill','./index.jsx'],
        analytics: './analytics.ts'
    },
    output: { // where webpack generate bundles and from were webpack hosting static resources
        filename: fileName('js'),
        // path to files of bundles
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        // to rewrite understandable to webpack extensions (default - .js and .json)
        extensions: ['.js', '.jsx', '.json', '.png', '.css', '.scss'],
        // aliases for file-path in imports
        alias: {
            // see from '/' - webpack.config.js
            '@models': path.resolve(__dirname, 'src/models' ),
            '@': path.resolve(__dirname, 'src')
        }
    },
    // to connect libraries to few files by creating in 'dest' 1 file of each library
    optimization: optimization(),
    // availability to auto reload server and client after changing context in files
    target: isDev ? 'web' : 'browserslist',
    devServer: {
        port: 4200,
        hot: isDev,
    },
    devtool: isDev ? 'source-map' : false,
    stats: {
        builtAt: true,
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            // to add for all scripts attribute 'defer'
            scriptLoading: 'defer',
            // to pass all scripts before closing </body>
            inject: 'body',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        // for cleaning directory 'dist'
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin ({
            filename: fileName('css')
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false
                        }
                    }
                ],
                exclude: /\.module\.css$/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]__[sha1:hash:hex:7]',
                            }
                        }
                    }
                ],
                include: /\.module\.css$/
            },
            {   // fore React-components
                test: /\.module\.s[ac]ss$/,
                use: cssModuleLoaders('sass-loader')
            },
            {
                test: /^((?!\.module).)*s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {   // fore React-components
                test: /\.module\.less$/,
                use: cssModuleLoaders('less-loader')
            },
            {
                test: /^((?!\.module).)*less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.(?:ico|png|jpg|jpeg|svg|gif)$/,
                loader: 'file-loader',
                options: {
                    outputPath: "assets/images",
                    name() {
                        if (isDev) {
                            return "[name].[ext]";
                        }

                        return "[name].[hash].[ext]";
                    },
                },
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                loader: "file-loader",
                options: {
                    outputPath: "assets/fonts",
                    name() {
                        if (isDev) {
                            return "[name].[ext]";
                        }

                        return "[name].[hash].[ext]";
                    },
                },
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions('@babel/preset-react')
                }
            }
        ]
    }
};