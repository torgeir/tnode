var test = require('../lib/test'),
	dispatcher = require('../lib/dispatcher');

DEBUG = true;

with(test) {
	testcase('Dispatcher');
		
		test('Should write responses to response object', function() {
		    dispatcher.init({
	    	    routes: {
                    '/': function(req, res) { res.respond('test'); }
                }
		    });
		    var response;
            dispatcher.process({
                url: '/',
                method: 'GET'
            }, {
                sendHeader: function() {},
                write: function(body) {
                    response = body;
                },
                end: function() {}
            });
            assertEquals('test', response);
		});
		
        test('Should respond with templates when user returns string', function() {
            pending();
        });
        
	run();
}