if(OS_IOS) {
	const colors = require('/semantic.colors.json');

	Alloy.CFG.styles = {};

	for (let [ color ] of Object.entries(colors)) {
		Alloy.CFG.styles[color] = Ti.UI.fetchSemanticColor(color)
	}
}

Alloy.Globals.socket = require('radians-socket');

Alloy.Globals.socket.connect('https://radians.nl');