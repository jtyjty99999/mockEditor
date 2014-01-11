var errorHandler = require('../errorHandler'), url = require('url'),
querystring = require('querystring');

exports.notFound = function (req, res, next) {
	errorHandler.pageNotFound(req, res)
}

function getQuery(req) {
	return querystring.parse(url.parse(req.url).query);
}

var data = {

	'111' : '{hello:21312321}'
}

exports.sendBackData = function (req, res, next) {

	var query = getQuery(req);

	var uuid = query['uuid'];
	
	res.end(JSON.stringify(data[uuid]))

}