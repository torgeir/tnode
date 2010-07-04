require('../vendor/underscore/underscore-min');

var url = require('url'),
	fs = require('fs'),
	querystring = require('querystring'),
	responder = require('./responder'),
	template = require('./template'),
	jade = require('../vendor/jade/lib/jade'),
	router = require('./router'),
	log = require('./logger').log,
	mime = require('./mime');

DUMP_HEADERS = false;

var dispatcher = (function() {
    
    function callUserCallback(res, callback, user, userArguments) {
        callback.apply(user.scope, userArguments); 
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
		
			var user = {
				scope: {
				    layout: true,
					partial: function (name, userScope) {
                        return jade.render(fs.readFileSync(template.find(name), 'utf-8'), { 
                            locals: userScope || user.scope 
                        });
					},
					log: log
				}
			}		
			
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
			res.json = function(obj) {
			    responder.json(res, obj);
			};
			res.template = function(name) {
			    responder.template(res, name, user);
			};
			req.isAjax = function() {
			    return 'x-requested-with' in req.headers && req.headers['x-requested-with'].toLowerCase() === 'xmlhttprequest';
			};
						
			if(req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE') {
		        extractData(req, function(data) {
                    callUserCallback(res, mapping.callback, user, [req, res, data]);
		        });
		    }
		    else {
		        callUserCallback(res, mapping.callback, user, [req, res].concat(mapping.groups.slice(1)));
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