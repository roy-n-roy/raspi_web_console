const conf = require('config');
const fs = require("fs");
const server = require("http").createServer();
let momo_process;
const path = require('path');

// httpサーバで返却する静的コンテンツ
const contents = {
	'/': 'index.html',
	'/index.html': 'index.html',
	'/js/ayame.min.js': 'node_modules/@open-ayame/ayame-web-sdk/dist/ayame.min.js',
	'/js/socket.io.slim.js': 'node_modules/socket.io-client/dist/socket.io.slim.js' };
const mime = {
	'.html': 'text/html',
	'.css': 'test/css',
	'.js': 'text/javascript' };

// http Request
server.on("request", (request, response) => {
	if (contents[request.url]){
		response.writeHead(200, {"Content-Type": mime[path.extname(contents[request.url])]});
		fs.createReadStream(contents[request.url]).pipe(response);
	}
});
	}
});
server.listen(conf.http_port);

// Socketを取得
var io = require("socket.io").listen(server);
var hid = require('./hid.js');

// heartbieat設定
io.set('heartbeat interval', 5000);
io.set('heartbeat timeout', 15000);


// 接続した時に実行される
io.on("connection", (socket) => {

	// 既存のコネクションを切断(排他接続)
	for (id in io.sockets.connected){
		if (id !== socket.id){
			io.sockets.connected[id].disconnect();
		}
	}

	socket.on('keydown',	keybdEvent)
		  .on('keyup',		keybdEvent)
		  .on('mousemove',	moveEvent)
		  .on('mousedown',	clickEvent)
		  .on('mouseup',	clickEvent)
		  .on('wheel',		wheelEvent)
		  .on('touchmove',	moveEvent);
	
	momo_process = require('child_process').spawn('momo', ['--no-audio', '--video-device', conf.dev_video, '--force-i420', '--resolution', 'FHD', '--fixed-resolution', '--port', conf.websocket_port, 'test']);

	socket.on('disconnect', () =>{
		momo_process.kill('SIGTERM');
	});

	momo_process.on('close', (code, signal) => {
		console.error('momo process closed. exet code: ' + code);
	});
});

/** Keyboard Input Reportデータ: 8 Bytes */
/* データ構造(6ロールオーバー)
 * 0byte: hid.key_mask 参照
 * 1byte: 0
 * 2byte: 1st key
 * 3byte: 2nd key
 * 4byte: 3rd key
 * 5byte: 4th key
 * 6byte: 5th key
 * 7byte: 6th key
 */
var keybd_data = new Uint8Array(8);

/** Mouse Input Reportデータ: 10 Bytes */
/* データ構造
 * 0-1byte: hid.btn_mask 参照
 * 2-3byte: 水平方向移動量(signed short)
 * 4-5byte: 垂直方向移動量(signed short)
 * 6-7byte: 垂直ホイール移動量(signed short)
 * 8-9byte: 水平ホイール移動量(signed byte)
 */
var mouse_data = new Uint16Array(5);

/** 最後に入力したキー */
var lastKey = "";

/** キーボード入力イベント */
var keybdEvent = (eventType, code) => {
	if(eventType === 'keydown'){
		// 連続した同じ入力の場合はキー押下の状態から変化しないため、終了する。
		if (lastKey === code){
			return;
		}
		lastKey = code;
	}else{
		if (lastKey === code){
			lastKey = "";
		}
	}

	// 「修飾キーか」と「修飾キーのマスク」を取得
	const [isModifierKey, keyMask] = ((_code) => {
		switch (_code){
			case 'ControlLeft':
				return [true, hid.key_mask.leftControl];
			case 'ShiftLeft':
				return [true, hid.key_mask.leftShift];
			case 'AltLeft':
				return [true, hid.key_mask.leftAlt];
			case 'OSLeft':
			case 'MetaLeft':
				return [true, hid.key_mask.leftGUI];
			case 'ControlRight':
				return [true, hid.key_mask.rightControl];
			case 'ShiftRight':
				return [true, hid.key_mask.rightShift];
			case 'AltRight':
				return [true, hid.key_mask.rightAlt];
			case 'OSRight':
			case 'MetaRight':
				return [true, hid.key_mask.rightGUI];
			default:
				return [false, 0];
		}
	})(code);

	// 修飾キーの場合
	if (isModifierKey){
		if(eventType === 'keydown'){
			keybd_data[0] |= keyMask;
		}else{
			keybd_data[0] &= ~keyMask;
		}
	// 通常キーの場合
	}else{
		let keyCode = hid.keymap[code],
			idx = keybd_data.indexOf(keyCode, 2);
		if(eventType === 'keydown' && idx < 0){
			if ((idx = keybd_data.indexOf(0x00, 2)) >= 0){
				keybd_data[idx] = keyCode;
			}else{
				keybd_data.copyWithin(2, 3);
				keybd_data[keybd_data.length - 1] = keyCode;
			}
		}else if(eventType === 'keyup' && idx >= 0){
			keybd_data.copyWithin(idx, idx + 1);
			keybd_data[keybd_data.length - 1] = 0x00;
		}
	}
	fs.writeFile(conf.dev_keyboard, keybd_data, (err) => {
		if (err){
			console.log("Error " + eventType + ": " + keybd_data + "\n" + err);
		}
	});
};

/** マウスクリックイベント */
var clickEvent = (eventType, button) => {
	const buttonMask = ((_button) => {
		switch (_button){
			case 0:
				return hid.btn_mask.leftButton;
			case 1:
				return hid.btn_mask.middleButton;
			case 2:
				return hid.btn_mask.rightButton;
			case 3:
				return hid.btn_mask.backButton;
			case 4:
				return hid.btn_mask.forwardButton;
		}
	})(button);

	if (eventType === 'mousedown'){
		mouse_data[0] |= buttonMask;
	}else{
		mouse_data[0] &= ~buttonMask;
	}
	mouse_data[1] = 0x0000;
	mouse_data[2] = 0x0000;
	mouse_data[3] = 0x0000;
	mouse_data[4] = 0x0000;
	fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
		if (err){
			console.log("Error " + eventType + ": " + mouse_data + "\n" + err);
		}
	});
};

/** マウス移動イベント */
var moveEvent = (X, Y) => {
	mouse_data[1] = X;
	mouse_data[2] = Y;
	mouse_data[3] = 0x0000;
	mouse_data[4] = 0x0000;
	fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
		if (err){
			console.log("Error move: " + mouse_data + "\n" + err);
		}
	});
};

/** ホイールイベント */
var wheelEvent = (X, Y) => {
	mouse_data[1] = 0x0000;
	mouse_data[2] = 0x0000;
	mouse_data[3] = -Y;
	mouse_data[4] = X;
	fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
		if (err){
			console.log("Error wheel: " + mouse_data + "\n" + err);
		}
	});
};

// 終了時処理
process.on('exit', () => {
	momo_process.kill('SIGTERM');
	server.close();
});

// 割り込み(Ctrl+C)での終了時
process.on('SIGINT', () => {
	process.exit(0);
});
