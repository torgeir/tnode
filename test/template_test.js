var test = require('../lib/test'),
	template = require('../lib/template');
                     
with(test) {
	asynctestcase('Template');
		
		test('should look up templates names', function(done) {
		    assertEquals('./templates/template.html', template.find('template'));
		    done();
		});
	
		test('should serve templates\' content', function(done) {
		  template.serve('template', function(content) {
		    assertEquals('div test\np content', content, done);
        done();
		  });
		});
	
	run();
}