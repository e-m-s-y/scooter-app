let isReady = false;

function onWebViewLoadedHandler() {
	$.webView.visible = false;
	$.webView.height = 0;
	isReady = true;
}

function onAddButtonClickHandler() {
	if( ! isReady) {
		return alert('The app is still loading, try again later...');
	}

	Ti.UI.createNavigationWindow({
		window: Alloy.createController('ride/new').getView()
	}).open({modal: true});
}

function onItemClickHandler(e) {
	const listItem = $.listView.sections[e.sectionIndex].getItemAt(e.itemIndex);

	if (listItem.payload) {
		alert(listItem.payload);
	}
}

function reloadList() {
	const rentalStartBlocks = Ti.App.Properties.getObject('rentalStartBlocks', []);
	const templates = [];

	for(let block of rentalStartBlocks) {
		console.log(block);

		templates.push({
			title: {text: 'ID ' + block.blockId},
			subTitle: {text: 'asset ' + JSON.stringify(block.asset)},
			payload: block.asset,
			template: 'doubleWithClick'
		});
	}

	if( ! templates.length) {
		templates.push({
			title: {text: 'There are no rides yet.'},
			template: 'notice'
		});
	}

	$.listView.sections[0].items = templates;
}

function onRentalStartHandler(block) {
	const blocks = Ti.App.Properties.getObject('rentalStartBlocks', []);

	blocks.push(block);

	Ti.App.Properties.setObject('rentalStartBlocks', blocks);
	reloadList();
}


// Alloy.Globals.socket.on('scooter.rental.finish', (block) => {
// 	console.log(block);
// });

Alloy.Globals.socket.on('scooter.rental.start', onRentalStartHandler);
reloadList();

function onCloseHandler() {
	Alloy.Globals.socket.off('scooter.rental.start', onRentalStartHandler);
	// Alloy.Globals.socket.off('scooter.rental.finish', onRentalFinishHandler);
}