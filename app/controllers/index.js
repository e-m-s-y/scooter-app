// 0, npm install,
// 1, app/webpack/node_modules/bcrypto/lib/bn.js aanpassen
// 2, BigInt requiren in crypto.js
// 3, remove browser property from package.json in bcrypto package
// 3, remove browser property from package.json in randombytes package + remove browser.jw in randombytes package

// const Crypto = require("ark/main");
// const config = require("bridgechain-config");
//
// console.log(Crypto);
//
// const TransactionBuilder = Crypto.Transactions.BuilderFactory.transfer().instance();
// const nonce = '1';
// const passphrase = 'jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap';
// const transactions = [];
//
// Crypto.Managers.configManager.setConfig(config);
// Crypto.Managers.configManager.setHeight(1850);
//
// let tx = TransactionBuilder.amount(1)
// 	.version(2)
// 	.recipientId('TEBFiv6emzoY6i4znYGrFeWiKyTRimhNWe')
// 	.vendorField('sent from app')
// 	.nonce(nonce);
//
// console.log(tx);
//
// transactions.push(tx.sign(passphrase));

// let payload = {
// 	transactions: []
// };
//
// for(const transaction of transactions) {
// 	payload.transactions.push(transaction.getStruct());
//
// 	let serialized = transaction.build().serialized.toString('hex');
// 	let deserialized = Crypto.Transactions.Deserializer.deserialize(serialized);
//
// 	console.log(`\nTransaction is verified: ${transaction.verify()}`);
// 	console.log(`\nSerialized: ${serialized}`);
// 	console.log('\nDeserialized: %O', deserialized);
// }

// function clearLog() {
// 	$.listView.sections[0].items = [];
// }

// $.index.add(Ti.UI.createWebView({
// 	html: '<h1><script src="../lib/ark/main.js"></script></h1>',
// }));

// Ti.App.addEventListener('buttonclick', function() {
// 	alert('boe');
// });


// $.navigationWindow.open();
// Ti.App.addEventListener('newTxSigned', function(event)
// {
// 	console.log(event);
// });

var win = Ti.UI.createWindow({title: 'Hello'});
var webview = Ti.UI.createWebView({
	url: '/core/app.html'
});

Ti.App.addEventListener('transferTxCreated', function(event){
	console.log('Creating XHR request...');

	var xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {
		console.log(this.responseText);
	};

	xhr.open('POST', 'https://radians.nl/api/transactions');
	xhr.setRequestHeader('content-type','application/json');

	const data = JSON.stringify({
		transactions: [event.struct]
	});

	console.log('Sending XHR request with data %O', data);
	xhr.send(data);
});

webview.addEventListener('load', function(e) {
	Ti.App.fireEvent('createTransferTx', {
		nonce: '15',
		passphrase: 'jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap',
		recipient: 'TEBFiv6emzoY6i4znYGrFeWiKyTRimhNWe',
		vendorField: 'Hello from the app!',
		amount: 11
	});
});

win.add(webview);

Ti.UI.createNavigationWindow({window: win}).open();



