function onOpenHandler() {
	if( ! Ti.App.Properties.getObject('passphrase', false)) {
		$.promptPassphrase.show();
	}
}

function onPromptedPassphraseHandler(event) {
	const passphrase = OS_IOS ? event.text : $.passphraseInput.value;

	if(passphrase.length) {
		Ti.App.Properties.setObject('passphrase', passphrase);
	}

	if(Ti.App.Properties.getObject('nonce', false) === false) {
		$.promptNonce.show();
	}
}

function onPromptedNonceHandler(event) {
	let nonce = OS_IOS ? event.text : $.nonceInput.value;

	if( ! nonce.length) {
		return;
	}

	nonce = parseInt(nonce);

	if( ! Number.isInteger(nonce)) {
		return alert('Invalid nonce, please try again.');
	}

	Ti.App.Properties.setObject('nonce', nonce);
}

function broadcastTxHandler(event) {
	console.log('Creating XHR...');

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

	xhr.open('POST', 'https://api.radians.nl/api/transactions');
	xhr.setRequestHeader('content-type', 'application/json');

	const data = JSON.stringify({
		transactions: [event.struct]
	});

	console.log('Sending XHR with data %O', data);
	xhr.send(data);
}

Ti.App.addEventListener('transferTxCreated', broadcastTxHandler);
Ti.App.addEventListener('scooterRegistrationTxCreated', broadcastTxHandler);
Ti.App.addEventListener('rentalStartTxCreated', broadcastTxHandler);
Ti.App.addEventListener('rentalFinishTxCreated', broadcastTxHandler);

if(OS_ANDROID) {
	$.tabGroup.addEventListener('open', function() {
		$.tabGroup.activity.onCreateOptionsMenu = function(e) {
			if($.tabGroup.activeTab && $.tabGroup.activeTab.window && $.tabGroup.activeTab.window.activity.onCreateOptionsMenu) {
				$.tabGroup.activeTab.window.activity.onCreateOptionsMenu(e);
			}
		};
	});

	$.tabGroup.addEventListener('focus', function() {
		$.tabGroup.activity.invalidateOptionsMenu();
		$.tabGroup.title = $.tabGroup.activeTab.window.title;
	});
}

$.tabGroup.open();