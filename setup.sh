#!/bin/bash

echo "dtoverlay=dwc2" >> /boot/config.txt
echo "dwc2" >> /etc/modules
echo "libcomposite" >> /etc/modules

cp ./hid.sh ./vidstream.sh /usr/local/bin/.
chmod +x /usr/local/bin/init_usb.sh /usr/local/bin/vidstream.sh

cp -r src /usr/local/raspi_web_console
cd /usr/local/raspi_web_console
npm install
cd -

cp systemd/usb_init.service systemd/raspi_web_console.service /etc/systemd/system/.
systemctl daemon-reload
systemctl enable usb_init
systemctl enable raspi_web_console
