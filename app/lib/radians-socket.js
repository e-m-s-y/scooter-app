const io = require('ti.socketio');
let socket = undefined;
let reconnectionAttempts = 0;
const maxReconnectionAttempts = 5;
let isConnected = false;
let eventBuffer = [];

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
	connect: function(endpoint) {
		if(socket !== undefined) {
			console.log('Reconnecting to socket...');
			socket.open();

			return this;
		}


		if( ! endpoint) {
			console.warn('Connection attempt blocked due lack of endpoint.');

			return this;
		}

		console.log(`Connecting to ${endpoint}...`);

		if( ! socket) {
			if(OS_IOS) {
				socket = io.connect(endpoint, {
					forceWebsockets: true,
					transports: ['websocket'],
					reconnectionAttempts: maxReconnectionAttempts
				});
			} else if(OS_ANDROID) {
				socket = io.connect(endpoint, {
					transports: ['websocket'],
					reconnectionAttempts: maxReconnectionAttempts
				});
			} else {
				return console.error('Socket.io is not supported on this OS!');
			}
		} else {
			return console.warn('There is no support for multiple socket connections, ignoring this connection attempt.');
		}

		socket.on('connect', function() {
			isConnected = true;

			console.log('Connected to socket server!');

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
			}
		});
		socket.on('error', function(...error) {
			console.error(error);
		});
		socket.on('disconnect', function(reason) {
			isConnected = false;
			socket = undefined;

			console.log(`Disconnected from socket server due to ${reason}!`);
		});

		return this;
	},
	isConnected: function() {
		return isConnected;
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
	disconnect: function() {
		this.off();
		socket.disconnect();
		console.log('Disconnected from socket server.');

		return this;
	}
};