var promise = require('bluebird');
var _ = require('underscore');

var getDomain = require('./utils/extract_domain');

var options = {
	promiseLab: promise
};
var pgp = require('pg-promise')(options);

// Database settings
var connectionString = process.env.POSTGRES_URL || 'postgres://localhost:5432/referrer_tracking';
var db = pgp(connectionString);

/**
 * URL that registers a domain and increment the counter that keep track of domain count
 * @param {req} HTTP request object
 * @param {res} HTTP response object
 */
function addReferrer(req, res, next) {
	var referrer_url = req.param('referrer');
	var domain = getDomain(referrer_url);
	var message = referrer_url;
	if (domain === null) {
		message = message.concat(' is not a valid URL.');
		res.status(500);
		res.render('index', { title: 'Referrers tracking', message: message });
	} else {
		db.any('select * from ref_info where referrer = $1', domain )
		.then(function (data) {
			if (!_.isEmpty(data)) {
				updateRefCount(data[0].ref_count, domain);
			} else {
				insertReferrer(domain);
			}
			res.status(200).json({
				status: 'success',
				message: 'Successfully added the referrer'.concat(referrer_url)
			});
		})
		.catch(function(err) {
			res.render('index', { title: 'Referrers tracking', message: 'There was a problem with database transaction.' });
		});
	}
};

/**
 * Helper function to update referrer (domain) count
 * @param {ref_count} current domain count
 * @param {domain} domain name in referrer url
 */
function updateRefCount(ref_count, domain) {
	var increment_ref_count = parseInt(ref_count) + 1;
	db.any('update ref_info set ref_count = $1 where referrer = $2', [increment_ref_count, domain])
		.then(function () {
			console.log('success');
		})
		.catch(function(err) {
			console.log(err);
		});
}

/**
 * Helper function to register a new domain
 * @param {domain} domain name in referrer url
 */
function insertReferrer(domain) {
	db.any('insert into ref_info(referrer, ref_count) values($1, $2)', [domain, 1])
		.then(function(result) {
			console.log('Inserted ref_info for ' + domain);
		})
		.catch(function(err) {
			//throw error
			console.log(err)
		});
}

/**
 * Function to return top 3 referrers
 * @param {req} HTTP request object
 * @param {res} HTTP response object
 */
function getTop3Referrer(req, res, next) {
	db.any('select * from ref_info order by ref_count desc limit 3')
		.then(function (data) {
			if (!_.isEmpty(data)) {
				res.status(200);
				res.render('top_referrer_list', { title: 'Top 3 Referrers', referrerList: data});
			}
		})
		.catch(function(err) {
			console.log(err);
			return next(err);
		});
}

module.exports = {
	addReferrer : addReferrer,
	getTop3Referrer: getTop3Referrer
};