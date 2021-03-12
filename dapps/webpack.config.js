const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const path = require('path');
const sveltePreprocess = require('svelte-preprocess');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const sveltePath = path.resolve('node_modules', 'svelte')

module.exports = {
  mode,
  devtool: prod ? false: 'source-map',
	entry: {
		bundle: ['./src/main.ts']
	},
	resolve: {
		alias: {
      svelte: sveltePath,
      src: path.resolve( __dirname, 'src'),
      libs: path.resolve( __dirname, 'libs'),
			// dapps: path.resolve( __dirname, 'dapps'),
      // libs: path.resolve( __dirname, 'dapps')
        },
		extensions: ['.mjs', '.tsx', '.ts', '.js', '.svelte', '.svx'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: 'bundle.js',
		chunkFilename: 'bundle.[id].js',
		libraryTarget: 'umd',
		umdNamedDefine: true,
	},
	module: {
		rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: [
                  /node_modules/,
                ],
            },
			{
				test: /\.css$/,
				use: [
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: "css-loader",
						options: {
							importLoaders: 1,
						},
					},
					"postcss-loader",
				]
			},
			{
				test: /.(svelte|html|svx)$/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true,
						preprocess: sveltePreprocess({
							
						}),
					}
				}
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: 'bundle.[name].css',
		}),
	],
	optimization: {
		minimize: prod,
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin()
		],
	},
  devServer: {
    watchContentBase: true,
    compress: true,
    contentBase: [path.join(__dirname, 'public')],
    port: 5000,
    open: true,
    https: false,
  }
};
