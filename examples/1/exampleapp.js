var t = require('../../t');

t.app({
	debug: true,
	routes: {
		'^/$' : function index(req, res) {
			res.respond([
			    '<h1>Welcome!</h1><p>Try ',
			    url('hello', 'this', 'you'),
			    ', or ',
			    url('page', 'this', 2),
			    '!'
			].join(''));
		},
		'GET ^/hello/([a-z]+)/?' : function hello(req, res, name) {
			this.name = name;
			return 'index';
		},
		'^/page/([0-9]+)/?$' : function page(req, res, page) {
			var json = { 
				page: page
			};
			return json;
		}
	}
});
