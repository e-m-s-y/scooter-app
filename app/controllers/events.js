Alloy.Globals.socket.on('scooter.rental.start', (block) => {
	const section = $.listView.sections[0];
	let items = section.items;

	items.unshift({
		title: {text: 'ID ' + block.blockId},
		subTitle: {text: 'asset ' + JSON.stringify(block.asset)},
		payload: block.asset,
		template: 'doubleWithClick'
	});

	section.items = items;
});

Alloy.Globals.socket.on('scooter.rental.finish', (block) => {
	const section = $.listView.sections[1];
	let items = section.items;

	items.unshift({
		title: {text: 'ID ' + block.blockId},
		subTitle: {text: 'asset ' + JSON.stringify(block.asset)},
		payload: block.asset,
		template: 'doubleWithClick'
	});

	section.items = items;
});

Alloy.Globals.socket.on('block.applied', (block) => {
	const section = $.listView.sections[2];
	let items = section.items;

	items.unshift({
		title: {text: 'ID ' + block.id},
		subTitle: {text: 'height ' + block.height},
		badgeText: {text: block.numberOfTransactions + ' tx(s)'},
		template: 'block'
	});

	section.items = items;
});

function onItemClickHandler(e) {
	const listItem = $.listView.sections[e.sectionIndex].getItemAt(e.itemIndex);

	if (listItem.payload) {
		alert(listItem.payload);
	}
}