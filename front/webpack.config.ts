import * as path from 'node:path';

const __dirname = process.cwd();

export default {
    entry: './src/index.ts',
    mode: 'development',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: { extensions: ['.ts', '.tsx', '.js'] },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.build.json',
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
};
