var test = require('../lib/test'),
	template = require('../lib/template');

DEBUG = true;

with(test) {
	testcase('Template');
		
		test('should look up templates names', function() {
		    assertEquals('./templates/template.html', template.find('template'));
		});
	
		test('should serve templates', function() {
		    pending();
		});
	
	run();
}