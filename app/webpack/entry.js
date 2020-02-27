const IN_APP = typeof Ti !== 'undefined' && typeof Ti.API !== 'undefined' && typeof Ti.API.log === 'function';

function log(message) {
	if(IN_APP) {
		Ti.API.log(message);
	} else {
		console.log(message);
	}
}

BigInt = require('big-integer');
log('Loaded BigInt dependency ✅');
ArkCrypto = require('@arkecosystem/crypto');
log('Loaded Ark Crypto dependency ✅');
const config = require("./bridgechain-config");
ArkCrypto.Managers.configManager.setConfig(config);
ArkCrypto.Managers.configManager.setHeight(1850);
log('Updated ConfigManager to match Radians config ✅');
TransactionBuilder = ArkCrypto.Transactions.BuilderFactory.transfer().instance();
log('Initiated TransactionBuilder instance ✅');

window.onload = function() {
	log('WebView loaded and is ready for use!');

	if(IN_APP) {
		Ti.App.addEventListener('createTransferTx', createTransferTx);
	}
};

createTransferTx = function(data) {
	log('Creating transaction...');

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