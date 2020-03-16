const moment = require('alloy/moment');
let interval;
const arkRatePerSecond = Number($.args.rentalStartTx.asset.rate / 1e8).toFixed(8);
const start = moment($.args.rentalStartTx.asset.gps.human);
let end = $.args.rentalFinishTx ? moment($.args.rentalFinishTx.asset.gps[1].human) : moment();
let secondsElapsed = Math.round(moment.duration(end.diff(start)).asSeconds());
let duration = moment.utc(end.diff(start));
let costs = secondsElapsed * Number($.args.rentalStartTx.asset.rate);
let difference = costs - Number($.args.rentalStartTx.amount);

function updateValues() {
	end = $.args.rentalFinishTx ? end : moment();
	secondsElapsed = Math.round(moment.duration(end.diff(start)).asSeconds());
	costs = secondsElapsed * Number($.args.rentalStartTx.asset.rate);
	duration = moment.utc(end.diff(start));
	const normalizedArk = (secondsElapsed * arkRatePerSecond).toLocaleString(undefined, {
		maximumFractionDigits: 8,
	});

	$.duration.text = 'Duration: ' + duration.format('HH:mm:ss');
	difference = costs - Number($.args.rentalStartTx.amount);
	$.difference.text = (difference >= 0 ? 'Debit: R ' : 'Refund: R ') + Number(difference / 1e8).toFixed(8);
	$.costs.text = 'Total costs: R ' + normalizedArk;
}

function onCloseHandler() {
	clearInterval(interval);
	Alloy.Globals.socket.off('scooter.rental.finish', onRentalFinishHandler);
}

function finishRideHandler() {
	clearInterval(interval);
	Ti.App.fireEvent('createRentalFinishTx', {
		sessionId: $.args.rentalStartTx.asset.sessionId,
		nonce: Ti.App.Properties.getObject('nonce', 0),
		passphrase: Ti.App.Properties.getObject('passphrase', ''),
		recipientId: $.args.rentalStartTx.recipientId,
		amount: difference > 0 ? difference : 1,
		// TODO this is buggy, Radians does not accept value false
		containsRefund: difference < 0,
		gps: [{
			timestamp: (new Date($.args.rentalStartTx.asset.gps.human)).getTime(),
			latitude: $.args.rentalStartTx.asset.gps.latitude,
			longitude: $.args.rentalStartTx.asset.gps.longitude,
		}, {
			timestamp: Date.now(),
			latitude: getRandomGpsCoordinate().toString(),
			longitude: getRandomGpsCoordinate().toString(),
		}]
	});
}

function getRandomGpsCoordinate() {
	return (Math.random() * (-180 - 180) + 180).toFixed(6) * 1;
}

function onRentalFinishHandler(tx) {
	$.args.rentalFinishTx = tx;
	setValues();
}

function setValues() {
	$.recipient.text = 'Recipient: ' + $.args.rentalStartTx.recipientId;
	$.sessionId.text = 'Session ID: ' + $.args.rentalStartTx.asset.sessionId;
	$.start.text = 'Started at: ' + start.format('YYYY-MM-DD HH:mm:ss');
	$.end.text = 'Finished at: ';
	$.credit.text = 'Credit: R ' + Number($.args.rentalStartTx.amount / 1e8).toFixed(8);
	$.gpsStart.text = 'GPS start: ' + JSON.stringify($.args.rentalStartTx.asset.gps);
	$.gpsEnd.text = 'GPS finish: ';
	$.rate.text = 'Rate per second: R ' +  + arkRatePerSecond + '\nRate per minute: R ' + Number(arkRatePerSecond * 60).toFixed(8) + '\nRate per hour: R ' + Number(arkRatePerSecond * 3600).toFixed(8);
	$.openRentalStartTx.url = 'https://radians.nl/#/transaction/' + $.args.rentalStartTx.id;

	if( ! $.args.rentalFinishTx) {
		$.finishRideButton.enabled = true;
	} else {
		$.finishRideButton.enabled = false;
		$.end.text = 'Finished at: ' + end.format('YYYY-MM-DD HH:mm:ss');
		$.gpsEnd.text = 'GPS finish: ' + JSON.stringify($.args.rentalFinishTx.asset.gps[1]);
		$.openRentalFinishTx.url = 'https://radians.nl/#/transaction/' + $.args.rentalFinishTx.id;
		$.openRentalFinishTx.enabled = true;
	}
}

function onOpenExplorerHandler(event) {
	Ti.Platform.openURL(event.source.url);
}

if( ! $.args.rentalFinishTx) {
	interval = setInterval(updateValues, 1000);
}

Alloy.Globals.socket.on('scooter.rental.finish', onRentalFinishHandler);
setValues();
updateValues();