var express = require('express');
var router = express.Router();
var getDomain = require('../utils/extract_domain');
var pg = require('../pg.js');

// route that registers a domain and counts the number of times the domain in the url has been seen.
router.post('/', pg.addReferrer); 

// route that returns the 3 highest seen referring domains.
router.get('/view_top_referrers', pg.getTop3Referrer); 

module.exports = router;
