const moment = require('alloy/moment');
const arkRatePerSecond = Number($.args.rentalStartTx.asset.rate / 1e8).toFixed(8);
const start = moment($.args.rentalStartTx.asset.gps.human);
let duration = moment.utc(moment().diff(start));
let costs = (duration / 1000) * Number($.args.rentalStartTx.asset.rate);

console.log($.args);

function updateValues() {
	const secondsElapsed = Math.round(moment.duration(moment().diff(start)).asSeconds());
	costs = secondsElapsed * Number($.args.rentalStartTx.asset.rate);
	duration = moment.utc(moment().diff(start));

	const normalizedArk = (secondsElapsed * arkRatePerSecond).toLocaleString(undefined, {
		maximumFractionDigits: 8,
	});

	$.duration.text = 'Duration: ' + duration.format('HH:mm:ss');
	$.costs.text = 'Costs: ' + normalizedArk + ' R';
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
		amount: costs,
		containsRefund: true,
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
	console.log('TODO');
}

const interval = setInterval(updateValues, 1000);

$.recipient.text = $.recipient.text + $.args.rentalStartTx.recipientId;
$.sessionId.text = $.sessionId.text + $.args.rentalStartTx.asset.sessionId;
$.gps.text = $.gps.text + JSON.stringify($.args.rentalStartTx.asset.gps);
$.rate.text = $.rate.text + arkRatePerSecond + ' R\nRate per minute ' + Number(arkRatePerSecond * 60).toFixed(8) + ' R';

Alloy.Globals.socket.on('scooter.rental.finish', onRentalFinishHandler);
updateValues();