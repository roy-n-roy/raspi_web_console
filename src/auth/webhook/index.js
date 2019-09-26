var express = require('express');
var router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));
router.post('/', (req, res) => {
	if (req.body.room_id === 'web_console'){
		res.json({
			allowed: true,
			iceServers: [{urls: "stun:192.168.3.26"}]
		});
	}else{
		res.json({
			allowed: false,
			reason: "Authentication failed."
		});
	}
});

module.exports = router;
