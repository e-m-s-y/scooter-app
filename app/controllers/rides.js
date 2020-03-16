const moment = require('alloy/moment');
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
		window: Alloy.createController('ride/scan').getView()
	}).open({modal: true});
}

function onItemClickHandler(e) {
	const listItem = $.listView.sections[e.sectionIndex].getItemAt(e.itemIndex);

	if(listItem.payload) {
		Ti.UI.createNavigationWindow({
			window: Alloy.createController('ride/details', listItem.payload).getView()
		}).open({modal: true});
	}
}

function reloadList() {
	const rides = Ti.App.Properties.getObject('rides', []);
	const activeRideTemplates = [];
	const finishedRideTemplates = [];

	for(let ride of rides) {
		const start = moment(ride.rentalStartTx.asset.gps.human);
		const end = ride.rentalFinishTx ? moment(ride.rentalFinishTx.asset.gps[1].human) : moment();
		const secondsElapsed = Math.round(moment.duration(end.diff(start)).asSeconds());
		const arkRatePerSecond = Number(ride.rentalStartTx.asset.rate / 1e8).toFixed(8);
		const normalizedArk = (secondsElapsed * arkRatePerSecond).toLocaleString(undefined, {
			maximumFractionDigits: 8
		});
		let subTitle = 'Rental duration: ' + moment.utc(end.diff(start)).format('HH:mm:ss');
		subTitle += ' - costs: R ' + normalizedArk;

		const template = {
			title: {text: 'Session ID: ' + ride.rentalStartTx.asset.sessionId},
			subTitle: {text: subTitle},
			payload: ride,
			template: 'doubleWithClick'
		};

		ride.rentalFinishTx ? finishedRideTemplates.push(template) : activeRideTemplates.push(template);
	}

	$.listView.sections[0].items = activeRideTemplates;
	$.listView.sections[1].items = finishedRideTemplates;
}

function onRentalStartHandler(tx) {
	const rides = Ti.App.Properties.getObject('rides', []);

	rides.unshift({
		rentalStartTx: tx
	});

	Ti.App.Properties.setObject('rides', rides);
	reloadList();
}

function onRentalFinishHandler(tx) {
	const rides = Ti.App.Properties.getObject('rides', []);

	for(const i in rides) {
		if(rides.hasOwnProperty(i)) {
			let ride = rides[i];

			if(ride.rentalStartTx.asset.sessionId === tx.asset.sessionId) {
				ride.rentalFinishTx = tx;
				rides[i] = ride;

				break;
			}
		}
	}

	Ti.App.Properties.setObject('rides', rides);
	reloadList();
}

function onCloseHandler() {
	Alloy.Globals.socket.off('scooter.rental.start', onRentalStartHandler)
		.off('scooter.rental.finish', onRentalFinishHandler);
	clearInterval(interval);
}

reloadList();

const interval = setInterval(reloadList, 1000);
Alloy.Globals.socket.on('scooter.rental.start', onRentalStartHandler)
	.on('scooter.rental.finish', onRentalFinishHandler);