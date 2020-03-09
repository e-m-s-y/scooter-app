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
		Ti.UI.createNavigationWindow({
			window: Alloy.createController('ride/details', listItem.payload).getView()
		}).open({modal: true});
	}
}

function reloadList() {
	const rides = Ti.App.Properties.getObject('rides', []);
	const templates = [];

	for(let ride of rides) {
		templates.push({
			title: {text: 'ID ' + ride.rentalStartTx.blockId},
			subTitle: {text: 'asset ' + JSON.stringify(ride.rentalStartTx.asset)},
			payload: ride,
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

function onRentalStartHandler(tx) {
	const rides = Ti.App.Properties.getObject('rides', []);

	rides.push({
		rentalStartTx: tx
	});

	Ti.App.Properties.setObject('rides', rides);
	reloadList();
}

function onRentalFinishHandler(tx) {
	const rides = Ti.App.Properties.getObject('rides', []);

	for (const i in rides) {
		if(rides.hasOwnProperty(i)) {
			let ride = rides[i];

			if(ride.rentalStartTx.asset.sessionId === tx.asset.sessionId) {
				ride.rentalFinishTx = tx;
				rides[i] = ride;
			}
		}
	}

	Ti.App.Properties.setObject('rides', rides);
	reloadList();
}

function onCloseHandler() {
	Alloy.Globals.socket.off('scooter.rental.start', onRentalStartHandler)
		.off('scooter.rental.finish', onRentalFinishHandler);
}

reloadList();
Alloy.Globals.socket.on('scooter.rental.start', onRentalStartHandler)
	.on('scooter.rental.finish', onRentalFinishHandler);