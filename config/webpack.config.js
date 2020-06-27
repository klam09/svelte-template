'use strict';

const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const postcssNormalize = require('postcss-normalize');

const paths = require('./paths');
const {
    getEnvironmentConfig,
    getServedPath
} = require('./env');

module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = !isEnvDevelopment;
    const publicPath = isEnvProduction ? getServedPath() : '/';
    const envConfigObj = getEnvironmentConfig();

    return Object.assign({
            mode: webpackEnv,
            devtool: isEnvDevelopment && 'cheap-module-eval-source-map',
            // Stop compilation early in production
            bail: isEnvProduction,
            entry: paths.appIndexJs,
            output: {
                path: isEnvProduction ? paths.appBuild : undefined,
                pathinfo: isEnvDevelopment,
                filename: 'js/index.js',
                publicPath: publicPath,
                // Point sourcemap entries to original disk location (format as URL on Windows)
                devtoolModuleFilenameTemplate: isEnvProduction ?
                    info =>
                        path
                            .relative(paths.appSrc, info.absoluteResourcePath)
                            .replace(/\\/g, '/') : isEnvDevelopment &&
                                                   (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'))
            },
            optimization: {
                minimize: isEnvProduction,
                minimizer: [
                    new TerserPlugin({
                        terserOptions: {
                            parse: {
                                ecma: 8
                            },
                            compress: {
                                ecma: 5,
                                warnings: false,
                                comparisons: false,
                                inline: 2,
                                drop_console: envConfigObj.DROP_CONSOLE // or pure_funcs: ['console.log', 'console.info']
                            },
                            mangle: {
                                safari10: true
                            },
                            output: {
                                ecma: 5,
                                comments: false,
                                ascii_only: true
                            }
                        },
                        parallel: true,
                        cache: true,
                        sourceMap: false
                    }),
                    new OptimizeCSSAssetsPlugin({
                        cssProcessorOptions: {
                            parser: safePostCssParser,
                            map: false
                        }
                    })
                ]
            },
            resolve: {
                modules: ['node_modules'],
                extensions: ['.mjs', '.js', '.svelte', '.json', '.scss'],
                alias: {
                    'svelte': path.resolve('node_modules', 'svelte'),
                    '@assets': path.resolve(__dirname, '../src/assets'),
                    '@pages': path.resolve('../src/pages'),
                    '@images': path.resolve(__dirname, '../src/assets/images'),
                    './@images': path.resolve(__dirname, '../src/assets/images'),
                    '@utils': path.resolve(__dirname, '../src/utils'),
                    '@constants': path.resolve(__dirname, '../src/constants'),
                    '@components': path.resolve(__dirname, '../src/components'),
                    '@styles': path.resolve(__dirname, '../src/styles'),
                    '@stores': path.resolve(__dirname, '../src/stores')
                }
            },
            module: {
                strictExportPresence: true,
                rules: [
                    {
                        parser: {
                            requireEnsure: false
                        }
                    },
                    {
                        test: /\.svelte$/,
                        enforce: 'pre',
                        use: [{
                            options: {
                                eslintPath: require.resolve('eslint')
                            },
                            loader: require.resolve('eslint-loader')
                        }],
                        include: paths.appSrc
                    },
                    {
                        oneOf: [
                            {
                                test: [/\.(bmp|gif|jpe?g|png)$/],
                                loader: require.resolve('url-loader'),
                                options: {
                                    limit: 10000,
                                    name: 'images/[name].[ext]'
                                }
                            },
                            {
                                test: /\.js$/,
                                exclude: /node_modules/,
                                loader: 'babel-loader',
                            },
                            {
                                test: /\.mjs$/,
                                include: /node_modules/,
                                type: 'javascript/auto',
                                loader: 'babel-loader'
                            },
                            {
                                test: /\.svelte$/,
                                use: [
                                    {
                                        loader: 'babel-loader',
                                    },
                                    {
                                        loader: require.resolve('svelte-loader'),
                                        options: {
                                            emitCss: true,
                                            hotReload: false,
                                            preprocess: require('svelte-preprocess')({
                                                scss: true,
                                            }),
                                        }
                                    }
                                ]
                            },
                            {
                                test: /\.css$/,
                                use: [
                                    isEnvDevelopment && require.resolve('style-loader'),
                                    isEnvProduction && {
                                        loader: MiniCssExtractPlugin.loader,
                                    },
                                    {
                                        loader: require.resolve('css-loader'),
                                        options: {
                                            sourceMap: isEnvProduction,
                                            importLoaders: 2,
                                        },
                                    },
                                    {
                                        loader: require.resolve('postcss-loader'),
                                        options: {
                                            ident: 'postcss',
                                            plugins: () => [
                                                require('postcss-flexbugs-fixes'),
                                                require('postcss-preset-env')({
                                                    autoprefixer: {
                                                        flexbox: 'no-2009',
                                                    },
                                                    stage: 3,
                                                }),
                                                postcssNormalize(),
                                            ],
                                            sourceMap: isEnvProduction,
                                        },
                                    },
                                ].filter(Boolean),
                                sideEffects: true,
                            },
                            {
                                test: /\.svg$/,
                                exclude: /node_modules/,
                                use: {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'images/[name].[ext]'
                                    }
                                }
                            },
                            {
                                test: /\.(eot|otf|ttf|woff|woff2)$/,
                                exclude: /node_modules/,
                                use: {
                                    loader: 'file-loader',
                                    options: {
                                        name: 'fonts/[name].[ext]'
                                    }
                                }
                            },
                            {
                                loader: require.resolve('file-loader'),
                                exclude: [/\.(mjs|js|jsx)$/, /\.html$/, /\.json$/, /\.svelte$/],
                                options: {
                                    name: 'media/[name].[ext]'
                                }
                            }
                        ]
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin(
                    Object.assign({}, {
                            inject: true,
                            template: paths.appHtml
                        },
                        isEnvProduction
                            ? {
                                minify: {
                                    removeComments: true,
                                    collapseWhitespace: true,
                                    removeRedundantAttributes: true,
                                    useShortDoctype: true,
                                    removeEmptyAttributes: true,
                                    removeStyleLinkTypeAttributes: true,
                                    keepClosingSlash: true,
                                    minifyJS: true,
                                    minifyCSS: true,
                                    minifyURLs: true
                                }
                            }
                            : undefined
                    )
                ),
                new InterpolateHtmlPlugin(envConfigObj.envConfig.APPCONFIG),
                new webpack.DefinePlugin(envConfigObj.processedEnvConfig),
                isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
                isEnvDevelopment && new CaseSensitivePathsPlugin(),
                new MiniCssExtractPlugin({
                    filename: 'css/[name].css'
                }),
                isEnvProduction && new CleanWebpackPlugin(),
                new CopyPlugin([{
                    from: paths.appPublic,
                    to: paths.appBuild,
                    toType: 'dir'
                }]),
            ].filter(Boolean),
            node: {
                module: 'empty',
                dgram: 'empty',
                dns: 'mock',
                fs: 'empty',
                net: 'empty',
                tls: 'empty',
                child_process: 'empty'
            },
            performance: false
        },
        isEnvDevelopment && {
            devServer: {
                inline: true,
                contentBase: paths.appPublic,
                hot: true,
                host: '0.0.0.0',
                publicPath: '/',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                watchContentBase: true,
                disableHostCheck: true,
            }
        }
    );
};
