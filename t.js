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

		process.addListener('SIGINT', function() {
			sys.puts('\nShutting down..');
			process.exit(0);
		});           
	
		dispatcher.init(conf);
		var server = http.createServer(dispatcher.process);

    var listen = server.listen;
    server.listen = function() {
  		sys.puts('Starting server at http://127.0.0.1:' + arguments[0]);	
      listen.apply(server, arguments);
    };
		                                    
		return server;
	}
};

module.exports = tnode;