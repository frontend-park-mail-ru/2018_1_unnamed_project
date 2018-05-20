require('webpack');

const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

const pathsToClean = [
    'dist/*.*',
];

module.exports = {
    mode: 'development',
    entry: './public/index.ts',
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader', 'sass-loader'],
                    }
                ),
            },
            {
                test: /\.pug$/,
                use: 'pug-loader',
            },
            {
                test: /(\.jpg|\.png|woff2?|eot|ttf)$/,
                use: 'url-loader',
            },
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css', '.pug'],
    },
    plugins: [
        new CleanWebpackPlugin(pathsToClean, {verbose: true}),
        new ExtractTextPlugin({
            filename: '[name]-[hash].css',
        }),
        new HTMLWebpackPlugin({
            title: 'Ship collision',
            template: path.join(__dirname, 'public', 'index.html'),
        }),
        new WebpackAssetsManifest(),
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]-[hash].js',
        chunkFilename: '[id]-[chunkhash].js',
    },
};
