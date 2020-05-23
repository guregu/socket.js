window.Socket = function(url, hello) {
	this.socket = null;
	this.url = url;
	this.msgq = [];
	this.hello = hello;
	this.handlers = {};
	this.reconnector = null;
	this.reconnectDelay = 1000;
	this.reconnectN = 0;

	this.onconnect = null;
	this.onreconnect = null;
	this.onbeforeunload = null;
	this.onfail = null;

	this.send = function(msg) {
		msg = JSON.stringify(msg);
		if (!this.socket || this.socket.readyState != WebSocket.OPEN) {
			this.msgq.push(msg);
		} else {
			this.socket.send(msg);
		}
	}

	this.connect = function(reconnect) {
		if (this.reconnector) { clearTimeout(this.reconnector); }

		var proto = "ws://";
		if (window.location.protocol === "https:") {
				proto = "wss://";
		}
		try {
			this.socket = new WebSocket(proto + this.url);
		} catch(ex) {
			console.log(ex);
			if (this.onfail) {
				this.onfail();
			}
		}
		this.socket.onopen = function() {
			console.log("yee haw");
			if (reconnect && this.onreconnect) {
				this.onreconnect();
			}
			if (this.hello) {
				this.send(this.hello);
			}
			this.msgq.forEach(function(msg) {
				this.socket.send(msg);
			}.bind(this));
			this.msgq = [];
			this.reconnectDelay = 1000;
			this.reconnectN = 0;

			if (this.onconnect) {
				this.onconnect();
			}
		}.bind(this);

		this.socket.onclose = function(e) {
			console.log("closed");
			this.reconnector = setTimeout(function() {
				this.reconnectN++;
				this.connect(true);
				this.reconnectDelay = this.reconnectDelay * 1.25;
			}.bind(this), this.reconnectDelay + (Math.random()*1000));
		}.bind(this);

		this.socket.onmessage = function(e) {
			var data = e.data.toString();
			var idx = data.indexOf(':');
			if (idx == -1) {
				console.log("msg without channel", data);
				return;
			}
			var chan = data.slice(0, idx);
			var msg = data.slice(idx + 1);
			if (this.handlers[chan]) {
				this.handlers[chan](msg);
			} else {
				console.log("unhandled msg", chan, msg);
			}
		}.bind(this);

		this.socket.onerror = function(err) {
			console.log("socket error", err);
		};
	}

	this.handle = function(channel, fn) {
		this.handlers[channel] = fn;
	}

	window.addEventListener("beforeunload", function(event) {
		this.socket.onclose = null;
		this.socket.close(1000, "bye!");
		if (this.onbeforeunload) {
			this.onbeforeunload();
		}
	}.bind(this));
}