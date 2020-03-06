const recipient = 'TGGUtM6KPdWn7LSpNcWj1y5ngGa8xJqxHf';
const sessionId = '0b6614343a95b6dd957b9d118250c589dfd221fe4769d6c83caa93ca8e946138';

function onSendScooterRegistrationTxHandler() {
	Ti.App.fireEvent('createScooterRegistrationTx', {
		id: '0123456789',
		nonce: Ti.App.Properties.getObject('nonce', 0),
		passphrase: Ti.App.Properties.getObject('passphrase', ''),
		recipient: recipient,
		vendorField: 'Hello from the app!',
		amount: 33
	});
}

function onSendRentalStartTxHandler() {
	Ti.App.fireEvent('createRentalStartTx', {
		sessionId: sessionId,
		nonce: Ti.App.Properties.getObject('nonce', 0),
		passphrase: Ti.App.Properties.getObject('passphrase', ''),
		recipientId: recipient,
		vendorField: 'Hello from the app!',
		amount: 55,
		rate: '5',
		gps: {
			timestamp: Date.now(),
			latitude: '-180.222222',
			longitude: '1.111111',
		}
	});
}

function onSendRentalFinishTxHandler() {
	Ti.App.fireEvent('createRentalFinishTx', {
		sessionId: sessionId,
		nonce: Ti.App.Properties.getObject('nonce', 0),
		passphrase: Ti.App.Properties.getObject('passphrase', ''),
		recipientId: recipient,
		vendorField: 'Hello from the app!',
		amount: 333,
		containsRefund: true,
		gps: [{
			timestamp: Date.now(),
			latitude: '10.111111',
			longitude: '-20.222222',
		}, {
			timestamp: Date.now() + 90 * 1000,
			latitude: '15.111111',
			longitude: '-25.222222',
		}]
	});
}

function onSendTransferTxHandler() {
	Ti.App.fireEvent('createTransferTx', {
		nonce: Ti.App.Properties.getObject('nonce', 0),
		passphrase: Ti.App.Properties.getObject('passphrase', ''),
		recipient: 'TEBFiv6emzoY6i4znYGrFeWiKyTRimhNWe',
		vendorField: 'Hello from the app!',
		amount: 11
	});
}