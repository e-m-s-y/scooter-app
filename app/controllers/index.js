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
	if( ! Ti.App.Properties.getObject('nonce', false)) {
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