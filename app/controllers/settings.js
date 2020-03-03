const sessionTemplate = {
	nonce: 0
};

function onItemClickHandler(event) {
	const listItem = $.listView.sections[event.sectionIndex].getItemAt(event.itemIndex);

	if(listItem.payload && listItem.payload.callback) {
		listItem.payload.callback();
	}
}

$.listView.sections[0].items = [{
	title: {text: 'Passphrase'},
	subTitle: {text: 'TODO'},
	template: 'doubleWithClick'
}, {
	title: {text: 'Nonce'},
	subTitle: {text: Ti.App.Properties.getObject('session', sessionTemplate).nonce},
	template: 'doubleWithClick',
	payload: {
		callback: function() {
			if(OS_IOS) {
				const dialog = Ti.UI.createAlertDialog({
					title: 'Set new nonce',
					style: Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT,
					buttonNames: ['OK']
				});

				dialog.addEventListener('click', function(e) {
					const input = e.text;

					if( ! input.length) {
						return;
					}

					const session = Ti.App.Properties.getObject('session', sessionTemplate);
					const nonce = parseInt(e.text);

					if( ! Number.isInteger(nonce)) {
						return alert('Invalid nonce, please try again.');
					}

					session.nonce = nonce;
					const items = $.listView.sections[0].items;
					items[1].subTitle.text = nonce;
					$.listView.sections[0].items = items;

					Ti.App.Properties.setObject('session', session);
				});

				dialog.show();


			} else {
				// TODO show alertdialog with androidView https://wiki.appcelerator.org/display/guides2/AlertDialog
			}
		}
	}
}];

$.listView.sections[1].items = [{
	title: {text: 'App version'},
	subTitle: {text: Ti.App.version},
	template: 'double'
}];