const path = require('path');
require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({filename: 'bundle.css'});

module.exports = {
    entry: './public/index.ts',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: extractCSS.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader']
                    }
                )
            },
            {
                test: /\.pug$/,
                use: 'pug-loader'
            },
            {
                test: /\.png|woff2?|eot|ttf|svg$/,
                use: 'url-loader'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.css', '.pug'],
    },
    plugins: [
        extractCSS,
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
    },
};
