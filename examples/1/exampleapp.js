var t = require('../../t');

t.app({
	debug: true,
	routes: {
		'^/$' : function(req, res) {
			res.respond('<h1>Welcome!</h1><p>Try <a href="/hello/you">this</a>, or <a href="/page/1">this</a>!');
		},
		'^/hello/([a-z]+)/?' : function(req, res, name) {
			this.name = name;
			return 'index';
		},
		'^/page/([0-9]+)/?$' : function(req, res, page) {
			var json = { 
				page: page
			};
			return json;
		}
	}
});