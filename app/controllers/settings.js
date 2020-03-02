function onItemClickHandler() {

}

$.listView.sections[0].items = [{
	title: {text: 'Passphrase'},
	subTitle: {text: 'TODO'},
	template: 'doubleWithClick'
}, {
	title: {text: 'Nonce'},
	subTitle: {text: Ti.App.Properties.getObject('session', {}).nonce},
	template: 'double'
}];

$.listView.sections[1].items = [{
	title: {text: 'App version'},
	subTitle: {text: Ti.App.version},
	template: 'double'
}];