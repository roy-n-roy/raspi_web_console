#!/bin/bash

# nodejs, npmインストールチェック
which nodejs npm > /dev/null || {
    echo "Please install nodejs and npm.";
    exie 1
}

# すでに記載ある場合は追記しない
grep '^dtoverlay=dwc2$' /boot/config.txt > /dev/null || {
    echo "dtoverlay=dwc2" >> /boot/config.txt
}
grep '^dwc2$' /etc/modules > /dev/null || {
    echo "dwc2" >> /etc/modules
}
grep '^libcomposite$' /etc/modules > /dev/null || {
    echo "libcomposite" >> /etc/modules
}

# すでにファイルがある場合は削除
if [ -f /usr/local/bin/init_usb.sh ]; then
    rm -f /usr/local/bin/init_usb.sh
fi
cp ./init_usb.sh /usr/local/bin/.
chmod +x /usr/local/bin/init_usb.sh

# すでにディレクトリがある場合は削除
if [ -d /usr/local/raspi_web_console ]; then
    rm -fr /usr/local/raspi_web_console
fi
cp -r src /usr/local/raspi_web_console
cd /usr/local/raspi_web_console
npm install
cd - > /dev/null

cp systemd/system/usb_init.service systemd/system/web_console.service /etc/systemd/system/.
systemctl daemon-reload
systemctl enable usb_init
systemctl enable web_console

exit 0
