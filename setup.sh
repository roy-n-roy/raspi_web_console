#!/bin/bash

echo "dtoverlay=dwc2" >> /boot/config.txt
echo "dwc2" >> /etc/modules
echo "libcomposite" >> /etc/modules

cp ./hid.sh /usr/local/bin/.
chmod +x /usr/local/bin/hid.sh

cp -r src /usr/local/raspi_web_console
cd /usr/local/raspi_web_console
npm install
cd -

cp systemd/usb_hid.service systemd/raspi_web_console.service /etc/systemd/system/.
systemctl daemon-reload
systemctl enable usb_hid
systemctl enable raspi_web_console
