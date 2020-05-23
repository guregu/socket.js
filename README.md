## socket.js

**socket.js** is an old-fashioned ES5 WebSocket wrapper for the un-modern web. It's a retro throwback to the good old days when we just shoved things into the global window object, back before Javascript had to be compiled and packaged and churned. It gives you a little more than a plain WebSocket but also a little less.

#### Features
* Automatically reconnects
* Queues messages when disconnected to be sent when (re)connected
* Splits incoming messages into channels

#### Nonfeatures
* No package.json
* No comments
* No tests
* No bullshit

### Usage
```js
// This socket will connect to `wss://example.com/sock/` or `ws://example.com/sock/`
// depending on whether the current page is secure.
// The second parameter is an optional "hello" message
// It will be sent every time the WebSocket connects or reconnects.
var socket = new Socket("example.com/sock/", {cmd: "greetings"});

// Outgoing messages are automatically JSON encoded.
// You can send messages before you connect. They will be queued up and sent later.
socket.send({web: 1.5});

// Incoming messages are not JSON encoded because JSON encoding bloats HTML.
// They look something like this:
//    chat:<p>hello world</p>
// That is, all incoming messages must be prefixed with a channel name and a colon.
// There can only be one handler per channel.
// If you call handle on the same channel twice it will be overwritten.
socket.handle("chat", handleChatMsg);

// Handler callbacks take just one paramter: the contents of the message as a string.
// You can do whatever you'd like with it: append some HTML, decode some JSON... 
function handleChatMsg(msg) {
	var chatbox = document.getElementById("chatbox");
	// Sending HTML over websockets is surprisingly powerful.
	// If you're already doing server side rendering, you can reuse that logic for your websockets.
	// This can be a lot easier than reinventing the wheel with client-side rendering.
	// Of course, when you're dealing with user input always make sure to sanitize your HTML.
	// Be careful.
	chatbox.insertAdjacentHTML("beforeend", msg);
}

// Start the connection. If disconnected it will automatically reconnect with backoff and jitter.
socket.connect();
```

### Why?
I'm releasing this because I want to encourage people to make things even if they're not modern or shiny. 
I want to show that old-fashioned Javascript can be fun and easy to use.

One day long ago, I realized that setting up the Javascript build environment for side projects was sapping my motivation. I'd spend too much energy configuring the build system of the month (Browserify, Grunt, Gulp, Webpack...) and give up after I got it working. Keeping up with all the breaking changes and new paradigms for frameworks was  exhausting. So I tried just shoving some plain vanilla Javascript into the bottom of the page—it worked great! This project is just a place to store a little bit of code I've been copying and pasting over the years.

Vanilla JS has greatly improved since the days we needed jQuery to do anything useful. Give it a shot. Or don't. Work with whatever makes you happy. Just remember, sometimes worse is better.