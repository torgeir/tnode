// tnode

var sys = require('sys'),
	http = require('http');
	
var dispatcher = require('./lib/dispatcher'),
	responder = require('./lib/responder');

var tnode = {
	serve : responder.serveFile,
	app: function(conf) {
	
		DEBUG = conf.debug || false;
	    DUMP_HEADERS = conf.dump_headers || false;
		var port = conf.port || 8888;
	
		dispatcher.init(conf);
		http.createServer(dispatcher.process).listen(port);

		sys.puts('Starting server at http://127.0.0.1:' + port);	
		process.addListener('SIGINT', function() {
			sys.puts('\nShutting down..');
			process.exit(0);
		});
	}
};

module.exports = tnode;