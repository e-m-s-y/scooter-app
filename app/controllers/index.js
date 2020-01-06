function clearLog() {
	$.listView.sections[0].items = [];
}

const io = require('ti.socketio');

const socket = io.connect('https://radians.nl', {
	path: '/socket.io',
	timeout: 5000
});

socket.on('connect', () => {
	console.log('connected!');
});

socket.on('error', (error) => {
	console.error(error);
});

socket.on('block.applied', (block) => {
	let items = $.listView.sections[0].items;

	items.unshift({
		title: {text: 'ID ' + block.id},
		subTitle: {text: 'height ' + block.height},
		badgeText: {text: block.numberOfTransactions + ' tx(s)'},
		template: 'block'
	}, {
		template: 'separator'
	});

	$.listView.sections[0].items = items;
});

socket.on('disconnect', (reason) => {
	console.warn(reason);
	console.warn('disconnected');
});

$.index.open();