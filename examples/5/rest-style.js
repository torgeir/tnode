var t = require('../../t');

t.app({
	debug: true,
	resources: {
	    blog: {
	        list: function(req, res) {
	            res.respond('<h1>It works!</h1>');
	        }
	    }
	}
})