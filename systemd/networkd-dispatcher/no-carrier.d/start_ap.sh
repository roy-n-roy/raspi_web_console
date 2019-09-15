#!/bin/bash -e

if [ $IFACE = "eth0" -o $IFACE = "usb0" ]; then
	if ip link show eth0 | grep "state DOWN" > /dev/null && !(arp -ni usb0 | grep "ether" > /dev/null); then
		date > /tmp/start_ap.txt;
		systemctl start hostapd;
	fi
fi
