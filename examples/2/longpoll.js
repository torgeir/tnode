var t = require('../../t'),
	events = require('events');
	
var bus = new events.EventEmitter(),
	MESSAGE_EVENT = 'message_event';

t.app({
	debug: true,
	routes: {
		'^/wait$' : function(req, res) {
			var self = this;
			bus.addListener(MESSAGE_EVENT, function(msg) {
				self.respond(res, msg);
			})
		},
		'^/done/(.*)$' : function(req, res, msg) {
			bus.emit(MESSAGE_EVENT, msg);
			this.respond(res, 'done');
		}
	}
});