// t library

require('./vendor/underscore-min');

var sys = require('sys'),
	http = require('http'),
	fs = require('fs'),
	url = require('url'),
	querystring = require("querystring");

var ENCODING = 'utf-8',
	TEMPLATES_DIR = './templates';
	
	

exports.app = function(conf) {
	
	var DEBUG = conf.debug;
	
	function log(arg) {
		if(!!!DEBUG)
			return;

		switch (typeof arg) {
			case 'object':
				var str = '';
				for (var k in arg) str += k + ': ' + arg[k] + '\n';
				sys.puts(str);

				break;
			default:
				sys.puts(arg);
		}
	};


	var router = (function() {
		var compiledRoutes = (function(routes) {
			if(!routes) {
				throw Error('You need to provide some routes.')
			}
			
			var compiled = {};
			for(var path in routes) {
				
				var callback = routes[path];
				var verb = 'GET';
				var verbMatch = /^(GET|POST|PUT|DELETE|TRACE|CONNECT|HEAD|OPTIONS) .*/.exec(path);
				if(verbMatch) {
					verb = verbMatch[1];
					path = path.substring(verb.length);
				}
				
				compiled[path] = { 
					verb: verb,
					regex: new RegExp(path.trim(), ''),
					callback: callback
				};
			}
			
			return compiled;
		})(conf.routes);

		return {
			parse : function(url) {
				
				for(var path in compiledRoutes) {
					var route = compiledRoutes[path];
					
					var matches = route.regex.exec(url);
					if(matches) {
						
						log('Route found! - ' + route.verb + ' - '+ url);
						return {
							groups: matches,
							method: route.verb,
							callback: route.callback
						};
					}	
				}
				
				log('Route not found - ' + url);
				return null;
			}
		};

	})();

	var templates = {
		find: function(name) {
			return TEMPLATES_DIR + '/' + name + '.html';
		},
		serve: function(res, name, scope, callback) {
			fs.readFile(this.find(name), function(error, data) {

				if(error) {
					log('Template missing - ' + name + ' - ' + error);
					responder.respond500(res, error);
				}

				try {
					responder.respond(res, _.template(data.toString(), scope));
				}
				catch(error) {
					responder.respond500(res, error);
				}

			});
		}
	};
	

	var responder = (function() {
		
		function respond(res, body, contentType, status) {
			contentType = contentType || 'text/html';
			body = body || '';
			res.sendHeader(status || 200, {
				'Content-Length': body.length,
				'Content-Type' : contentType + '; charset=' + ENCODING
			});
			res.write(body, ENCODING);
			res.end();
		}
		
		function redirect(res, location) {
			res.sendHeader(302, {
				'Content-Type' : 'text/html; charset=' + ENCODING,
				'Location' : location
			});
			res.end();
		}

		function respond404(res) {
			respond(res,'<h1>404 Not Found</h1>', 'text/html', 404);
		}

		function respond500(res, error){
			if(DEBUG)
				log(error);

			respond(res, '<h1>500 Internal Server Error</h1>', 'text/html', 500);
		}
	
		function handle(req, res, conf) {

			var path = url.parse(req.url).pathname;
			var mapping = router.parse(path);
			
			if (mapping && mapping.method == req.method) {
				
				var scope = {
					respond: respond,
					redirect: redirect,
					respond404: respond404,
					respond500: respond500,
					partial: function (name, scope) {
						return _.template(fs.readFileSync(templates.find(name), ENCODING), scope || user.scope);
					},
					log: log
				};
				
				var userArguments = [req, res].concat(mapping.groups.slice(1));
				var retur = mapping.callback.apply(scope, userArguments); 
				
				switch(typeof retur) {
					case 'string':
						templates.serve(res, retur, scope);
						break;
					case 'object':
						respond(res, JSON.stringify(retur));
						break;
					default:
						break;
				}
				
			}
			else {
				respond404(res);
			}
		}

		return {
			respond: respond,
			respond404: respond404,
			respond500: respond500,
			handle: handle
		};

	})();

	var port = conf.port || 8888;
	
	http.createServer(function(req, res) {

		try {
			responder.handle(req, res, conf);
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