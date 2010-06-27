var t = require('../../t');

t.app({
	debug: true,
	routes: {
		'^/$' : function index(req, res) {
		    this.title = 'Welcome!'
		    this.name = 'Torgeir';
			return 'welcome';
		},
		'GET ^/hello/(\\w+)/?' : function hello(req, res, name) {
			res.respond([
			    '<h1>Again, welcome! ',
			    name,
			    ' this is raw html.. </h1><p>Try answering with ',
			    link('page', 'json too', 2),
			    '.</p><p>',
			    link('index', 'Back to /'),
			    '</p>'
			].join(''));
		},
		'^/page/(\\d+)/?$' : function page(req, res, page) {
			var json = { 
				page: page
			};
			return json;
		}
	}
});
