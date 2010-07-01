var test = require('../lib/test'),
	dispatcher = require('../lib/dispatcher');

with(test) {
	testcase('Dispatcher');
		
		test('Should write responses to response object for normal routes', function() {
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
                writeHead: function() {},
                write: function(body) {
                    response = body;
                },
                end: function() {}
            });
            assertEquals('test', response);
		});		
		
		test('Should write responses to response object for resource routes', function() {
		    dispatcher.init({
	    	    resources: {
                    blog: { 
                        list: function(req, res) { res.respond('content'); }
                    }
                }
		    });
		    var response;
            dispatcher.process({
                url: '/blog/',
                method: 'GET'
            }, {
                writeHead: function() {},
                write: function(body) {
                    response = body;
                },
                end: function() {}
            });
            assertEquals('content', response);
		});
        
        
	run();
}