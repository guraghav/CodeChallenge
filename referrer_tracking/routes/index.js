var express = require('express');
var router = express.Router();
var getDomain = require('../utils/extract_domain');
var pg = require('../pg.js');


router.post('/', pg.addReferrer); 
router.get('/view_top_referrers', pg.getTop3Referrer); 

module.exports = router;
