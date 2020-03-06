console.log($.args);

$.recipient.text = $.recipient.text + $.args.recipientId;
$.sessionId.text = $.sessionId.text + $.args.asset.sessionId;
$.rate.text = $.rate.text + $.args.asset.rate;
$.gps.text = $.gps.text + JSON.stringify($.args.asset.gps);