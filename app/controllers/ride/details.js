const moment = require('alloy/moment');

function setDuration() {
	const start = moment($.args.rentalStartTx.asset.gps.human);
	const duration = moment.utc(moment().diff(start));

	$.duration.text = 'Duration: ' + duration.format('HH:mm:ss');
}

const interval = setInterval(function() {
	setDuration();
}, 1000);

function onCloseHandler() {
	clearInterval(interval);
}

$.recipient.text = $.recipient.text + $.args.rentalStartTx.recipientId;
$.sessionId.text = $.sessionId.text + $.args.rentalStartTx.asset.sessionId;
$.rate.text = $.rate.text + $.args.rentalStartTx.asset.rate;
$.gps.text = $.gps.text + JSON.stringify($.args.rentalStartTx.asset.gps);
setDuration();