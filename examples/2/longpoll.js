var t = require('../../t'),
	events = require('events');

var bus = new events.EventEmitter(),
	MESSAGE_EVENT = 'message_event';

t.app({
	debug: true,
	routes: {
		'^/wait$' : function(req, res) {
			bus.addListener(MESSAGE_EVENT, function(msg) {
				res.respond(msg);
			})
		},
		'^/done/(.*)$' : function(req, res, msg) {
			bus.emit(MESSAGE_EVENT, msg);
			res.respond('done');
		}
	}
}).listen(8888);