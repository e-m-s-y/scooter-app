const moment = require('alloy/moment');

function updateValues() {
	const start = moment($.args.rentalStartTx.asset.gps.human);
	const durationMs = moment.utc(moment().diff(start));
	const ratePerSecond = parseFloat($.args.rentalStartTx.asset.rate / 100000000).toFixed(8);

	$.duration.text = 'Duration: ' + durationMs.format('HH:mm:ss');
	$.costs.text = 'Costs: ' + (durationMs / 1000) * ratePerSecond + ' R';
}

const interval = setInterval(updateValues, 1000);

function onCloseHandler() {
	clearInterval(interval);
}

$.recipient.text = $.recipient.text + $.args.rentalStartTx.recipientId;
$.sessionId.text = $.sessionId.text + $.args.rentalStartTx.asset.sessionId;
$.rate.text = $.rate.text + $.args.rentalStartTx.asset.rate;
$.gps.text = $.gps.text + JSON.stringify($.args.rentalStartTx.asset.gps);
updateValues();