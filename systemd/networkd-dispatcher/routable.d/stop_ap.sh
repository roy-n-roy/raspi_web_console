#!/bin/bash -e

if [ $IFACE = "eth0" -o $IFACE = "usb0" ]; then
	if ip link show eth0 | grep "state UP" > /dev/null || arp -ni usb0 | grep "ether" > /dev/null; then
		date > /tmp/stop_ap.txt;
		systemctl stop hostapd;
	fi
fi
