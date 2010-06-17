// t library

require('./vendor/underscore-min');

var sys = require('sys'),
	http = require('http'),
	fs = require('fs');

var DEBUG = false,
	ENCODING = 'utf-8',
	TEMPLATES_DIR = './templates';

process.addListener('SIGINT', function() {
	sys.puts('\nShutting down..');
	process.exit(0);
});

function parse(routes, url) {
	if(!routes) {
		throw Error('You need to provide some routes.')
	}
	
	for(var path in routes) {
		
		var regex = new RegExp(path, ''),
			matches = regex.exec(url);

		if(matches) {
			log('Route found! - '+ path);
			
			return {
				matches: matches,
				callback: routes[path]
			};
		}
	}
	
	log('Route not found - ' + url);
	return null;
}

function respond(res, body, contentType, status) {
	contentType = contentType || 'text/html';
	body = body || '';
	res.sendHeader(status || 200, {
		'Content-Length': body.length,
		'Content-Type' : contentType + '; charset=' + ENCODING
	});
	writeResponseBody(res, body);
	res.end();
}


function writeResponseBody(res, body) {
	res.write(body, ENCODING);
}

function respond404(res) {
	respond(res,'<h1>404 Not Found</h1>', 'text/html', 404);
}

function respond500(res, error){
	if(DEBUG)
		log(error);
		
	respond(res, '<h1>500 Internal Server Error</h1>', 'text/html', 500);
}

function log(arg) {
	if(!DEBUG)
		return;

	switch (typeof arg) {
		case 'object':
			var str = '';
			for (var k in arg) {
				str += k + ': ' + arg[k] + '\n';
			}
			sys.puts(str);
			
			break;
		default:
			sys.puts(arg);
	}
}

function handleResponse(req, res, conf) {
	var url = req.url;
	var mapping = parse(conf.routes, url);
	if (mapping) {
		
		var scope = {
			respond: respond,
			log: log
		};
		var args = [req, res].concat(mapping.matches.slice(1));
		var retur = mapping.callback.apply(scope, args); 
		switch(typeof retur) {
			case 'string':
			
				var templateName = retur + '.html',
					template = TEMPLATES_DIR + '/' + templateName;
					
				fs.readFile(template, function(err, data) {

					if(err) {
						log('Template missing - ' + retur + ' - ' + err);
						respond500(res, err);
					}
						
					try {
						respond(res, _.template(data.toString(), scope));
					}
					catch(err) {
						respond500(res, err);
					}
					
				});
				
				break;
			default:
				respond(res, JSON.stringify(retur));
				break;
		}
	}
	else {
		respond404(res);
	}
}

exports.app = function(conf){

	DEBUG = conf.debug || DEBUG;
	var port = conf.port || 8888;
	
	http.createServer(function(req, res) {
		
		try {
			handleResponse(req, res, conf);
		} 
		catch(e) {
			respond500(res, e);
		}
		
	}).listen(port);
	
	sys.puts('Starting server at http://127.0.0.1:' + port);
}
