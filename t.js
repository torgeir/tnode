// tnode

var sys = require('sys'),
	http = require('http');
	
var dispatcher = require('./lib/dispatcher'),
	responder = require('./lib/responder');

exports.serve = responder.serveFile;
exports.app = function(conf) {
	
	DEBUG = conf.debug || false;
	var port = conf.port || 8888;
	
	dispatcher.init(conf);
	
	http.createServer(function(req, res) {
		try {
			dispatcher.process(req, res);
		} 
		catch(e) {
			responder.respond500(res, e);
		}
	}).listen(port);

	sys.puts('Starting server at http://127.0.0.1:' + port);
	
	process.addListener('SIGINT', function() {
		sys.puts('\nShutting down..');
		process.exit(0);
	});
};