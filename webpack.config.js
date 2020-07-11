const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
    mode: 'development', // "production" | "development" | "none"
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 5200,
        compress: true,
        historyApiFallback: true,
        hot: true,
        https: false,
        noInfo: true,
        open: false,
    },
    resolve: {
        extensions: [".ts", ".js", ".json", ".jsx", ".css"]
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: path.resolve(__dirname, 'src/components')
            },
            {
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: 'v-[name]__[local]--[hash:base64:5]'
                        }
                    }
                }],
                include: [
                    path.resolve(__dirname, 'src/components')
                ]
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
                exclude: path.resolve(__dirname, 'src/components')
            },
            {
                test: /\.less$/,
                use: ['style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: 'v-[name]__[local]--[hash:base64:5]'
                        }
                    }
                }, 'less-loader'],
                include: [
                    path.resolve(__dirname, 'src/components')
                ]
            },
            {
                test: /\.(eot|woff2|woff|ttf|svg)$/,
                use: ['file-loader']
            },
            {
                test: /\.ts$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html'
        }),
        new CleanWebpackPlugin()
    ]
}