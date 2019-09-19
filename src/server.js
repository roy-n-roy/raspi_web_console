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
				try{
					var stream = fs.createReadStream("live/stream.m3u8");
					response.writeHead(200, {"Content-Type":"text/javascript"});
					stream.pipe(response);
				}catch(e){
					response.writeHead(200, {"Content-Type":"text/javascript"});
					response.write("");
				}
				break;
			case '/js/socket.io.slim.js':
				var stream = fs.createReadStream("node_modules/socket.io-client/dist/socket.io.slim.js");
				response.writeHead(200, {"Content-Type":"text/javascript"});
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
	socket.on('keydown',	keybdEvent)
		  .on('keyup',		keybdEvent)
		  .on('mousemove',	moveEvent)
		  .on('mousedown',	clickEvent)
		  .on('mouseup',	clickEvent)
		  .on('wheel',		wheelEvent)
		  .on('touchmove',	moveEvent);
});

// 終了時処理
process.on('exit', () => {
	vidstream.kill('SIGTERM');
	server.close();
});

// 割り込み(Ctrl+C)での終了時
process.on('SIGINT', () => {
	process.exit(0);
});

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
}

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
	console.log(X, Y);
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
}