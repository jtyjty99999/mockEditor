var connect = require('connect'), http = require('http'), routeMap = require('./router/index'), fs = require('fs'), path = require('path'),
shell = require('nw.gui').Shell;

var ip = require('./config').ip;

var app = connect(routeMap)
	.use(connect.logger('dev'))
	.use(connect.static('public'))
	.use(function (req, res) {
		res.end('hello world\n');
	})

	http.createServer(app).listen(3000);

var FileStore = require("file-store"), store = FileStore("dataStored.txt");

function generateUrl(data) {
	var urlId = Random.guid();
	store.set(urlId, data, function (err) {

		var url = ip + ':3000/requireData' + '?uuid=' + urlId;
		$('#generatedUrl').val(url)

	})
}