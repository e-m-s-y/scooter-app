const moment = require('alloy/moment');
let interval;
const arkRatePerSecond = Number($.args.rentalStartTx.asset.rate / 1e8).toFixed(8);
const start = moment($.args.rentalStartTx.asset.gps.human);
const maxDurationInSeconds = $.args.rentalStartTx.amount / $.args.rentalStartTx.asset.rate;
let end = $.args.rentalFinishTx ? moment($.args.rentalFinishTx.asset.gps[1].human) : moment(start).add(maxDurationInSeconds, 'seconds');
let secondsElapsed = Math.round(moment.duration(moment().diff(start)).asSeconds());
let reachedMaxDuration = $.args.rentalFinishTx ? true : secondsElapsed >= maxDurationInSeconds;
let secondsLeft = reachedMaxDuration ? 0 : maxDurationInSeconds - secondsElapsed;
let duration = reachedMaxDuration ? moment.utc(end.diff(start)) : moment.utc(moment().diff(start));
let costs = (reachedMaxDuration ? maxDurationInSeconds : secondsElapsed) * Number($.args.rentalStartTx.asset.rate);

function updateValues() {
	secondsElapsed = Math.round(moment.duration(moment().diff(start)).asSeconds());
	reachedMaxDuration = $.args.rentalFinishTx ? true : secondsElapsed >= maxDurationInSeconds;
	costs = (reachedMaxDuration ? maxDurationInSeconds : secondsElapsed) * Number($.args.rentalStartTx.asset.rate);
	end = $.args.rentalFinishTx ? moment($.args.rentalFinishTx.asset.gps[1].human) : moment(start).add(maxDurationInSeconds, 'seconds');
	duration = reachedMaxDuration ? moment.utc(end.diff(start)) : moment.utc(moment().diff(start));
	secondsLeft = reachedMaxDuration ? 0 : maxDurationInSeconds - secondsElapsed;

	const normalizedArk = ((reachedMaxDuration ? maxDurationInSeconds : secondsElapsed) * arkRatePerSecond).toLocaleString(undefined, {
		maximumFractionDigits: 8,
	});

	const timeLeft = moment.duration(secondsLeft, 'seconds');

	$.duration.text = 'Duration: ' + duration.format('HH:mm:ss');
	$.timeLeft.text = 'Time left: ' + moment(timeLeft.asMilliseconds()).utc().format('HH:mm:ss');
	$.costs.text = 'Total costs: R ' + normalizedArk;

	// Clear the timer when the max duration is reached. The scooter will automatically finish the ride when this happens.
	if(reachedMaxDuration || $.args.rentalFinishTx) {
		clearInterval(interval);
	}
}

function onCloseHandler() {
	clearInterval(interval);
	Alloy.Globals.socket.off('scooter.rental.finish', onRentalFinishHandler);
}

function onRentalFinishHandler(tx) {
	$.args.rentalFinishTx = tx;
	setValues();
	clearInterval(interval);
}

function setValues() {
	$.recipient.text = 'Recipient: ' + $.args.rentalStartTx.recipientId;
	$.sessionId.text = 'Session ID: ' + $.args.rentalStartTx.asset.sessionId;
	$.start.text = 'Started at: ' + start.format('YYYY-MM-DD HH:mm:ss');
	$.end.text = 'Finished at: ';
	$.credit.text = 'Credit: R ' + Number($.args.rentalStartTx.amount / 1e8).toFixed(8);
	$.isFinishedByScooter.text = 'Scooter has finished ride: No';
	$.gpsStart.text = 'GPS start: ' + JSON.stringify($.args.rentalStartTx.asset.gps);
	$.gpsEnd.text = 'GPS finish: ';
	$.rate.text = 'Rate per second: R ' +  + arkRatePerSecond + '\nRate per minute: R ' + Number(arkRatePerSecond * 60).toFixed(8) + '\nRate per hour: R ' + Number(arkRatePerSecond * 3600).toFixed(8);
	$.openRentalStartTx.url = 'https://radians.nl/#/transaction/' + $.args.rentalStartTx.id;

	if($.args.rentalFinishTx) {
		$.isFinishedByScooter.text = 'Scooter has finished ride: Yes';
		$.end.text = 'Finished at: ' + end.format('YYYY-MM-DD HH:mm:ss');
		$.gpsEnd.text = 'GPS finish: ' + JSON.stringify($.args.rentalFinishTx.asset.gps[1]);
		$.openRentalFinishTx.url = 'https://radians.nl/#/transaction/' + $.args.rentalFinishTx.id;
		$.openRentalFinishTx.enabled = true;
	}
}

function onOpenExplorerHandler(event) {
	Ti.Platform.openURL(event.source.url);
}

function onAndroidBackHandler() {
	$.window.close();
}

if( ! $.args.rentalFinishTx) {
	interval = setInterval(updateValues, 1000);
}

Alloy.Globals.socket.on('scooter.rental.finish', onRentalFinishHandler);
setValues();
updateValues();