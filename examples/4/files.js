var t = require('../../t');

t.app({
	debug: true,
	routes: {
		'^/$': function(req, res) {
			res.template('index');
		},
		'^/(web/.*)$' : t.serve, /* serves all files from web/ */
		'^/favicon\.ico$' : function(req, res) {
	        res.respond('Nothing to see here.');
	    }
	}
})