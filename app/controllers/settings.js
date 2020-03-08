function promptPassphrase() {
	if(OS_IOS) {
		const dialog = Ti.UI.createAlertDialog({
			title: 'Set new passphrase',
			style: Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames: ['OK']
		});

		dialog.addEventListener('click', function(e) {
			if( ! e.text.length) {
				return;
			}

			Ti.App.Properties.setObject('passphrase', e.text);
			reloadList();
		});

		dialog.show();
	} else {
		// TODO show alertdialog with androidView https://wiki.appcelerator.org/display/guides2/AlertDialog
	}
}

function promptNonce() {
	if(OS_IOS) {
		const dialog = Ti.UI.createAlertDialog({
			title: 'Set new nonce',
			style: Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT,
			buttonNames: ['OK']
		});

		dialog.addEventListener('click', function(e) {
			if( ! e.text.length) {
				return;
			}

			const nonce = parseInt(e.text);

			if( ! Number.isInteger(nonce)) {
				return alert('Invalid nonce, please try again.');
			}

			Ti.App.Properties.setObject('nonce', nonce);
			reloadList();
		});

		dialog.show();
	} else {
		// TODO show alertdialog with androidView https://wiki.appcelerator.org/display/guides2/AlertDialog
	}
}

function loadWalletSection() {
	$.listView.sections[0].items = [{
		title: {text: 'Passphrase'},
		subTitle: {text: Ti.App.Properties.getObject('passphrase', '')},
		template: 'doubleWithClick',
		payload: {callback: promptPassphrase}
	}, {
		title: {text: 'Nonce'},
		subTitle: {text: Ti.App.Properties.getObject('nonce', 0)},
		template: 'doubleWithClick',
		payload: {callback: promptNonce}
	}];
}

function clearWalletData() {
	Ti.App.Properties.removeProperty('nonce');
	Ti.App.Properties.removeProperty('passphrase');
	reloadList();
	alert('All session data has been removed.');
}

function clearRidesData() {
	Ti.App.Properties.removeProperty('rides');
	alert('The rides cache has been cleared.');
}

function loadGeneralSection() {
	$.listView.sections[1].items = [{
		title: {text: 'App version'},
		subTitle: {text: Ti.App.version},
		template: 'double'
	}, {
		title: {text: 'Reset wallet data'},
		subTitle: {text: 'This will clear your passphrase and nonce.'},
		template: 'doubleWithClick',
		payload: {callback: clearWalletData}
	}, {
		title: {text: 'Clear cache'},
		subTitle: {text: 'This will clear all cached rides.'},
		template: 'doubleWithClick',
		payload: {callback: clearRidesData}
	}];
}

function reloadList() {
	loadWalletSection();
	loadGeneralSection();
}

function onItemClickHandler(event) {
	const listItem = $.listView.sections[event.sectionIndex].getItemAt(event.itemIndex);

	if(listItem.payload && listItem.payload.callback) {
		listItem.payload.callback();
	}
}