import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common.ts';

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
    ],
});

export default prodConfig;
