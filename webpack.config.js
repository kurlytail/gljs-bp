/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDebug = process.env.NODE_ENV === 'debug';
const isDist = isDebug || isProd ? '.min' : '';
const distPath = path.join(__dirname, 'dist');

let { dependencies } = require('./package.json');
dependencies = Object.keys(dependencies).map(key => {
    return new RegExp(`^${key}.*`);
});

const config = {
    entry: {
        app: './src/main.jsx'
    },

    output: {
        path: __dirname + '/app/build',
        publicPath: 'build/',
        filename: 'bundle.js'
    },

    devtool: isProd ? false : 'inline-source-map',

    resolve: {
        extensions: ['.js'],
        modules: ['node_modules', 'src']
    },

    plugins: [
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(isProd ? 'production' : 'development')
            }
        }),
        new ExtractTextPlugin({
            filename: 'bundle.css',
            disable: false,
            allChunks: true
        })
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: [
                    'source-map-loader',
                    {
                        loader: 'eslint-loader',
                        options: {
                            emitWarning: true,
                            exclude: /node_modules/
                        }
                    }
                ]
            },
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                exclude: /node_modules/,
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    loader: 'css-loader',
                    options: {
                        modules: true
                    }
                })
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: ['file-loader']
            }
        ]
    },

    watch: true,
    target: 'electron-renderer'
};

if (isProd) {
    config.plugins.push(new UglifyEsPlugin({ mangle: true, compress: true }));
}

module.exports = config;
