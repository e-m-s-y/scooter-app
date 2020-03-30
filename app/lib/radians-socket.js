const io = require('ti.socketio');
let socket = undefined;
let reconnectionAttempts = 0;
const maxReconnectionAttempts = 5;
let isConnected = false;
let eventBuffer = [];
let onMaxReconnectionsReachedHandler = function() {
	// TODO toon alert?
};

function emit(event, data) {
	if( ! isConnected) {
		eventBuffer.push({
			event: event,
			data: data
		});

		return console.warn('Stored event plus data in event buffer, will emit when connected...');
	}

	console.log(`Emitting to '${event}' %O`, data);

	socket.emit(event, data);

	return this;
}

module.exports = {
	connect: function(token, endpoint) {
		if(socket !== undefined) {
			console.log('Reconnecting to socket...');
			socket.open();

			return this;
		}

		token = token || Alloy.Globals.session.getTokens().whatsaap;
		endpoint = endpoint || Alloy.Globals.WHATSAAP_ENDPOINT;

		if( ! token || ! endpoint) {
			console.warn('Connection attempt block due lack of token / endpoint.');

			return this;
		}

		const query = 'query=' + Ti.Utils.base64encode(`whatsaap_token=${token}`);

		console.log(`Connecting to ${endpoint} with query ${query}...`);


		if( ! socket) {
			if(OS_IOS) {
				socket = io.connect(`${endpoint}?${query}`, {
					forceWebsockets: true,
					transports: ['websocket'],
					reconnectionAttempts: maxReconnectionAttempts
				});
			} else if(OS_ANDROID) {
				socket = io.connect(`${endpoint}?${query}`, {
					transports: ['websocket'],
					reconnectionAttempts: maxReconnectionAttempts
				});
			} else {
				return console.error('WhatsAAP is not supported on this OS!');
			}
		} else {
			return console.warn('WhatsaapManager has no support for multiple socket connections, ignoring this connection attempt.');
		}

		socket.on('connect', function() {
			isConnected = true;

			console.log('Connected to WhatsAAP!');

			if(eventBuffer.length) {
				console.log('Emitting bufferend events...');

				for(const i in eventBuffer) {
					if(eventBuffer.hasOwnProperty(i)) {
						emit(eventBuffer[i].event, eventBuffer[i].data);
					}
				}

				eventBuffer = [];
			}
		});
		socket.on('reconnect_attempt', function(data) {
			++reconnectionAttempts;

			console.log(`[${reconnectionAttempts}/${maxReconnectionAttempts}] reconnecting...`);

			if(reconnectionAttempts === maxReconnectionAttempts) {
				console.error('Max reconnection attempts reached!');

				if(typeof onMaxReconnectionsReachedHandler === 'function') {
					onMaxReconnectionsReachedHandler();
				}
			}
		});
		socket.on('error', function(...error) {
			console.error(error);
		});
		socket.on('disconnect', function(reason) {
			isConnected = false;
			socket = undefined;

			console.log(`Disconnected from WhatsAAP due to ${reason}!`);
		});

		return this;
	},
	isConnected: function() {
		return isConnected;
	},
	setOnMaxReconnectionsReachedHandler: function(callback) {
		onMaxReconnectionsReachedHandler = callback;
	},
	on: function(event, callback) {
		if(socket === undefined) {
			console.warn(`Socket instance is not initialized, ignoring on '${event}' handler...`);

			return this;
		}

		console.log(`Added event handler on '${event}'`);
		socket.on(event, callback);

		return this;
	},
	off: function(event, callback) {
		if(socket === undefined) {
			console.warn(`Socket instance is not initialized, ignoring off '${event}' handler...`);

			return this;
		}

		if(typeof callback === 'function') {
			console.log(`Removed event handler on '${event}'`);
			socket.off(event, callback);
		} else if(event) {
			console.log(`Removed all event handlers on '${event}'`);
			socket.off(event);
		} else {
			console.log(`Removed all event handlers`);
			socket.off();
		}

		return this;
	},
	emit: emit,
	joinRooms: function(rooms) {
		if(socket === undefined) {
			console.warn(`Socket instance is not initialized, ignoring joinRooms call...`);

			return this;
		}

		rooms = rooms || [];

		if( ! rooms.length) {
			console.warn('Rooms are empty, ignoring joining rooms.');

			return this;
		}

		console.log(`Joining rooms %O`, rooms);

		this.emit('join rooms', Ti.Utils.base64encode(rooms.join()).toString());

		return this;
	},
	leaveRooms: function(rooms) {
		if(socket === undefined) {
			console.warn(`Socket instance is not initialized, ignoring leaveRooms call...`);

			return this;
		}

		rooms = rooms || [];

		if( ! rooms.length) {
			console.warn('Rooms are empty, ignoring leaving rooms.');

			return this;
		}

		this.emit('leave rooms', Ti.Utils.base64encode(rooms.join()).toString());

		return this;
	},
	disconnect: function() {
		// TODO alle event handlers moeten ook worden gesloopt.
		// TODO de hele socket moet gewoon opbokke.
		// TODO controleren hoe de app reageert wanneer dit gebeurt en vervolgens weer opnieuw connect. Worden
		// de event listeners dan dubbel uitgevoerd?
		this.off();
		socket.disconnect();
		console.log('Disconnected from WhatsAAP.');

		return this;
	}
};