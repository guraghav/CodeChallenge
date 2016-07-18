var url = require('url');
var parseDomain = require('parse-domain');

function getDomain(referrer_url) {
    var parsedUrl = parseDomain(referrer_url) || null;
    var domain = null;
    if (parsedUrl !== null) {
    	domain = parsedUrl.domain + '.' + parsedUrl.tld;
    } 
    return domain;
}

module.exports = getDomain