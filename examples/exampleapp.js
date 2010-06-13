var t = require('../t');

t.app({
	debug: true,
	routes: {
		'^/$' : function(req, res) {
			this.respond(res, 'Welcome! Try <a href="/hello/you">this</a>, or <a href="/page/1/">this</a>!');
		},
		'^/hello/([a-zA-Z]+)' : function(req, res, name) {
			this.name = name;
			return 'hello';
		},
		'^/page/([0-9]+)/?$' : function(req, res, page) {
			var json = { 
				page: page
			};
			return json;
		}
	}
})