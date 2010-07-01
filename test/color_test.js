var test = require('../lib/test'),
	color = require('../lib/color');
                                                  
with(test) {
	testcase('Color');
		
		test('should display terminal text in red', function() {
		    assertEquals("\u001B[31msome text\u001B[0m", color.red('some text'));
		});
	
		test('should display terminal text in green', function() {
		    assertEquals("\u001B[32msome other text\u001B[0m", color.green('some other text'));
		});
		
		test('should display terminal text in yellow', function() {
		    assertEquals("\u001B[33meven more text\u001B[0m", color.yellow('even more text'));
		});
	
	run();
}
