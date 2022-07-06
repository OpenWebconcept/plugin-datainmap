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
            "corejs": 3,
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
        'admin-locationpicker': "./src/admin-locationpicker.js",
        'admin-location': "./src/admin-location.js"
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
        new webpack.BannerPlugin(licenseText())
    ],
    devtool: 'cheap-source-map'
};

function licenseText() { return `Copyright 2020-2022 Gemeente Heerenveen

Licensed under the EUPL, Version 1.2 or – as soon they will be approved by the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12

Unless required by applicable law or agreed to in writing, software distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and limitations under the Licence.`};