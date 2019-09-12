var conf = require('config');
var fs = require("fs");
var server = require("http").createServer();
var vidstream = require('child_process').spawn('vidstream.sh');

server.on("request", (request, response) => {
	try{
		switch (request.url){
			case '/':
				//HTMLファイルをストリームで読み込む
				var stream = fs.createReadStream("index.html");
				response.writeHead(200, {"Content-Type":"text/html"});
				stream.pipe(response);
				break;
			case '/screan':
				var stream = fs.createReadStream("live/stream.m3u8");
				response.writeHead(200, {"Content-Type":"application/x-mpegURL"});
				stream.pipe(response);
				break;
		}
	}catch(e){
		response.writeHead(404, {'Content-Type': 'text/plain'});
		response.write('404 Not Found\n');
	}
});
server.listen(conf.http_port);

// Socketを取得
var io = require("socket.io").listen(server);

var hid = require('./hid.js');
var keybd_data = new Uint8Array(8);
var mouse_data = new Uint8Array(4);
var lastKey = "";

// 接続した時に実行される
io.on("connection", (socket) => {

	// 既存のコネクションを切断(排他接続)
	for (id in io.sockets.connected){
		if (id !== socket.id){
			io.sockets.connected[id].disconnect();
		}
	}

	// メッセージ受信時のイベント
	socket.on('keydown', (code) => {
		if (lastKey === code){
			return;
		}
		lastKey = code;
		switch (code){
			case 'ControlLeft':
				keybd_data[0] |= hid.key_mask.leftControl;
				break;
			case 'ShiftLeft':
				keybd_data[0] |= hid.key_mask.leftShift;
				break;
			case 'AltLeft':
				keybd_data[0] |= hid.key_mask.leftAlt;
				break;
			case 'OSLeft':
			case 'MetaLeft':
				keybd_data[0] |= hid.key_mask.leftGUI;
				break;
			case 'ControlRight':
				keybd_data[0] |= hid.key_mask.rightControl;
				break;
			case 'ShiftRight':
				keybd_data[0] |= hid.key_mask.rightShift;
				break;
			case 'AltRight':
				keybd_data[0] |= hid.key_mask.rightAlt;
				break;
			case 'OSRight':
			case 'MetaRight':
				keybd_data[0] |= hid.key_mask.rightGUI;
				break;
			default:
				if (keybd_data[keybd_data.length - 1] === 0x00){
					for (let i = 2; i < keybd_data.length; i++){
						if (keybd_data[i] === 0x00){
							keybd_data[i] = hid.keymap[code];
							break;
						}else if (keybd_data[i] === hid.keymap[code]){
							break;
						}
					}
				}else{
					for (let i = 2; i < keybd_data.length - 1; i++){
						keybd_data[i] = keybd_data[i + 1];
					}
					keybd_data[keybd_data.length - 1] = hid.keymap[code];
				}
				break;
		}
		fs.writeFile(conf.dev_keyboard, keybd_data, (err) => {
			if (err){
				console.log("Error keydown: " + keybd_data + "\n" + err);
			}
		});
	});
	socket.on('keyup', (code) => {
		if (lastKey === code){
			lastKey = "";
		}
		switch (code){
			case 'ControlLeft':
				keybd_data[0] &= ~hid.key_mask.leftControl;
				break;
			case 'ShiftLeft':
				keybd_data[0] &= ~hid.key_mask.leftShift;
				break;
			case 'AltLeft':
				keybd_data[0] &= ~hid.key_mask.leftAlt;
				break;
			case 'OSLeft':
			case 'MetaLeft':
				keybd_data[0] &= ~hid.key_mask.leftGUI;
				break;
			case 'ControlRight':
				keybd_data[0] &= ~hid.key_mask.rightControl;
				break;
			case 'ShiftRight':
				keybd_data[0] &= ~hid.key_mask.rightShift;
				break;
			case 'AltRight':
				keybd_data[0] &= ~hid.key_mask.rightAlt;
				break;
			case 'OSRight':
			case 'MetaRight':
				keybd_data[0] &= ~hid.key_mask.rightGUI;
				break;
			default:
				for (let i = 2; i < keybd_data.length; i++){
					if (keybd_data[i] === hid.keymap[code]){
						for (let j = i; j < keybd_data.length - 1; j++){
							keybd_data[j] = keybd_data[j + 1];
						}
						keybd_data[keybd_data.length - 1] = 0x00;
						break;
					}
				}
				break;
		}
		fs.writeFile(conf.dev_keyboard, keybd_data, (err) => {
			if (err){
				console.log("Error keyup: " + keybd_data + "\n" + err);
			}
		});
	});
	socket.on('mousemove', (X, Y) => {
		mouse_data[1] = X;
		mouse_data[2] = Y;
		mouse_data[3] = 0x00;
		fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
			if (err){
				console.log("Error mousemove: " + mouse_data + "\n" + err);
			}
		});
	});
	socket.on('mousedown', (button) => {
		switch (button){
			case 0:
				mouse_data[0] |= hid.btn_mask.leftButton;
				break;
			case 1:
				mouse_data[0] |= hid.btn_mask.rightButton;
				break;
			case 2:
				mouse_data[0] |= hid.btn_mask.middleButton;
				break;
		}
		mouse_data[1] = 0x00;
		mouse_data[2] = 0x00;
		mouse_data[3] = 0x00;
		fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
			if (err){
				console.log("Error mousedown: " + mouse_data + "\n" + err);
			}
		});
	});
	socket.on('mouseup', (button) => {
		switch (button){
			case 0:
				mouse_data[0] &= ~hid.btn_mask.leftButton;
				break;
			case 1:
				mouse_data[0] &= ~hid.btn_mask.rightButton;
				break;
			case 2:
				mouse_data[0] &= ~hid.btn_mask.middleButton;
				break;
		}
		mouse_data[1] = 0x00;
		mouse_data[2] = 0x00;
		mouse_data[3] = 0x00;
		fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
			if (err){
				console.log("Error mouseup: " + mouse_data + "\n" + err);
			}
		});
	});
	socket.on('wheel', (X, Y) => {
		mouse_data[1] = 0x00;
		mouse_data[2] = 0x00;
		mouse_data[3] = Y;
		fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
			if (err){
				console.log("Error wheel: " + mouse_data + "\n" + err);
			}
		});
	});
});