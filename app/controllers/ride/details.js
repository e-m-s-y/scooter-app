const moment = require('alloy/moment');

function updateValues() {
	const start = moment($.args.rentalStartTx.asset.gps.human);
	const durationMs = moment.utc(moment().diff(start));
	const ratePerSecond = Number($.args.rentalStartTx.asset.rate / 1e8).toFixed(8);
	const normalizedArk = ((durationMs / 1000) * ratePerSecond).toLocaleString(undefined, {
		maximumFractionDigits: 2,
	});

	$.duration.text = 'Duration: ' + durationMs.format('HH:mm:ss');
	$.costs.text = 'Costs: ' + normalizedArk + ' R';
}

const interval = setInterval(updateValues, 1000);

function onCloseHandler() {
	clearInterval(interval);
}

$.recipient.text = $.recipient.text + $.args.rentalStartTx.recipientId;
$.sessionId.text = $.sessionId.text + $.args.rentalStartTx.asset.sessionId;
$.gps.text = $.gps.text + JSON.stringify($.args.rentalStartTx.asset.gps);

const arktoshiRatePerSecond = Number($.args.rentalStartTx.asset.rate / 1e8).toFixed(8);

$.rate.text = $.rate.text + arktoshiRatePerSecond + ' R\nRate per minute ' + Number(arktoshiRatePerSecond * 60).toFixed(8) + ' R';

updateValues();