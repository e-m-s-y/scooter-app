function onItemClickHandler() {

}

$.listView.sections[0].items = [{
	title: {text: 'Passphrase'},
	subTitle: {text: 'TODO'},
	template: 'doubleWithClick'
}];

$.listView.sections[1].items = [{
	title: {text: 'App version'},
	subTitle: {text: Ti.App.version},
	template: 'double'
}];