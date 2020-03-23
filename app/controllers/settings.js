function onPromptedPassphraseHandler(event) {
	const passphrase = OS_IOS && event.text.length ? event.text : $.passphraseInput.value;

	if( ! passphrase.length) {
		return;
	}

	Ti.App.Properties.setObject('passphrase', passphrase);
	reloadList();

	if(OS_ANDROID) {
		$.passphraseInput.value = '';
	}
}

function onPromptedNonceHandler(event) {
	let nonce = OS_IOS && event.text.length ? event.text : $.nonceInput.value;

	if( ! nonce.length) {
		return;
	}

	nonce = parseInt(nonce);

	if( ! Number.isInteger(nonce)) {
		return alert('Invalid nonce, please try again.');
	}

	Ti.App.Properties.setObject('nonce', nonce);
	reloadList();

	if(OS_ANDROID) {
		$.nonceInput.value = '';
	}
}

function loadWalletSection() {
	$.listView.sections[0].items = [{
		title: {text: 'Passphrase'},
		subTitle: {text: Ti.App.Properties.getObject('passphrase', '')},
		template: 'doubleWithClick',
		payload: {
			callback: function() {
				$.promptPassphrase.show();
			}
		}
	}, {
		title: {text: 'Nonce'},
		subTitle: {text: Ti.App.Properties.getObject('nonce', 0)},
		template: 'doubleWithClick',
		payload: {
			callback: function() {
				$.promptNonce.show();
			}
		}
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