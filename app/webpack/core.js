const IN_APP = typeof Ti !== 'undefined' && typeof Ti.API !== 'undefined' && typeof Ti.API.log === 'function';
const IS_CHROME = !!window.chrome || navigator.vendor === 'Google Inc.';

function log(message) {
	if(IN_APP && ! IS_CHROME) {
		Ti.API.log(message);
	} else {
		console.log(message);
	}
}

if( ! IS_CHROME) {
	BigInt = require('big-integer');
	log('Loaded BigInt dependency ✅');
}

ArkCrypto = require('@arkecosystem/crypto');
log('Loaded Ark Crypto dependency ✅');

const config = require("./bridgechain-config");

ArkCrypto.Managers.configManager.setConfig(config);
ArkCrypto.Managers.configManager.setHeight(1850);
log('Updated ConfigManager to match Radians config ✅');

TransactionBuilder = ArkCrypto.Transactions.BuilderFactory.transfer().instance();
ScooterRegistrationBuilder = require("@e-m-s-y/scooter-transactions/src/builders/scooter-registration-builder");
RentalStartBuilder = require("@e-m-s-y/scooter-transactions/src/builders/rental-start-builder");
RentalFinishBuilder = require("@e-m-s-y/scooter-transactions/src/builders/rental-finish-builder");
log('Initiated TransactionBuilders ✅');

ScooterRegistrationTransaction = require("@e-m-s-y/scooter-transactions/src/transactions/scooter-registration-transaction");
RentalStartTransaction = require("@e-m-s-y/scooter-transactions/src/transactions/rental-start-transaction");
RentalFinishTransaction = require("@e-m-s-y/scooter-transactions/src/transactions/rental-finish-transaction");
log('Initiated Custom transactions ✅');

ArkCrypto.Transactions.TransactionRegistry.registerTransactionType(ScooterRegistrationTransaction);
ArkCrypto.Transactions.TransactionRegistry.registerTransactionType(RentalStartTransaction);
ArkCrypto.Transactions.TransactionRegistry.registerTransactionType(RentalFinishTransaction);
log('Registered Custom transactions ✅');

window.onload = function() {
	log('WebView loaded and is ready for use!');

	if(IN_APP) {
		Ti.App.addEventListener('createTransferTx', createTransferTx);
		Ti.App.addEventListener('createScooterRegistrationTx', createScooterRegistrationTx);
		Ti.App.addEventListener('createRentalStartTx', createRentalStartTx);
		Ti.App.addEventListener('createRentalFinishTx', createRentalFinishTx);
	}
};

createTransferTx = function(data) {
	log('Creating transfer tx...');

	let tx = TransactionBuilder.amount(data.amount)
		.version(2)
		.recipientId(data.recipient)
		.vendorField(data.vendorField)
		.nonce(data.nonce)
		.sign(data.passphrase);

	let struct = tx.getStruct();

	struct.amount = struct.amount.toString();
	struct.nonce = struct.nonce.toString();
	struct.fee = struct.fee.toString();

	log('Transaction created ✅');

	if(IN_APP) {
		Ti.App.fireEvent('transferTxCreated', {
			struct: struct
		});
	} else {
		log('curl --request POST --url https://radians.nl/api/transactions ' +
			'--header "content-type:application/json" --data ' + JSON.stringify(JSON.stringify({transactions: [struct]})));
	}
};

createScooterRegistrationTx = function(data) {
	log('Creating scooter registration tx...');

	let tx = ScooterRegistrationBuilder.scooterId(data.id)
		.nonce(data.nonce)
		.sign(data.passphrase);

	let struct = tx.getStruct();

	struct.amount = struct.amount.toString();
	struct.nonce = struct.nonce.toString();
	struct.fee = struct.fee.toString();

	log('Transaction created ✅');

	if(IN_APP) {
		Ti.App.fireEvent('scooterRegistrationTxCreated', {
			struct: struct
		});
	} else {
		log('curl --request POST --url https://radians.nl/api/transactions ' +
			'--header "content-type:application/json" --data ' + JSON.stringify(JSON.stringify({transactions: [struct]})));
	}
};

createRentalStartTx = function(data) {
	log('Creating rental start tx...');

	let tx = RentalStartBuilder.sessionId(data.sessionId)
		.gps(data.gps.timestamp, data.gps.latitude, data.gps.longitude)
		.rate(data.rate)
		.amount(data.amount)
		.recipientId(data.recipientId)
		.nonce(data.nonce)
		.vendorField(data.vendorField)
		.sign(data.passphrase);

	let struct = tx.getStruct();

	struct.amount = struct.amount.toString();
	struct.nonce = struct.nonce.toString();
	struct.fee = struct.fee.toString();
	struct.asset.rate = struct.asset.rate.toString();

	log('Transaction created ✅');

	if(IN_APP) {
		Ti.App.fireEvent('rentalStartTxCreated', {
			struct: struct
		});
	} else {
		log('curl --request POST --url https://radians.nl/api/transactions ' +
			'--header "content-type:application/json" --data ' + JSON.stringify(JSON.stringify({transactions: [struct]})));
	}
};

createRentalFinishTx = function(data) {
	log('Creating rental finish tx...');

	let tx = RentalFinishBuilder.sessionId(data.sessionId)
		.gps(data.gps[0].timestamp, data.gps[0].latitude, data.gps[0].longitude)
		.gps(data.gps[1].timestamp, data.gps[1].latitude, data.gps[1].longitude)
		.amount(data.amount)
		.containsRefund(data.containsRefund)
		.recipientId(data.recipientId)
		.nonce(data.nonce)
		.vendorField(data.vendorField)
		.fee(data.fee)
		.sign(data.passphrase);

	let struct = tx.getStruct();

	struct.amount = struct.amount.toString();
	struct.nonce = struct.nonce.toString();
	struct.fee = struct.fee.toString();

	log('Transaction created ✅');

	if(IN_APP) {
		Ti.App.fireEvent('rentalFinishTxCreated', {
			struct: struct
		});
	} else {
		log('curl --request POST --url https://radians.nl/api/transactions ' +
			'--header "content-type:application/json" --data ' + JSON.stringify(JSON.stringify({transactions: [struct]})));
	}
};