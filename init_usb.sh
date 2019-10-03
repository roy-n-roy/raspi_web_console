#!/bin/bash -e

# Keyboard Report Descriptor
# (Modifier keys + 6 simultaneous Keys -> 8 Bytes)
KEYBD_REPT=""
KEYBD_REPT+="0501"      # USAGE_PAGE (Generic Desktop)
KEYBD_REPT+="0906"      # USAGE (Keyboard)
KEYBD_REPT+="A101"      # COLLECTION (Application)
KEYBD_REPT+="0507"      #   USAGE_PAGE (Keyboard)
KEYBD_REPT+="19E0"      #   USAGE_MINIMUM (Keyboard LeftControl)
KEYBD_REPT+="29E7"      #   USAGE_MAXIMUM (Keyboard Right GUI)
KEYBD_REPT+="1500"      #   LOGICAL_MINIMUM (0)
KEYBD_REPT+="2501"      #   LOGICAL_MAXIMUM (1)
KEYBD_REPT+="7501"      #   REPORT_SIZE (1)
KEYBD_REPT+="9508"      #   REPORT_COUNT (8)
KEYBD_REPT+="8102"      #   INPUT (Data,Var,Abs)
KEYBD_REPT+="7508"      #   REPORT_SIZE (8)
KEYBD_REPT+="9501"      #   REPORT_COUNT (1)
KEYBD_REPT+="8103"      #   INPUT (Cnst,Var,Abs)
KEYBD_REPT+="1900"      #   USAGE_MINIMUM (Reserved (no event indicated))
KEYBD_REPT+="299F"      #   USAGE_MAXIMUM (Keyboard Separator)
KEYBD_REPT+="1500"      #   LOGICAL_MINIMUM (0)
KEYBD_REPT+="259F"      #   LOGICAL_MAXIMUM (175)
KEYBD_REPT+="7508"      #   REPORT_SIZE (8)
KEYBD_REPT+="9506"      #   REPORT_COUNT (6)
KEYBD_REPT+="8100"      #   INPUT (Data,Ary,Abs)
KEYBD_REPT+="0508"      #   USAGE_PAGE (LEDs)
KEYBD_REPT+="1901"      #   USAGE_MINIMUM (Num Lock)
KEYBD_REPT+="2905"      #   USAGE_MAXIMUM (Kana)
KEYBD_REPT+="1500"      #   LOGICAL_MINIMUM (0)
KEYBD_REPT+="2501"      #   LOGICAL_MAXIMUM (1)
KEYBD_REPT+="7501"      #   REPORT_SIZE (1)
KEYBD_REPT+="9505"      #   REPORT_COUNT (5)
KEYBD_REPT+="9102"      #   OUTPUT (Data,Var,Abs)
KEYBD_REPT+="7503"      #   REPORT_SIZE (3)
KEYBD_REPT+="9501"      #   REPORT_COUNT (1)
KEYBD_REPT+="9103"      #   OUTPUT (Cnst,Var,Abs)
KEYBD_REPT+="C0"        # END_COLLECTION

# Mouse and Digitizer Report Descriptor
#  (report_id=1, 5 Buttons, X, Y, Wheel, AC Pan -> 1byte + 1byte + 4*2 Bytes)
#  (report_id=2, 5 Buttons, X, Y, padding*2     -> 1byte + 1byte + 4*2 Bytes)
MOUSE_REPT=""
MOUSE_REPT+="0501"      # USAGE_PAGE (Generic Desktop)
MOUSE_REPT+="0902"      # USAGE (Mouse)
MOUSE_REPT+="A101"      # COLLECTION (Application)
MOUSE_REPT+="0901"      #   USAGE (Pointer)
MOUSE_REPT+="A100"      #   COLLECTION (Physical)
MOUSE_REPT+="8501"      #     REPORT_ID (1)
MOUSE_REPT+="0509"      #     USAGE_PAGE (Button)
MOUSE_REPT+="1901"      #     USAGE_MINIMUM (Button 1)
MOUSE_REPT+="2905"      #     USAGE_MAXIMUM (Button 5)
MOUSE_REPT+="1500"      #     LOGICAL_MINIMUM (0)
MOUSE_REPT+="2501"      #     LOGICAL_MAXIMUM (1)
MOUSE_REPT+="7501"      #     REPORT_SIZE (1)
MOUSE_REPT+="9505"      #     REPORT_COUNT (5)
MOUSE_REPT+="8102"      #     INPUT (Data,Var,Abs)
MOUSE_REPT+="7503"      #     REPORT_SIZE (3)
MOUSE_REPT+="9501"      #     REPORT_COUNT (1)
MOUSE_REPT+="8101"      #     INPUT (Cnst,Ary,Abs)
MOUSE_REPT+="0501"      #     USAGE_PAGE (Generic Desktop)
MOUSE_REPT+="0930"      #     USAGE (X)
MOUSE_REPT+="0931"      #     USAGE (Y)
MOUSE_REPT+="0938"      #     USAGE (Wheel)
MOUSE_REPT+="160180"    #     LOGICAL_MINIMUM (-32767)
MOUSE_REPT+="26FF7F"    #     LOGICAL_MAXIMUM (32767)
MOUSE_REPT+="7510"      #     REPORT_SIZE (16)
MOUSE_REPT+="9503"      #     REPORT_COUNT (3)
MOUSE_REPT+="8106"      #     INPUT (Data,Var,Rel)
MOUSE_REPT+="050C"      #     USAGE_PAGE (Consumer Devices)
MOUSE_REPT+="0A3802"    #     USAGE (AC Pan)
MOUSE_REPT+="160180"    #     LOGICAL_MINIMUM (-32767)
MOUSE_REPT+="26FF7F"    #     LOGICAL_MAXIMUM (32767)
MOUSE_REPT+="7510"      #     REPORT_SIZE (16)
MOUSE_REPT+="9501"      #     REPORT_COUNT (1)
MOUSE_REPT+="8106"      #     INPUT (Data,Var,Rel)
MOUSE_REPT+="C0"        #   END_COLLECTION
MOUSE_REPT+="C0"        # END_COLLECTION
MOUSE_REPT+="050D"      # USAGE_PAGE (Digitizers)
MOUSE_REPT+="0902"      # USAGE (Pen)
MOUSE_REPT+="A101"      # COLLECTION (Application)
MOUSE_REPT+="8502"      #   REPORT_ID (2)
MOUSE_REPT+="0920"      #   USAGE (Stylus)
MOUSE_REPT+="A100"      #   COLLECTION (Physical)
MOUSE_REPT+="1500"      #     LOGICAL_MINIMUM (0)
MOUSE_REPT+="2501"      #     LOGICAL_MAXIMUM (1)
MOUSE_REPT+="0942"      #     USAGE (Tip Switch)
MOUSE_REPT+="0944"      #     USAGE (Barrel Switch)
MOUSE_REPT+="093C"      #     USAGE (Invert)
MOUSE_REPT+="0945"      #     USAGE (Eraser Switch)
MOUSE_REPT+="0932"      #     USAGE (In Range)
MOUSE_REPT+="7501"      #     REPORT_SIZE (1)
MOUSE_REPT+="9505"      #     REPORT_COUNT (5)
MOUSE_REPT+="8102"      #     INPUT (Data,Var,Abs)
MOUSE_REPT+="7503"      #     REPORT_SIZE (3)
MOUSE_REPT+="9501"      #     REPORT_COUNT (1)
MOUSE_REPT+="8101"      #     INPUT (Cnst,Ary,Abs)
MOUSE_REPT+="0501"      #     USAGE_PAGE (Generic Desktop)
MOUSE_REPT+="7510"      #     REPORT_SIZE (16)
MOUSE_REPT+="9501"      #     REPORT_COUNT (1)
MOUSE_REPT+="5500"      #     UNIT_EXPONENT (0)
MOUSE_REPT+="6513"      #     UNIT (Inch,EngLinear)
MOUSE_REPT+="3500"      #     PHYSICAL_MINIMUM (0)
MOUSE_REPT+="1500"      #     LOGICAL_MINIMUM (0)
MOUSE_REPT+="0930"      #     USAGE (X)
MOUSE_REPT+="460005"    #     PHYSICAL_MAXIMUM (1280)
MOUSE_REPT+="260005"    #     LOGICAL_MAXIMUM (1280)
MOUSE_REPT+="8102"      #     INPUT (Data,Var,Abs)
MOUSE_REPT+="0931"      #     USAGE (Y)
MOUSE_REPT+="46D002"    #     PHYSICAL_MAXIMUM (720)
MOUSE_REPT+="26D002"    #     LOGICAL_MAXIMUM (720)
MOUSE_REPT+="8102"      #     INPUT (Data,Var,Abs)
MOUSE_REPT+="7520"      #     REPORT_SIZE (32)
MOUSE_REPT+="8101"      #     INPUT (Cnst,Ary,Abs)
MOUSE_REPT+="C0"        #   END_COLLECTION
MOUSE_REPT+="C0"        # END_COLLECTION

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

if [ -n ""$(cat UDC)"" ]; then echo > UDC; fi

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
if [ -L configs/c.1/hid.$N ]; then rm configs/c.1/hid.$N; fi
mkdir -p functions/hid.$N
echo 1 > functions/hid.$N/protocol
echo 1 > functions/hid.$N/subclass
echo 8 > functions/hid.$N/report_length
echo $KEYBD_REPT | xxd -r -ps > functions/hid.$N/report_desc
ln -s functions/hid.$N configs/c.1/

N="usb1"
if [ -L configs/c.1/hid.$N ]; then rm configs/c.1/hid.$N; fi
mkdir -p functions/hid.$N
echo 2 > functions/hid.$N/protocol
echo 1 > functions/hid.$N/subclass
echo 10 > functions/hid.$N/report_length
echo $MOUSE_REPT | xxd -r -ps > functions/hid.$N/report_desc
ln -s functions/hid.$N configs/c.1/

ls /sys/class/udc > UDC

