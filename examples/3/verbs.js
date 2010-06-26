var t = require('../../t');

t.app({
	debug: true,
	routes: {
		'^/$': function() {
			return 'form';
		},
		'POST /ionlyhandleposts': function(req, res, data) {
			res.respond('POST is ok ' + JSON.stringify(data));
		}
	}
})