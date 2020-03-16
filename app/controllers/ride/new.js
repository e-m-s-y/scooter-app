const arkRatePerSecond = Number($.args.result.rate / 1e8).toFixed(8);
let durationInSeconds = parseInt($.duration.text) * 60;
let costs = durationInSeconds * Number($.args.result.rate);

function setCosts() {
	durationInSeconds = parseInt($.duration.text) * 60;
	costs = durationInSeconds * Number($.args.result.rate);
	const normalizedArk = (durationInSeconds * arkRatePerSecond).toLocaleString(undefined, {
		maximumFractionDigits: 8,
	});
	$.costs.text = 'Costs: R ' + normalizedArk;
}

function updateValues(e) {
	$.duration.text = Math.round(e.value);

	setCosts();
}

$.rate.text = 'Rate per second: R ' +  + arkRatePerSecond + '\nRate per minute: R ' + Number(arkRatePerSecond * 60).toFixed(8) + '\nRate per hour: R ' + Number(arkRatePerSecond * 3600).toFixed(8);
updateValues({ value: $.slider.value});
setCosts();

function onMakePaymentHandler() {
	$.makePaymentButton.enabled = false;

	Ti.App.fireEvent('createRentalStartTx', {
		sessionId: $.args.result.hash,
		nonce: Ti.App.Properties.getObject('nonce', 0),
		passphrase: Ti.App.Properties.getObject('passphrase', ''),
		recipientId: $.args.result.recipientId,
		amount: costs,
		rate: $.args.result.rate,
		gps: {
			timestamp: Date.now(),
			latitude: $.args.result.lat,
			longitude: $.args.result.lon
		}
	});

	$.window.navigationWindow.close();
}