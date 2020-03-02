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

socket.on('scooter.rental.start', (block) => {
	const section = $.listView.sections[0];
	let items = section.items;

	items.unshift({
		title: {text: 'ID ' + block.blockId},
		subTitle: {text: 'asset ' + JSON.stringify(block.asset)},
		payload: block.asset,
		template: 'doubleWithClick'
	});

	section.items = items;

	console.log('Added scooter rental start tx');
});

socket.on('scooter.rental.finish', (block) => {
	const section = $.listView.sections[1];
	let items = section.items;

	items.unshift({
		title: {text: 'ID ' + block.blockId},
		subTitle: {text: 'asset ' + JSON.stringify(block.asset)},
		payload: block.asset,
		template: 'doubleWithClick'
	});

	section.items = items;

	console.log('Added scooter rental finish tx');
});

socket.on('block.applied', (block) => {
	const section = $.listView.sections[2];
	let items = section.items;

	items.unshift({
		title: {text: 'ID ' + block.id},
		subTitle: {text: 'height ' + block.height},
		badgeText: {text: block.numberOfTransactions + ' tx(s)'},
		template: 'block'
	});

	section.items = items;

	console.log('Added new block');
});

socket.on('disconnect', (reason) => {
	console.warn(reason);
	console.warn('disconnected');
});

function onItemClickHandler(e) {
	const listItem = $.listView.sections[e.sectionIndex].getItemAt(e.itemIndex);

	if (listItem.payload) {
		alert(listItem.payload);
	}
}