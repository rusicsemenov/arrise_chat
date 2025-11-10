import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common.ts';
import path from 'node:path';
import CopyPlugin from 'copy-webpack-plugin';

const prodConfig: Configuration = merge(common, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(process.cwd(), 'public'),
                    to: path.resolve(process.cwd(), 'dist'),
                    globOptions: {
                        ignore: ['**/index.html'],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),
    ],
});

export default prodConfig;
