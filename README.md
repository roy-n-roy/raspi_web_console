# Raspberry Pi Remote Web Console
Using Raspberry pi as an emulator for USB HID mouse and keyboard,  
displays HDMI input from CSI -2 through a browser, and enables mouse and keyboard operations.

## Requirements
* Raspberry Pi 1 Model A/Zero/Zero W/Zero WH/4 (needs USB-OTG port).
* HDMI to CSI-2 bridge module.

## Install
* Install Raspbian Buster and Node.js 10 or higher.
* Connect your Raspberry Pi to your PC via HDMI and USB-OTG
* Enable your camera module. `sudo raspi-config` and select `Enable Camera`.
* Run `sudo bash ./setup.sh` and reboot.

## How to use
* Access to `http://raspberrypi.local/` on your browser.

## ToDo
* ブラウザのWindowSize変更に対応して、マウスポインタの移動量を調整する
* mouseenterイベントに対応して、マウスポインタをブラウザ上と同位置に移動させる
* OS Key(Windowsキー)の入力時の挙動の修正
* 簡易的な認証機能を実装する
