console.log('test');

const win = Ti.UI.createWindow({title: 'Ark Scooters', layout: 'vertical'});
const webview = Ti.UI.createWebView({
	url: '/core/app.html',
	// visible: false,
	// height: 0,
});

webview.addEventListener('load', function() {
	webview.visible = false;
	webview.height = 0;

	console.log('app reddy');
});

win.add(webview);
win.add(Ti.UI.createLabel({text: 'hello', color: 'red'}));

let navwin = Ti.UI.createNavigationWindow({window: win});
navwin.open();



// const win = Ti.UI.createWindow({title: 'Hello'});

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



// win.add(webview);
//
// let navwin = Ti.UI.createNavigationWindow({window: win});
// navwin.open();
//
// navwin.visible = false;