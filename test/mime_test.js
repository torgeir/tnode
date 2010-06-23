var test = require('../lib/test'),
	mime = require('../lib/mime');

DEBUG = true;

with(test) {
	testcase('Mime type should be resolved from file extension');
		
		test('File extension .js should result in mime type text/ecmascript', function() {
			assertEquals('text/ecmascript', mime.lookup('.js'));
		});
		
		test('File extension .css should result in mime type text/css', function() {
		    assertEquals('text/css', mime.lookup('.css'));
		});
		
	run();
}