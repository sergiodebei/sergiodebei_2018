const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const globImporter = require('node-sass-glob-importer');
const postcssPresetEnv = require('postcss-preset-env');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

//added
const AssetsPlugin = require('assets-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

//MODE
const isDev = process.env.NODE_ENV === 'development';

//PATH
// const resourcesPath = path.resolve(__dirname, 'src/');
// const publicPath = path.resolve(__dirname, 'assets/');

const fs = require('fs');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
}

const paths = {
    appSrc: resolveApp('src'),
    appBuild: resolveApp('assets'),
    appIndexJs: resolveApp('src/js/main.js'),
    appNodeModules: resolveApp('node_modules'),
};


module.exports = {
    bail: !isDev,
    mode: isDev ? 'development' : 'production',
    // We generate sourcemaps in production. This is slow but gives good results.
    // You can exclude the *.map files from the build during deployment.
    target: 'web',
    devtool: isDev ? 'cheap-eval-source-map' : 'source-map',
    entry: [paths.appIndexJs],
    output: {
        path: paths.appBuild,
        filename: isDev ? 'js/bundle.js' : 'js/bundle.[hash:8].js'
    },
    module: {
        rules: [
            // Disable require.ensure as it's not a standard language feature.
            { parser: { requireEnsure: false } },
            // Transform ES6 with Babel
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
                loader: 'babel-loader',
                include: paths.appSrc,
            },
            {
                test: /\.s?css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: () => [postcssPresetEnv()],
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            importer: globImporter(),
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: isDev
                            ? {}
                            : {
                                limit: 8192,
                                name: 'images/[name]-[hash].[ext]',
                            },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                exclude: /images/,
                use: [
                    {
                        loader: 'url-loader',
                        options: isDev
                            ? {}
                            : {
                                limit: 8192,
                                name: 'fonts/[name]-[hash].[ext]',
                            },
                    },
                ],
            }
        ],
    },
    optimization: {
        minimize: !isDev,
        minimizer: [
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false,
                        annotation: true,
                    }
                }
            }),
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        warnings: false
                    },
                    output: {
                        comments: false
                    }
                },
                sourceMap: true
            })
        ]
    },
    plugins: [
        !isDev && new CleanWebpackPlugin(['build']),
        new MiniCssExtractPlugin({
            filename: isDev ? 'css/bundle.css' : 'css/bundle.[hash:8].css'
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development', // use 'development' unless process.env.NODE_ENV is defined
            DEBUG: false,
        }),
        new AssetsPlugin({
            path: paths.appBuild,
            filename: 'assets.json',
        }),
        isDev &&
        new FriendlyErrorsPlugin({
            clearConsole: false,
        }),
        isDev &&
        new BrowserSyncPlugin({
            notify: false,
            host: 'localhost',
            port: 4000,
            logLevel: 'silent',
            files: ['./*.php'],
            proxy: '',
        }),
    ].filter(Boolean),
};
