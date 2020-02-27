const win = Ti.UI.createWindow({title: 'Hello'});
const webview = Ti.UI.createWebView({
	url: '/core/app.html'
});

Ti.App.addEventListener('transferTxCreated', function(event){
	console.log('Creating XHR request...');

	const xhr = Ti.Network.createHTTPClient();

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

webview.addEventListener('load', function() {
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