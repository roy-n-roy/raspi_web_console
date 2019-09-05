#!/bin/bash
mkdir -p /sys/kernel/config/usb_gadget/hid_gadget
cd /sys/kernel/config/usb_gadget/hid_gadget

echo 0x1d6b > idVendor # Linux Foundation
echo 0x0104 > idProduct # Multifunction Composite Gadget
echo 0x0100 > bcdDevice # v1.0.0
echo 0x0200 > bcdUSB # USB2
echo 0xEF > bDeviceClass
echo 0x02 > bDeviceSubClass
echo 0x01 > bDeviceProtocol
mkdir -p strings/0x409
echo "fedcba9876543210" > strings/0x409/serialnumber
echo "Raspberry Pi" > strings/0x409/manufacturer
echo "Generic USB Composite Device" > strings/0x409/product
mkdir -p configs/c.1/strings/0x409
echo "Config 1: ECM network" > configs/c.1/strings/0x409/configuration
echo 500 > configs/c.1/MaxPower

# Keyboard (6 simultaneous Keys + Modifier -> 8 Bytes)
N="usb0"
mkdir -p functions/hid.$N
echo 1 > functions/hid.$N/protocol
echo 1 > functions/hid.$N/subclass
echo 8 > functions/hid.$N/report_length
echo -ne \\x05\\x01\\x09\\x06\\xA1\\x01\\x05\\x07\\x19\\xE0\\x29\\xE7\\x15\\x00\\x25\\x01\\x75\\x01\\x95\\x08\\x81\\x02\\x05\\x0C\\x95\\x01\\x75\\x08\\x15\\x00\\x26\\xFF\\x00\\x19\\x00\\x29\\xFF\\x81\\x00\\x05\\x08\\x19\\x01\\x29\\x08\\x95\\x08\\x75\\x01\\x91\\x02\\x05\\x07\\x95\\x06\\x75\\x08\\x15\\x00\\x26\\xE7\\x00\\x19\\x00\\x29\\xE7\\x81\\x00\\xC0 > functions/hid.$N/report_desc
ln -s functions/hid.$N configs/c.1/

# Mouse (8 Buttons, X, Y, Wheel -> 4 Bytes)
N="usb1"
mkdir -p functions/hid.$N
echo 2 > functions/hid.$N/protocol
echo 1 > functions/hid.$N/subclass
echo 4 > functions/hid.$N/report_length
echo -ne \\x05\\x01\\x09\\x02\\xA1\\x01\\x09\\x01\\xA1\\x00\\x05\\x09\\x19\\x01\\x29\\x03\\x15\\x00\\x25\\x01\\x95\\x03\\x75\\x01\\x81\\x02\\x95\\x01\\x75\\x05\\x81\\x01\\x05\\x01\\x09\\x30\\x09\\x31\\x09\\x38\\x15\\x81\\x25\\x7F\\x75\\x08\\x95\\x03\\x81\\x06\\xC0\\xC0 > functions/hid.$N/report_desc
ln -s functions/hid.$N configs/c.1/

ls /sys/class/udc > UDC
