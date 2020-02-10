const Crypto = require("ark/main");
const config = require("bridgechain-config");

console.log(Crypto);

const TransactionBuilder = Crypto.Transactions.BuilderFactory.transfer().instance();
const nonce = '1';
const passphrase = 'jar width fee ostrich fantasy vehicle thank doctor teach family bottom trap';
const transactions = [];

Crypto.Managers.configManager.setConfig(config);
Crypto.Managers.configManager.setHeight(1850);

let tx = TransactionBuilder.amount(1)
	.version(2)
	.recipientId('TEBFiv6emzoY6i4znYGrFeWiKyTRimhNWe')
	.vendorField('sent from app')
	.nonce(nonce);

console.log(tx);

transactions.push(tx.sign(passphrase));

let payload = {
	transactions: []
};

for(const transaction of transactions) {
	payload.transactions.push(transaction.getStruct());

	let serialized = transaction.build().serialized.toString('hex');
	let deserialized = Crypto.Transactions.Deserializer.deserialize(serialized);

	console.log(`\nTransaction is verified: ${transaction.verify()}`);
	console.log(`\nSerialized: ${serialized}`);
	console.log('\nDeserialized: %O', deserialized);
}

function clearLog() {
	$.listView.sections[0].items = [];
}

$.index.open();