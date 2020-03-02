// https://github.com/appcelerator-modules/ti.barcode/blob/master/ios/example/app.js
// https://www.qr-code-generator.com/
const Barcode = require('ti.barcode');

Barcode.allowRotation = true;
Barcode.displayedMessage = 'Test message';
Barcode.allowMenu = false;
Barcode.allowInstructions = false;
Barcode.useLED = true;

function onWebViewLoadedHandler() {
	$.webView.visible = false;
	$.webView.height = 0;
}

function onStartGalleryScanHandler() {
	Ti.Media.openPhotoGallery({
		success: function(evt) {
			Barcode.parse({
				image: evt.media
			});
		}
	});
}

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

// window.add(scrollView);

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