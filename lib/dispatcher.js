require('../vendor/underscore/underscore-min');

var url = require('url'),
	fs = require('fs'),
	querystring = require('querystring'),
	responder = require('./responder'),
	template = require('./template'),
	router = require('./router'),
	log = require('./logger').log,
	mime = require('./mime');

var dispatcher = (function() {
    
    function doRespond(res, callback, user, userArguments) {
        
		var retur = callback.apply(user.scope, userArguments); 

		switch(typeof retur) {
			case 'string':
		
				template.serve(retur, function(html) {
				    var body = _.template(html, user.scope),
				        title = user.scope.title;
			        
				    fs.stat(TEMPLATES_DIR + '/layout.html', function(err, stats) {
				        if(err && err.errno != 2) { // 2 => no such file
				            throw err;
				        }
				        
				        if(user.scope.layout && stats && stats.isFile()) {
				            template.serve('layout', function(layout) {
				                responder.respond(res, _.template(layout, { 
				                    body: body,
				                    title: title,
				                    partial: user.scope.partial
				                }));
				            })
				        }
				        else {
					        responder.respond(res, body);
				        }
				    });
				});
				break;
			case 'object':
				responder.respond(res, JSON.stringify(retur));
				break;
			default:
				return;
		}
	}
	
	function extractData(req, callback) {
	    var data = '';
	    req.addListener('data', function(chunk) {
            data += chunk;
        });
        req.addListener('end', function() {
            callback(querystring.parse(url.parse('http://fake/?' + data).query));
        });
	}
	
	function process(req, res) {
		
		var path = url.parse(req.url).pathname;
		var mapping = router.parse(req.method, path);

		if (mapping && 
				(mapping.method == req.method || req.method == 'HEAD')) {
		
			res.respond = function(body, contentType, status) {
				responder.respond(res, body, contentType, status);
			};
			res.redirect = function(location) {
				responder.redirect(res, location);
			};
			res.respond404 = function() {
				responder.respond404(res);
			};
			res.respond500 = function(error) {
				responder.respond500(res, error);
			};
			req.isAjax = function() {
			    return 'x-requested-with' in req.headers && req.headers['x-requested-with'].toLowerCase() === 'xmlhttprequest';
			}
			var user = {
				scope: {
				    layout: true,
					partial: function (name, userScope) {
						return _.template(fs.readFileSync(template.find(name), 'utf-8'), userScope || user.scope);
					},
					log: log
				}
			}		
			
			if(req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE') {
		        extractData(req, function(data) {
                    doRespond(res, mapping.callback, user, [req, res, data]);
		        });
		    }
		    else {
		        doRespond(res, mapping.callback, user, [req, res].concat(mapping.groups.slice(1)));
		    }
			
		}
		else {
			responder.respond404(res);
		}
	}
	
	return {
		init : function(conf) {
			router.init(conf.routes, conf.resources);
		},
		process : function(req, res) {
		    if(DUMP_HEADERS) {
		        log(req.headers)
		    }
			try {
				process(req, res);
			} 
			catch(e) {
				responder.respond500(res, e);
			}
		}
	};
})();
	
module.exports = dispatcher;