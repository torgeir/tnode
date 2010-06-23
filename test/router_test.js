var test = require('../lib/test'),
	router = require('../lib/router');

DEBUG = true;

with(test) {

	testcase('Router');
		
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
		   var route = router.parse('/');
		   assertTrue(route.method == 'GET');
		   assertTrue(typeof route.callback == 'function');
		});
		
	    test('Should look up routes from complex urls', function() {
		   router.init({
		       '^/article/([0-9]+)/page/([a-z]+)$': function() {}
		   });
		   var route = router.parse('/article/1/page/j');
		   assertTrue(route.method == 'GET');
		   assertTrue(typeof route.callback == 'function');
		});
		
		test('Should look up urls by name and fill url parameters from arguments', function() {
		    router.init({
		        '/some/other/route': function() {},
		        '/article/([0-9]+)/': function articleByIndex() {},
		        '/another/route': function() {}
		    });
		    assertEquals('<a href="/article/1/">text</a>', url('articleByIndex', 'text', 1));
		});
		
	run();
}