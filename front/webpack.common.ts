import * as path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import type { Configuration } from 'webpack';

const __dirname = process.cwd();

export const config: Configuration = {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'assets/[name].[contenthash].js',
        clean: true,
        publicPath: '/',
    },
    resolve: { extensions: ['.ts', '.tsx', '.js'] },
    plugins: [new HtmlWebpackPlugin({ template: 'public/index.html' })],
};

export default config;
