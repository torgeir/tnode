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
		
		
		test('Should match routes for all http verbs', function() {
		  router.init({
		    'GET /1': function() {},
		    'POST /2': function() {},
		    'PUT /3': function() {},
		    'DELETE /4': function() {},
		    'OPTIONS /5': function() {},
		    'HEAD /6': function() {},
		    'TRACE /7': function() {},
		    'CONNECT /8': function() {}
		  });           
		  assertEquals('GET',     router.parse('GET', '/1').method);
		  assertEquals('POST',    router.parse('POST', '/2').method);
		  assertEquals('PUT',     router.parse('PUT', '/3').method);
		  assertEquals('DELETE',  router.parse('DELETE', '/4').method);
		  assertEquals('OPTIONS', router.parse('OPTIONS', '/5').method);
		  assertEquals('HEAD',    router.parse('HEAD', '/6').method);
		  assertEquals('TRACE',   router.parse('TRACE', '/7').method);
		  assertEquals('CONNECT', router.parse('CONNECT', '/8').method);
		});
  
	testcase('Router - REST style routes');
	
    test('Should support duplicate routes with different http verbs', function() {
      router.init({
        'GET /': function getRoute() {},
        'POST /': function postRoute() {}
      });
      assertEquals('getRoute', router.parse('GET', '/').name);
      assertEquals('postRoute', router.parse('POST', '/').name);
    });
	
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