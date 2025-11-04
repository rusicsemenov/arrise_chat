import type { Configuration } from 'webpack';
import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { merge } from 'webpack-merge';
import common from './webpack.common.ts';

const prodConfig: Configuration & { devServer?: DevServerConfiguration } = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        static: './public',
        port: 3000,
        hot: true,
        historyApiFallback: true,
    },
});

export default prodConfig;
