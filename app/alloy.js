if(OS_IOS) {
	const colors = require('/semantic.colors.json');

	Alloy.CFG.styles = {};

	for (let [ color ] of Object.entries(colors)) {
		Alloy.CFG.styles[color] = Ti.UI.fetchSemanticColor(color)
	}
}

const io = require('ti.socketio');
Alloy.Globals.socket = io.connect('https://radians.nl', {
	path: '/socket.io',
	timeout: 5000
});

Alloy.Globals.socket.on('connect', () => {
	console.log('connected!');
});

Alloy.Globals.socket.on('error', (error) => {
	console.error(error);
});

Alloy.Globals.socket.on('disconnect', (reason) => {
	console.warn(reason);
	console.warn('disconnected');
});