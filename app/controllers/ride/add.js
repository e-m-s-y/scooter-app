// https://github.com/appcelerator-modules/ti.barcode/blob/master/ios/example/app.js
// https://www.qr-code-generator.com/
const Barcode = require('ti.barcode');

Barcode.allowRotation = false;
Barcode.displayedMessage = '';
Barcode.allowMenu = false;
Barcode.allowInstructions = false;
Barcode.useLED = false;

Barcode.addEventListener('error', function(e) {
	alert('An Error occured: ' + e);
});

Barcode.addEventListener('cancel', function(e) {
	console.log('Cancel');
});

Barcode.addEventListener('success', function(e) {
	Barcode.cancel();

	const contents = {
		type: parseContentType(e.contentType),
		result: parseResult(e),
		format: e.format
	};

	console.log(contents);

	Ti.App.fireEvent('createRentalStartTx', {
		sessionId: contents.result.hash,
		nonce: Ti.App.Properties.getObject('session', sessionTemplate).nonce,
		passphrase: passphrase,
		recipientId: contents.result.recipientId,
		amount: '1',
		rate: contents.result.rate,
		gps: {
			timestamp: Date.now(),
			latitude: contents.result.lat,
			longitude: contents.result.lon
		}
	});
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
			msg = uriToObject(event.result);
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

function hasCameraPermission(callback) {
	if(OS_ANDROID) {
		if(Ti.Media.hasCameraPermissions() && callback) {
			callback(true);
		} else {
			Ti.Media.requestCameraPermissions(function(e) {
				if(callback) {
					callback(e.success);
				}
			});
		}
	} else if(OS_IOS && callback) {
		// NSCameraUsageDescription in tiapp.xml is required.
		callback(true);
	}
}

function onStartCameraScanHandler() {
	hasCameraPermission(function(hasPermission) {
		if(hasPermission) {
			Barcode.capture({
				animate: true,
				overlay: $.cameraOverlay,
				showCancel: true,
				showRectangle: true,
				keepOpen: true
			});
		} else {
			alert('No permission to use the camera. If you want to scan codes please give the app permissions in the settings of your phone.');
		}
	});
}

const sessionTemplate = {
	nonce: 0
};
const passphrase = 'jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap';
const recipient = 'TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf';
const sessionId = '0b6614343a95b6dd957b9d118250c589dfd221fe4769d6c83caa93ca8e946138';

function broadcastTxHandler(event) {
	console.log('Creating XHR request...');

	const xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {
		const response = JSON.parse(this.responseText);

		if(response.data.accept.length) {
			const session = Ti.App.Properties.getObject('session', sessionTemplate);

			session.nonce = ++session.nonce;

			Ti.App.Properties.setObject('session', session);

			alert('Rental start tx has been sent to Radians, check event tab for results.')
		} else {
			console.log(this.responseText);
			alert('Tx not accepted, see logs.');
		}
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
// 		nonce: Ti.App.Properties.getObject('session', sessionTemplate).nonce,
// 		passphrase: passphrase,
// 		recipient: 'TEBFiv6emzoY6i4znYGrFeWiKyTRimhNWe',
// 		vendorField: 'Hello from the app!',
// 		amount: 11
// 	});
// });

// $.webView.addEventListener('load', function() {
// 	Ti.App.fireEvent('createScooterRegistrationTx', {
// 		id: '0123456789',
// 		nonce: Ti.App.Properties.getObject('session', sessionTemplate).nonce,
// 		passphrase: passphrase,
// 		recipient: recipient,
// 		vendorField: 'Hello from the app!',
// 		amount: 33
// 	});
// });

// $.webView.addEventListener('load', function() {
// 	Ti.App.fireEvent('createRentalStartTx', {
// 		sessionId: sessionId,
// 		nonce: Ti.App.Properties.getObject('session', sessionTemplate).nonce,
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
// 		nonce: Ti.App.Properties.getObject('session', sessionTemplate).nonce,
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


console.log('nonce ' + Ti.App.Properties.getObject('session', sessionTemplate).nonce);
const uri = `rad:${recipient}?hash=${sessionId}&rate=370000000&lat=-180.222222&lon=1.111111`;
console.log(uri);
console.log(uriToObject(uri));