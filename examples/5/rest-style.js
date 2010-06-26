var t = require('../../t');

t.app({
	debug: true,
	resources: {
	    blog: {
	        list: function(req, res) { res.respond('list') },
	        get: function(req, res, id) { res.respond('get ' + id) },
	        save: function(req, res, data) { res.respond('save ' + JSON.stringify(data)) },
	        update: function(req, res, data) { res.respond('update ' + JSON.stringify(data)) },
	        destroy: function(req, res, data) { res.respond('destroy ' + JSON.stringify(data)) }
	    }
	},
	routes: {
	    '^/$': function(req, res) {
	        return 'html';
	    },
	    '^/(js/.*)$': t.serve
	}
})