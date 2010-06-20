require('../vendor/underscore-min');

var url = require('url'),
	fs = require('fs'),
	responder = require('./responder'),
	template = require('./template'),
	router = require('./router'),
	log = require('./logger').log,
	mime = require('./mime');

var dispatcher = {
	init : function(conf) {
		router.init(conf.routes);
	},
	process : function(req, res) {

		var path = url.parse(req.url).pathname;
		var mapping = router.parse(path);

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
			var user = {
				scope: {
					partial: function (name, userScope) {
						return _.template(fs.readFileSync(template.find(name), 'utf-8'), userScope || user.scope);
					},
					log: log
				}
			}		
				
			var userArguments = [req, res].concat(mapping.groups.slice(1));
			var retur = mapping.callback.apply(user.scope, userArguments); 
		
			switch(typeof retur) {
				case 'string':
					template.serve(res, retur, function(html) {
						responder.respond(res, _.template(html, user.scope));
					});
					break;
				case 'object':
					responder.respond(res, JSON.stringify(retur));
					break;
				default:
					return;
			}
		}
		else {
			responder.respond404(res);
		}
	}
};

module.exports = dispatcher;