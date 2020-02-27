const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: [
		path.resolve(__dirname, './entry.js')
	],
	output: {
		path: path.resolve(__dirname, './dist/'),
		filename: 'bundle.js',
		// libraryTarget: 'commonjs2'
	},
	node: {
		crypto: true,
		fs: 'empty'
	},
	// resolve: {
	// 	alias: {
	// 		"crypto": path.resolve(__dirname, './crypto')
	// 	}
	// },
	module: {
		// rules: [{
		// 	test: /\.js$/,
		// 	loader: [
		// 		{
		// 			loader: 'babel-loader',
		// 			options: {
		// 				presets: [
		// 					'env'
		// 				],
		// 				plugins: [
		// 					['transform-runtime', {regenerator: true}],
		// 					['transform-object-rest-spread', {useBuiltIns: true}]
		// 				]
		// 			}
		// 		}
		// 	],
		// 	include: [
		// 		path.resolve(__dirname, 'node_modules/@arkecosystem')
		// 	]
		// }]
		// rules: [			{
		// 	test: /\.m?js$/,
		// 	exclude: /(node_modules|bower_components)/,
		// 	use: {
		// 		loader: 'babel-loader',
		// 		options: {
		// 			presets: ['@babel/preset-env']
		// 		}
		// 	}
		//
		// }]
	},
	plugins: [
		// new webpack.DefinePlugin({
		// 	'process.env.NODE_BACKEND': "'js'",
		// 	'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
		// }),
		// new webpack.DefinePlugin({
		// 	BigInt: "bigInt",
		// }),
		new webpack.NormalModuleReplacementPlugin(/node_modules\/bcrypto\/lib\/node\/bn\.js/, "../js/bn.js")
	]
};
