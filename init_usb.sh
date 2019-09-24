#!/bin/bash -e
mkdir -p /sys/kernel/config/usb_gadget/gadget
cd /sys/kernel/config/usb_gadget/gadget

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
echo 1000 > configs/c.1/MaxPower

## Ethernet Adapter for Debug.
#N="usb0"
#mkdir -p functions/rndis.$N/os_desc/interface.rndis
## first byte of address must be even
#HOST="48:6f:73:74:50:43" # "HostPC"
#SELF="42:61:64:55:53:42" # "BadUSB"
#echo RNDIS > functions/rndis.$N/os_desc/interface.rndis/compatible_id
#echo 5162001 > functions/rndis.$N/os_desc/interface.rndis/sub_compatible_id
#echo $HOST > functions/rndis.$N/host_addr
#echo $SELF > functions/rndis.$N/dev_addr
#ln -s functions/rndis.$N configs/c.1/

# Keyboard (Modifier keys + 6 simultaneous Keys -> 8 Bytes)
N="usb0"
mkdir -p functions/hid.$N
echo 1 > functions/hid.$N/protocol
echo 1 > functions/hid.$N/subclass
echo 8 > functions/hid.$N/report_length
echo "05010906A101050719E029E715002501750195088102050C95017508150026FF00190029FF8100050819012908950875019102050795067508150026E700190029E78100C0" | xxd -r -ps > functions/hid.$N/report_desc
ln -s functions/hid.$N configs/c.1/

# Mouse (5 Buttons, X, Y, Wheel, AC Pan -> 5*2 Bytes)
N="usb1"
mkdir -p functions/hid.$N
echo 2 > functions/hid.$N/protocol
echo 1 > functions/hid.$N/subclass
echo 10 > functions/hid.$N/report_length
echo "05010902A1010901A100050919012905150025019505750181029501750B8101050109300931093816018026FF7F751095038106050C0A380216018026FF7F751095018106C0C0" | xxd -r -ps > functions/hid.$N/report_desc
ln -s functions/hid.$N configs/c.1/

ls /sys/class/udc > UDC
