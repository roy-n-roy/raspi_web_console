module.exports = {
	/** mouse bottun bit mask */
	btn_mask: { 
		leftButton		:	0x01,
		rightButton		:	0x02,
		middleButton	:	0x04,
		backButton		:	0x08,
		forwardButton	:	0x10
	},
	/** digitizer In-Range bit mask */
	dig_mask: {
		inRange		:	0x10
	},
	/** keyboard modifier keys bit mask */
	key_mask: {
		leftControl	:	0x01,
		leftShift	:	0x02,
		leftAlt		:	0x04,
		leftGUI		:	0x08,
		rightControl:	0x10,
		rightShift	:	0x20,
		rightAlt	:	0x40,
		rightGUI	:	0x80
	},
	/** Web API keyboard event code to HID keyboaed code */
	keymap : {
		//					0x00,	// Reserved (no event indicated)
		//					0x01,	// Keyboard ErrorRollOver
		//					0x02,	// Keyboard POSTFail
		//					0x03,	// Keyboard ErrorUndefined
		"KeyA"			:	0x04,	// Keyboard a and A
		"KeyB"			:	0x05,	// Keyboard b and B
		"KeyC"			:	0x06,	// Keyboard c and C
		"KeyD"			:	0x07,	// Keyboard d and D
		"KeyE"			:	0x08,	// Keyboard e and E
		"KeyF"			:	0x09,	// Keyboard f and F
		"KeyG"			:	0x0A,	// Keyboard g and G
		"KeyH"			:	0x0B,	// Keyboard h and H
		"KeyI"			:	0x0C,	// Keyboard i and I
		"KeyJ"			:	0x0D,	// Keyboard j and J
		"KeyK"			:	0x0E,	// Keyboard k and K
		"KeyL"			:	0x0F,	// Keyboard l and L
		"KeyM"			:	0x10,	// Keyboard m and M
		"KeyN"			:	0x11,	// Keyboard n and N
		"KeyO"			:	0x12,	// Keyboard o and O
		"KeyP"			:	0x13,	// Keyboard p and P
		"KeyQ"			:	0x14,	// Keyboard q and Q
		"KeyR"			:	0x15,	// Keyboard r and R
		"KeyS"			:	0x16,	// Keyboard s and S
		"KeyT"			:	0x17,	// Keyboard t and T
		"KeyU"			:	0x18,	// Keyboard u and U
		"KeyV"			:	0x19,	// Keyboard v and V
		"KeyW"			:	0x1A,	// Keyboard w and W
		"KeyX"			:	0x1B,	// Keyboard x and X
		"KeyY"			:	0x1C,	// Keyboard y and Y
		"KeyZ"			:	0x1D,	// Keyboard z and Z
		"Digit1"		:	0x1E,	// Keyboard 1 and !
		"Digit2"		:	0x1F,	// Keyboard 2 and @
		"Digit3"		:	0x20,	// Keyboard 3 and #
		"Digit4"		:	0x21,	// Keyboard 4 and $
		"Digit5"		:	0x22,	// Keyboard 5 and %
		"Digit6"		:	0x23,	// Keyboard 6 and ^
		"Digit7"		:	0x24,	// Keyboard 7 and &
		"Digit8"		:	0x25,	// Keyboard 8 and *
		"Digit9"		:	0x26,	// Keyboard 9 and (
		"Digit0"		:	0x27,	// Keyboard 0 and )
		"Enter"			:	0x28,	// Keyboard Return (ENTER)
		"Escape"		:	0x29,	// Keyboard ESCAPE
		"Backspace"		:	0x2A,	// Keyboard DELETE (Backspace)
		"Tab"			:	0x2B,	// Keyboard Tab
		"Space"			:	0x2C,	// Keyboard Spacebar
		"Minus"			:	0x2D,	// Keyboard - and (underscore)
		"Equal"			:	0x2E,	// Keyboard = and +
		"BracketLeft"	:	0x2F,	// Keyboard [ and {
		"BracketRight"	:	0x30,	// Keyboard ] and }
		//					0x31,	// Keyboard \ and ｜
		"Backslash"		:	0x32,	// Keyboard Non-US # and ~
		"Semicolon"		:	0x33,	// Keyboard ; and	:
		"Quote"			:	0x34,	// Keyboard ' and "
		"Backquote"		:	0x35,	// Keyboard Grave Accent and Tilde
		"Comma"			:	0x36,	// Keyboard, and <
		"Period"		:	0x37,	// Keyboard . and >
		"Slash"			:	0x38,	// Keyboard / and ?
		"CapsLock"		:	0x39,	// Keyboard Caps Lock
		"F1"			:	0x3A,	// Keyboard F1
		"F2"			:	0x3B,	// Keyboard F2
		"F3"			:	0x3C,	// Keyboard F3
		"F4"			:	0x3D,	// Keyboard F4
		"F5"			:	0x3E,	// Keyboard F5
		"F6"			:	0x3F,	// Keyboard F6
		"F7"			:	0x40,	// Keyboard F7
		"F8"			:	0x41,	// Keyboard F8
		"F9"			:	0x42,	// Keyboard F9
		"F10"			:	0x43,	// Keyboard F10
		"F11"			:	0x44,	// Keyboard F11
		"F12"			:	0x45,	// Keyboard F12
		//					0x46,	// Keyboard PrintScreen
		"ScrollLock"	:	0x47,	// Keyboard Scroll Lock
		"Pause"			:	0x48,	// Keyboard Pause
		"Insert"		:	0x49,	// Keyboard Insert
		"Home"			:	0x4A,	// Keyboard Home
		"PageUp"		:	0x4B,	// Keyboard PageUp
		"Delete"		:	0x4C,	// Keyboard Delete Forward
		"End"			:	0x4D,	// Keyboard End
		"PageDown"		:	0x4E,	// Keyboard PageDown
		"ArrowRight"	:	0x4F,	// Keyboard RightArrow
		"ArrowLeft"		:	0x50,	// Keyboard LeftArrow
		"ArrowDown"		:	0x51,	// Keyboard DownArrow
		"ArrowUp"		:	0x52,	// Keyboard UpArrow
		"NumLock"		:	0x53,	// Keypad Num Lock and Clear
		"NumpadDivide"	:	0x54,	// Keypad /
		"NumpadMultiply":	0x55,	// Keypad *
		"NumpadSubtract":	0x56,	// Keypad -
		"NumpadAdd"		:	0x57,	// Keypad +
		"NumpadEnter"	:	0x58,	// Keypad ENTER
		"Numpad1"		:	0x59,	// Keypad 1 and End
		"Numpad2"		:	0x5A,	// Keypad 2 and Down Arrow
		"Numpad3"		:	0x5B,	// Keypad 3 and PageDn
		"Numpad4"		:	0x5C,	// Keypad 4 and Left Arrow
		"Numpad5"		:	0x5D,	// Keypad 5
		"Numpad6"		:	0x5E,	// Keypad 6 and Right Arrow
		"Numpad7"		:	0x5F,	// Keypad 7 and Home
		"Numpad8"		:	0x60,	// Keypad 8 and Up Arrow
		"Numpad9"		:	0x61,	// Keypad 9 and PageUp
		"Numpad0"		:	0x62,	// Keypad 0 and Insert
		"NumpadDecimal"	:	0x63,	// Keypad . and Delete
		//					0x64,	// Keyboard Non-US \ and ｜
		"ContextMenu"	:	0x65,	// Keyboard Application
		//					0x66,	// Keyboard Power
		"NumpadEqual"	:	0x67,	// Keypad =
		"F13"			:	0x68,	// Keyboard F13
		"F14"			:	0x69,	// Keyboard F14
		"F15"			:	0x6A,	// Keyboard F15
		"F16"			:	0x6B,	// Keyboard F16
		"F17"			:	0x6C,	// Keyboard F17
		"F18"			:	0x6D,	// Keyboard F18
		"F19"			:	0x6E,	// Keyboard F19
		"F20"			:	0x6F,	// Keyboard F20
		"F21"			:	0x70,	// Keyboard F21
		"F22"			:	0x71,	// Keyboard F22
		"F23"			:	0x72,	// Keyboard F23
		"F24"			:	0x73,	// Keyboard F24
		//					0x74,	// Keyboard Execute
		//					0x75,	// Keyboard Help
		//					0x76,	// Keyboard Menu
		//					0x77,	// Keyboard Select
		//					0x78,	// Keyboard Stop
		//					0x79,	// Keyboard Again
		//					0x7A,	// Keyboard Undo
		//					0x7B,	// Keyboard Cut
		//					0x7C,	// Keyboard Copy
		//					0x7D,	// Keyboard Paste
		//					0x7E,	// Keyboard Find
		//					0x7F,	// Keyboard Mute
		//					0x80,	// Keyboard Volume Up
		//					0x81,	// Keyboard Volume Down
		//					0x82,	// Keyboard Locking Caps Lock
		//					0x83,	// Keyboard Locking Num Lock
		//					0x84,	// Keyboard Locking Scroll Lock
		"NumpadComma"	:	0x85,	// Keypad Comma
		//					0x86,	// Keypad Equal Sign
		"IntlRo"		:	0x87,	// Keyboard International1
		"KanaMode"		:	0x88,	// Keyboard International2
		"IntlYen"		:	0x89,	// Keyboard International3
		"Convert"		:	0x8A,	// Keyboard International4
		"NonConvert"	:	0x8B,	// Keyboard International5
		//					0x8C,	// Keyboard International6
		//					0x8D,	// Keyboard International7
		//					0x8E,	// Keyboard International8
		//					0x8F,	// Keyboard International9
		"Lang1"			:	0x90,	// Keyboard LANG1(Hangul/English)
		"Lang2"			:	0x91,	// Keyboard LANG2(Hanja)
		//					0x92,	// Keyboard LANG3(Katakana)
		//					0x93,	// Keyboard LANG4(Hiragana)
		//					0x94,	// Keyboard LANG5(Zenkaku/Hankaku)
		//					0x95,	// Keyboard LANG6
		//					0x96,	// Keyboard LANG7
		//					0x97,	// Keyboard LANG8
		//					0x98,	// Keyboard LANG9
		//					0x99,	// Keyboard Alternate Erase
		//					0x9A,	// Keyboard SysReq?/Attention
		//					0x9B,	// Keyboard Cancel
		//					0x9C,	// Keyboard Clear
		//					0x9D,	// Keyboard Prior
		//					0x9E,	// Keyboard Return
		//					0x9F,	// Keyboard Separator
		//					0xA0,	// Keyboard Out
		//					0xA1,	// Keyboard Oper
		//					0xA2,	// Keyboard Clear/Again
		//					0xA3,	// Keyboard CrSel/Props
		//					0xA4,	// Keyboard ExSel
		"ControlLeft"	:	0xE0,	// Keyboard LeftControl
		"ShiftLeft"		:	0xE1,	// Keyboard LeftShift
		"AltLeft"		:	0xE2,	// Keyboard LeftAlt
		"OSLeft"		:	0xE3,	// Keyboard Left GUI
		"MetaLeft"		:	0xE3,	// Keyboard Left GUI
		"ControlRight"	:	0xE4,	// Keyboard RightControl
		"ShiftRight"	:	0xE5,	// Keyboard RightShift
		"AltRight"		:	0xE6,	// Keyboard RightAlt
		"OSRight"		:	0xE7,	// Keyboard Right GUI
		"MetaRight"		:	0xE7	// Keyboard Right GUI
		// 					0xE8-FFFF // Reserved
	}
}