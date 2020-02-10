const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: [
		path.resolve(__dirname, './ark/crypto.js')
	],
	output: {
		path: path.resolve(__dirname, '../lib/ark'),
		libraryTarget: 'commonjs2'
	},
	node: {
		crypto: true,
		fs: 'empty'
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: [
				{
					loader: 'babel-loader',
					options: {
						presets: [
							'env'
						],
						plugins: [
							['transform-runtime', {regenerator: true}],
							['transform-object-rest-spread', {useBuiltIns: true}]
						]
					}
				}
			],
			include: [
				path.resolve(__dirname, 'node_modules/@arkecosystem')
			]
		}]
	},
	plugins: [
		new webpack.NormalModuleReplacementPlugin(/node_modules\/bcrypto\/lib\/node\/bn\.js/, "../js/bn.js")
	]
};
