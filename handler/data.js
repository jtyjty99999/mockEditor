var errorHandler = require('../errorHandler'), url = require('url'),
querystring = require('querystring'),FileStore = require("file-store")
    , serverStore = FileStore("dataStored.txt");

exports.notFound = function (req, res, next) {
	errorHandler.pageNotFound(req, res)
}

function getQuery(req) {
	return querystring.parse(url.parse(req.url).query);
}

exports.sendBackData = function (req, res, next) {

	var query = getQuery(req);

	var uuid = query['uuid'];
	
	serverStore.get(uuid, function (err, value) {
	
	res.end(value)
})

	
	

}

exports.sendBackDataforPost = function (req, res, next) {

	req.body['uuid'];
	
	serverStore.get(uuid, function (err, value) {
	
	res.end(value)
})

	
	

}