var test = require('../lib/test'),
	responder = require('../lib/responder');

DEBUG = true;

with(test) {
	testcase('Responder');
		
		test('should write responses to response object', function() {
		    var actualResponse,
		        actualEncoding;
		    var response = {
		        write: function(body, encoding) {
		            actualResponse = body;
		            actualEncoding = encoding;
		        },
		        writeHead: function() {},
		        end: function() {}
		    }
		    
	        responder.respond(response, 'response');
	        
			assertEquals('response', actualResponse);
			assertEquals('utf-8', actualEncoding);
		});
		
		test('should redirect', function() {
		    var actualStatus,
		        actualHeaders;
		    var response = {
		        writeHead: function(status, headers) {
		            actualStatus = status;
		            actualHeaders = headers;
		        },
		        end: function() {}  
		    };
		    
		    responder.redirect(response, 'http://fake.url');
		    
			assertEquals(302, actualStatus);
			assertEquals('http://fake.url', actualHeaders['Location']);
		});
		
		test('should send 404', function() {
		    var actualResponse,
		        actualStatus;
		    var response = {
		        write: function(body) {
		            actualResponse = body;
		        },
		        writeHead: function(status) {
		            actualStatus = status;
		        },
		        end: function() {}
		    }
		    
	        responder.respond404(response);
			assertEquals(404, actualStatus);
		    assertEquals('<h1>404 Not Found</h1>', actualResponse);
		});
		
		test('should send 500', function() {
		    var actualResponse,
		        actualStatus;
		    var response = {
		        write: function(body) {
		            actualResponse = body;
		        },
		        writeHead: function(status) {
		            actualStatus = status;
		        },
		        end: function() {}
		    }
		    
	        responder.respond500(response);
			assertEquals(500, actualStatus);
            assertEquals('<h1>500 Internal Server Error</h1>', actualResponse);
		});
		
		test('should serve files', function() {
		    pending();
		});
		
	run();
}