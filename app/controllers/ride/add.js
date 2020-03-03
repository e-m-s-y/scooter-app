if(OS_IOS) {
	// https://github.com/appcelerator-modules/ti.barcode/blob/master/ios/example/app.js
	// https://www.qr-code-generator.com/
	const Barcode = require('ti.barcode');

	Barcode.allowRotation = true;
	Barcode.displayedMessage = 'Test message';
	Barcode.allowMenu = false;
	Barcode.allowInstructions = false;
	Barcode.useLED = true;

	Barcode.addEventListener('error', function(e) {
		alert('An Error occured: ' + e);
	});

	Barcode.addEventListener('cancel', function(e) {
		console.log('Cancel');
	});

	Barcode.addEventListener('success', function(e) {
		const result = {
			contentType: parseContentType(e.contentType),
			result: parseResult(e),
			format: e.format
		};

		alert(result);
		console.log(result);
	});

	function parseContentType(contentType) {
		switch(contentType) {
			case Barcode.URL:
				return 'URL';
			case Barcode.SMS:
				return 'SMS';
			case Barcode.TELEPHONE:
				return 'TELEPHONE';
			case Barcode.TEXT:
				return 'TEXT';
			case Barcode.CALENDAR:
				return 'CALENDAR';
			case Barcode.GEOLOCATION:
				return 'GEOLOCATION';
			case Barcode.EMAIL:
				return 'EMAIL';
			case Barcode.CONTACT:
				return 'CONTACT';
			case Barcode.BOOKMARK:
				return 'BOOKMARK';
			case Barcode.WIFI:
				return 'WIFI';
			default:
				return 'UNKNOWN';
		}
	}

	function parseResult(event) {
		let msg = '';

		switch(event.contentType) {
			case Barcode.URL:
				msg = event.result;
				break;
			case Barcode.SMS:
				msg = JSON.stringify(event.data);
				break;
			case Barcode.TELEPHONE:
				msg = event.data.phonenumber;
				break;
			case Barcode.TEXT:
				msg = event.result;
				break;
			case Barcode.CALENDAR:
				msg = JSON.stringify(event.data);
				break;
			case Barcode.GEOLOCATION:
				msg = JSON.stringify(event.data);
				break;
			case Barcode.EMAIL:
				msg = event.data;
				break;
			case Barcode.CONTACT:
				msg = JSON.stringify(event.data);
				break;
			case Barcode.BOOKMARK:
				msg = JSON.stringify(event.data);
				break;
			case Barcode.WIFI:
				return JSON.stringify(event.data);
			default:
				msg = 'unknown content type';
				break;
		}
		return msg;
	}
}

function onWebViewLoadedHandler() {
	$.webView.visible = false;
	$.webView.height = 0;
}

function onStartGalleryScanHandler() {
	Ti.Media.openPhotoGallery({
		success: function(event) {
			Barcode.parse({
				image: event.media
			});
		}
	});
}

const sessionTemplate = {
	nonce: 0 // TODO add a way to override this in the settings.
};

const session = Ti.App.Properties.getObject('session', sessionTemplate);
let nonce = session.nonce;
const passphrase = 'jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap';
const recipient = 'TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf';
const sessionId = 'hello';

function broadcastTxHandler(event) {
	console.log('Creating XHR request...');

	const xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {
		console.log(this.responseText);

		session.nonce = ++nonce;

		Ti.App.Properties.setObject('session', session);
	};

	xhr.open('POST', 'https://radians.nl/api/transactions');
	xhr.setRequestHeader('content-type', 'application/json');

	const data = JSON.stringify({
		transactions: [event.struct]
	});

	console.log('Sending XHR request with data %O', data);
	xhr.send(data);
}

Ti.App.addEventListener('transferTxCreated', broadcastTxHandler);
Ti.App.addEventListener('scooterRegistrationTxCreated', broadcastTxHandler);
Ti.App.addEventListener('rentalStartTxCreated', broadcastTxHandler);
Ti.App.addEventListener('rentalFinishTxCreated', broadcastTxHandler);

// $.webView.addEventListener('load', function() {
// 	Ti.App.fireEvent('createTransferTx', {
// 		nonce: nonce,
// 		passphrase: passphrase,
// 		recipient: 'TEBFiv6emzoY6i4znYGrFeWiKyTRimhNWe',
// 		vendorField: 'Hello from the app!',
// 		amount: 11
// 	});
// });

// $.webView.addEventListener('load', function() {
// 	Ti.App.fireEvent('createScooterRegistrationTx', {
// 		id: '0123456789',
// 		nonce: nonce,
// 		passphrase: passphrase,
// 		recipient: recipient,
// 		vendorField: 'Hello from the app!',
// 		amount: 33
// 	});
// });

// $.webView.addEventListener('load', function() {
// 	Ti.App.fireEvent('createRentalStartTx', {
// 		sessionId: sessionId,
// 		nonce: nonce,
// 		passphrase: passphrase,
// 		recipientId: recipient,
// 		vendorField: 'Hello from the app!',
// 		amount: 55,
// 		rate: '5',
// 		gps: {
// 			timestamp: Date.now(),
// 			latitude: '-180.222222',
// 			longitude: '1.111111',
// 		}
// 	});
// });

// $.webView.addEventListener('load', function() {
// 	Ti.App.fireEvent('createRentalFinishTx', {
// 		sessionId: sessionId,
// 		nonce: nonce,
// 		passphrase: passphrase,
// 		recipientId: recipient,
// 		vendorField: 'Hello from the app!',
// 		amount: 333,
// 		containsRefund: true,
// 		gps: [{
// 			timestamp: Date.now(),
// 			latitude: '10.111111',
// 			longitude: '-20.222222',
// 		}, {
// 			timestamp: Date.now() + 90 * 1000,
// 			latitude: '15.111111',
// 			longitude: '-25.222222',
// 		}]
// 	});
// });

function uriToObject(uri) {
	let pairs = uri.split('?');
	const object = {
		recipientId: pairs[0].split(':')[1]
	};
	pairs = pairs[1].split('&');

	for(let i in pairs) {
		if(pairs.hasOwnProperty(i)) {
			const split = pairs[i].split('=');

			object[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
		}
	}

	return object;
}

const uri = 'rad:TRXA2NUACckkYwWnS9JRkATQA453ukAcD1?hash=0b6614343a95b6dd957b9d118250c589dfd221fe4769d6c83caa93ca8e946138&rate=370000000';

console.log(uriToObject(uri));