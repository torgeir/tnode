var t = require('../../t');

t.app({
	debug: true,
	routes: {
		'^/$': function(req, res) {
			return 'index';
		},
		'^/(web/js/.*)$' : t.serve, /* serves all files from web/js/ */
		'^/favicon\.ico$' : function(req, res) {
	        this.respond('Nothing to see here.');
	    }
	}
})