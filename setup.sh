#!/bin/bash

echo "dtoverlay=dwc2" >> /boot/config.txt
echo "dwc2" >> /etc/modules
echo "libcomposite" >> /etc/modules
echo "bcm2835-v4l2" >> /etc/modules

cp ./init_usb.sh /usr/local/bin/.
chmod +x /usr/local/bin/init_usb.sh

cp -r src /usr/local/raspi_web_console
cd /usr/local/raspi_web_console
npm install
cd -

cp systemd/system/usb_init.service systemd/system/web_console.service /etc/systemd/system/.
systemctl daemon-reload
systemctl enable usb_init
systemctl enable web_console
