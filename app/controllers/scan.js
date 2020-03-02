let isLoaded = false;

function onWebViewLoadedHandler() {
	$.webView.visible = false;
	$.webView.height = 0;

	isLoaded = true;

	$.window.add(Ti.UI.createLabel({text: 'hello', color: 'red'}));
}

// Ti.App.addEventListener('transferTxCreated', function(event){
// 	console.log('Creating XHR request...');
//
// 	const xhr = Ti.Network.createHTTPClient();
//
// 	xhr.onload = function() {
// 		console.log(this.responseText);
// 	};
//
// 	xhr.open('POST', 'https://radians.nl/api/transactions');
// 	xhr.setRequestHeader('content-type','application/json');
//
// 	const data = JSON.stringify({
// 		transactions: [event.struct]
// 	});
//
// 	console.log('Sending XHR request with data %O', data);
// 	xhr.send(data);
// });

// webview.addEventListener('load', function() {
// 	Ti.App.fireEvent('createTransferTx', {
// 		nonce: '15',
// 		passphrase: 'jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap',
// 		recipient: 'TEBFiv6emzoY6i4znYGrFeWiKyTRimhNWe',
// 		vendorField: 'Hello from the app!',
// 		amount: 11
// 	});
// });