var test = require('../lib/test'),
	router = require('../lib/router');

DEBUG = false;
with(test) {

	testcase('Router - routing');
		
		test('Without routes should throw exception', function() {
			shouldThrow(router.init, [], router);
		});
		
		test('With routes should not throw exception', function() {
			shouldNotThrow(router.init, [{ '/': function() {} }], router);
		});
		
		test('Should look up routes from simple urls', function() {
		   router.init({
		       '/': function() {}
		   });
		   var route = router.parse('GET', '/');
		   assertTrue(route.method == 'GET');
		   assertTrue(typeof route.callback == 'function');
		});
		
	    test('Should look up routes from complex urls', function() {
		   router.init({
		       '^/article/([0-9]+)/page/([a-z]+)$': function() {}
		   });
		   var route = router.parse('GET', '/article/1/page/j');
		   assertTrue(route.method == 'GET');
		   assertTrue(typeof route.callback == 'function');
		});
		
		test('Should look up urls by name and fill url parameters from arguments', function() {
		    router.init({
		        '/some/other/route': function() {},
		        '/article/([0-9]+)/': function articleByIndex() {},
		        '/another/route': function() {}
		    });
		    assertEquals('<a href="/article/1/">text</a>', link('articleByIndex', 'text', 1));
		});
		
		test('Should look up routes using simple params', function() {
		   pending();
		});
    
	testcase('Router - REST style routes');
	
        test('Should map resources to rest style routes - list: GET /resource/?', function() {
		    router.init({}, {
		        blog: { list: function() {} }
		    });
		    var list = router.parse('GET', '/blog');
            assertEquals('GET', list.method);
            assertEquals('function', typeof list.callback);  
        });
        
        test('Should map resources to rest style routes - get: GET /resource/([^\/]+)/?', function() {
		    router.init({}, {
		        blog: { get: function() { } }
		    });
            var get = router.parse('GET', '/blog/1');
            assertEquals('1', get.groups[1]);
            assertEquals('GET', get.method);
            assertEquals('function', typeof get.callback);
        });
        
		test('Should map resources to rest style routes - save: POST /resource/?', function() {
		    router.init({}, {
		        blog: { save: function() {} }
		    });
            var save = router.parse('POST', '/blog');
            assertEquals('POST', save.method);
            assertEquals('function', typeof save.callback);
        });
        
		test('Should map resources to rest style routes - update: PUT /resource/([^\/]+)/?', function() {
		    router.init({}, {
		        blog: { update: function() {} }
		    });
            var update = router.parse('PUT', '/blog/1');
            assertEquals('1', update.groups[1]);
            assertEquals('PUT', update.method);
            assertEquals('function', typeof update.callback);
        });
        
		test('Should map resources to rest style routes - destroy: DELETE /resource/?', function() {
		    router.init({}, {
		        blog: { destroy: function() {} }
		    });
            var destroy = router.parse('DELETE', '/blog');
            assertEquals('DELETE', destroy.method);
            assertEquals('function', typeof destroy.callback);
        });        
        
		test('Should throw error on undefined resource opereation', function() {
		    shouldThrow(router.init, [{}, {
		        blog: { undefinedResourceType: function() {} }
		    }], router);
        });

	run();
}