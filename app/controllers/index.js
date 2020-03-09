$.tabGroup.open();

if( ! Ti.App.Properties.getObject('passphrase', false)) {
	const dialog = Ti.UI.createAlertDialog({
		title: 'Please set your passphrase of your wallet. You can change this value in the settings tab.',
		style: Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT,
		buttonNames: ['OK']
	});

	dialog.addEventListener('click', function(event) {
		if(event.text.length) {
			Ti.App.Properties.setObject('passphrase', event.text);
		}

		promptNonce();
	});

	dialog.show();
} else {
	promptNonce();
}

function promptNonce() {
	if(Ti.App.Properties.getObject('nonce', -1) === -1) {
		const dialog = Ti.UI.createAlertDialog({
			title: 'Set your nonce. You can also change this value in the settings tab.',
			style: Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames: ['OK']
		});

		dialog.addEventListener('click', function(e) {
			if(e.text.length) {
				const nonce = parseInt(e.text);

				if( ! Number.isInteger(nonce)) {
					return alert('Invalid nonce, please try again.');
				}

				Ti.App.Properties.setObject('nonce', nonce);
			}
		});

		dialog.show();
	}
}

function broadcastTxHandler(event) {
	console.log('Creating XHR request...');

	const xhr = Ti.Network.createHTTPClient();

	xhr.onload = function() {
		const response = JSON.parse(this.responseText);

		if(response && response.data && response.data.accept.length) {
			let nonce = Ti.App.Properties.getObject('nonce');

			Ti.App.Properties.setObject('nonce', ++nonce);
			alert('Transaction has been accepted by Radians. It may take up to 8 seconds for the transaction to be forged.')
		} else if(response && response.errors && response.errors[event.struct.id]) {
			console.log(this.responseText);
			alert(response.errors[event.struct.id][0].message);
		} else {
			console.log(this.responseText);
			alert('Radians did not accept the tx.');
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