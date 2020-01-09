const path = require('path');
const webpack = require('webpack');

const babel_presets = [
    [
        "@babel/env", {
            "targets": {
                "edge": "17",
                "firefox": "60",
                "chrome": "67",
                "safari": "11.1",
                "ie": "11"
                // "browsers": [
                //     "last 2 versions",
                //     "ie >= 11"
                // ],
            },
            "corejs": "2.6.10",
            "useBuiltIns": "usage"
        },
        "react"
    ],
    ["@babel/preset-react"]
];

module.exports = {
    entry: {
        datainmap: "./src/datainmap.js",
        'admin-layers': "./src/admin-layers.js",
        'admin-locationpicker': "./src/admin-locationpicker.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, "./plugins/gh-datainmap/dist")
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    externals: {
        jquery: 'window.jQuery'
    },
    module: {
        rules: [
            {
                test: /\.coffee$/,
                use: [
                    {
                        loader: 'coffee-loader',
                        options: {
                            transpile: {
                                "presets": babel_presets
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: "babel-loader",
                    options: {
                        "presets": babel_presets
                    }
                }]
            },
            { test: /\.html$/, loader: 'html-loader' },
            {
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['.js', '.json', '.coffee'],
        modules: [
            path.resolve('./node_modules')
        ],
        alias: {
        }
    },
    plugins: [
        new webpack.BannerPlugin('© Gemeente Heerenveen')
    ],
    devtool: 'cheap-source-map'
};