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
    // mode: "none",
    mode: "development",
    // mode: "production",
    entry: {
        // app: "./src/app.coffee"
        // map: "./src/map.js",
        datainmap: "./src/datainmap.js"
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, "./plugins/gh-datainmap/dist")
    },
    externals: {
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