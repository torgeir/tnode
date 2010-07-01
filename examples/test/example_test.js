var testlib = require('../../lib/test');
var sys = require('sys');

DEBUG = true;

with(testlib) {
    
	testcase('Test lib - synchronous tests');
		
		test('should work', function() {
		    assertTrue(true);
		});
	
	    test('should be able to make sync tests pending', function(done) {
            pending();
		});
		
		test('should be able to fail', function() {
		    assertFalse(true);
		});
	
	asynctestcase('Test lib - asynchronous tests');

	    test('should fail as test async never calls completes (calls done)', function() {
		    setTimeout(function() {
		        assertTrue(true);
		    }, 100);
		});                                     
    	
		test('should complete as async test calls done', function(done) {
		    setTimeout(function() {
		        done();
		    }, 0);
		});
  
    	test('should not call done twice on assertion failure', function(done) {
		    setTimeout(function() {
		        assertTrue(false, done);
		        done();
		    }, 300);
		});
	    
		test('should be able to make async tests pending', function(done) {
            pending();
		});
	
		test('should not fail as done is called', function(done) {        
		    setTimeout(function() {
		        assertTrue(true, done);
		        done();
		    }, 300);
		});
		
		test('should fail as it times out', function(done) {
		    setTimeout(function() {
		        done();
		    }, 1001);
		});       
		  
        test('should work with asserting thrown exceptions', function(done) {
            shouldThrow(function() { throw "win" }, [], global, done);
        });

        test('should work with asserting not thrown exceptions', function(done) {
            shouldNotThrow(function() { /* win */  }, [], global, done);
        });

	run();
}
