const conf = require('config');
const fs = require('fs');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const proxy = require('http-proxy').createProxyServer({target: conf.signaling_url, ws: true});
const io = require('socket.io')(server);

// HIDモジュールを読み込み
const hid = require(__dirname + '/hid.js');

// コンテンツ公開
app.use('/', express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/node_modules/socket.io-client/dist'));
app.use('/js', express.static(__dirname + '/node_modules/@open-ayame/ayame-web-sdk/dist'));
app.use('/auth/webhook', require(__dirname + '/auth/webhook'));

// シグナリングサーバへの接続をProxy
server.on('upgrade', (req, socket, head) =>{
	if (req.url === '/signaling'){
		proxy.ws(req, socket, head);
	}
});
server.listen(conf.http_port);

// 接続時に実行
io.on('connection', (socket) => {
	// 既存のコネクションを切断(排他接続)
	for (id in io.sockets.connected){
		if (id !== socket.id){
			io.sockets.connected[id].disconnect();
		}
	}

	// 入力イベント
	socket.on('keydown',	keybdEvent)
		.on('keyup',		keybdEvent)
		.on('mousemove',	moveEvent)
		.on('mousedown',	clickEvent)
		.on('mouseup',		clickEvent)
		.on('wheel',		wheelEvent)
		.on('touchmove',	moveEvent);
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
 * 7byte: 6th key */
const keybd_data = new Uint8Array(8);

/** Mouse Input Reportデータ: 10 Bytes */
/* データ構造
 * 0-1byte: hid.btn_mask 参照
 * 2-3byte: 水平方向移動量(signed short)
 * 4-5byte: 垂直方向移動量(signed short)
 * 6-7byte: 垂直ホイール移動量(signed short)
 * 8-9byte: 水平ホイール移動量(signed byte) */
const mouse_data = new Uint16Array(5);

/** 最後に入力したキー 記憶用変数 */
let lastKey = '';

/** キーボード入力イベント */
const keybdEvent = async (eventType, code) => {
	if (eventType === 'keydown'){
		// 連続した同じ入力の場合はキー押下の状態から変化しないため、終了する。
		if (lastKey === code) return;
		// 最後に押下したキーを記憶
		lastKey = code;
	}else{
		// キーを放した場合はクリアする
		if (lastKey === code) lastKey = '';
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
		if (eventType === 'keydown'){
			keybd_data[0] |= keyMask;
		}else{
			keybd_data[0] &= ~keyMask;
		}
	// 通常キーの場合
	}else{
		let keyCode = hid.keymap[code];
		let idx = keybd_data.indexOf(keyCode, 2);
		if (eventType === 'keydown' && idx < 0){
			// 最大入力キー数=6 より少ない場合
			if ((idx = keybd_data.indexOf(0x00, 2)) >= 0){
				keybd_data[idx] = keyCode;
			// 入力キー数>=6の場合
			}else{
				// 古い入力から切り捨てる
				keybd_data.copyWithin(2, 3);
				keybd_data[keybd_data.length - 1] = keyCode;
			}
		}else if (eventType === 'keyup' && idx >= 0){
			keybd_data.copyWithin(idx, idx + 1);
			keybd_data[keybd_data.length - 1] = 0x00;
		}
	}
	fs.writeFile(conf.dev_keyboard, keybd_data, (err) => {
		if (err){
			console.error(`Error ${eventType}: ${keybd_data}\n${err}`);
		}
	});
};

/** マウスクリックイベント */
const clickEvent = async (eventType, button) => {
	const buttonMask =  ((_button) => {
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
	mouse_data[1] = mouse_data[2] = mouse_data[3] = mouse_data[4] = 0x0000;
	fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
		if (err){
			console.error(`Error ${eventType}: ${mouse_data}\n ${err}`);
		}
	});
};

/** マウス移動イベント */
const moveEvent = async (X, Y) => {
	mouse_data[1] = X;
	mouse_data[2] = Y;
	mouse_data[3] = mouse_data[4] = 0x0000;
	fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
		if (err){
			console.error(`Error move: ${mouse_data}\n ${err}`);
		}
	});
};
/** マウス座標指定移動イベント */
const pointEvent = async (X, Y) => {
	mouse_data[1] = mouse_data[2] = 0x7FFF;
	mouse_data[3] = mouse_data[4] = 0x0000;
	fs.writeFileSync(conf.dev_mouse, mouse_data);
	mouse_data[1] = X;
	mouse_data[2] = Y;
	console.log(`DEBUG enter: ${X} ${Y} ${mouse_data}`);
	fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
		if (err){
			console.error(`Error move: ${mouse_data}\n ${err}`);
		}
	});
}

/** ホイールイベント */
const wheelEvent = async (X, Y) => {
	mouse_data[1] = mouse_data[2] = 0x0000;
	mouse_data[3] = -Y;
	mouse_data[4] = X;
	fs.writeFile(conf.dev_mouse, mouse_data, (err) => {
		if (err){
			console.error(`Error wheel: ${mouse_data}\n ${err}`);
		}
	});
};
