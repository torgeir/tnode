var test = require('../lib/test'),
	  responder = require('../lib/responder');
             
with(test) {
	testcase('Responder');
		
		test('Should write responses to response object', function() {
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
		
		test('Should redirect', function() {
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
		
		test('Should send 404', function() {
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
		
		test('Should send 500', function() {
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
		               
    
	asynctestcase('Responder - async')
	
    test('Should serve files', function(done) {                                       
      responder.respond = function(res, data) {
        assertEquals('some text', data, done);
        done();
      }
      responder.serveFile({}, {}, 'files/text.txt');
    });                     
    
    test('Should serve parial templates', function(done) {                                       
      responder.respond = function(res, data) {
        assertEquals('<div>test</div><p>content</p>', data, done);
        done();
      }
      responder.template({}, 'template', {
        scope: {
          title: 'test'
        }
      });
    });
     
    test('Should serve layout templates', function(done) {                                       
      responder.respond = function(res, data) {
        assertEquals('<html><head></head><body><div><div>test</div><p>content</p></div></body></html>', data, done);
        done();
      }
      responder.template({}, 'template', {
        scope: {              
          layout: true
        }
      });
    });
 
    test('Should respond with json', function(done) {
      var o = { key: 'value' };               
      responder.respond = function(res, json) {
        assertEquals('{"key":"value"}', json, done);
        done();
      }
      responder.json({}, o);
    });
 
     
	run();
}