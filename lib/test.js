var sys = require('sys'),
    p = sys.puts;
    color = require('./color'),
    log = require('./logger').log;

var AssertionError = function(msg) { this.msg = msg; };
var Pending = function() {};

var testcases = [];

var testlib = {
    testcase: function(name) {
        testcases.unshift({ 
            name: name,
            tests: []
        });
    }, 
    test : function(name, body) {
        testcases[0].tests.push({
            name: name,
            body: body
        });
    },
    pending: function() {
        throw new Pending();
    },
    run: function() {
        var count = 0,
            failed = 0,
            errors = 0,
            pending = 0;
        
        p('Running tests');
        testcases.forEach(function(testcase) {
            
            var didFail = false;
            var status = [];
            
            testcase.tests.forEach(function(test) {
                count++;
                
                try {
                    test.body.call(this);
                    status.push(color.green(test.name));
                }
                catch(e) {
                    
                    if(e instanceof Pending) {
                        pending++;
                        status.push(color.yellow('Pending: ' + test.name))
                    }
                    else {
                        didFail = true;                    
                        status.push(color.red(test.name));
                    
                        if(e instanceof AssertionError) {
                            failed++;
                            status.push(e.msg)
                        }
                        else {
                            errors++;
                        
                            if (e.type) {
                                status.push(e.type);
                            }
                            if(e.stack) {
                                status.push(e.stack)
                            }
                        }
                    }
                }
               
            });
            
            if(didFail) {
                p(color.red(testcase.name));
            }
            else {
                p(color.green(testcase.name));
            }
            status.forEach(function(status) {
                p('  ' + status);
            });
        });
        
        p('\nTotal: ' + count + ', Failures: ' + failed + ', Errors: ' + errors + ', Pending: ' + pending);
    },
    
    assertEquals: function(expected, actual) {        
        if(!equals(expected, actual)) {
            expect(expected, actual);
        }
    },
    assertTrue: function(actual) {
        this.assertEquals(true, actual);
    },
    assertFalse: function(actual) {
        this.assertEquals(false, actual);
    },
    shouldThrow: function(f, args, scope) {
        var passed = false;
        try {
            f.apply(scope || this, args);
        } catch (e) {
            passed = true;
        }

        if (!passed) {
            throw new AssertionError('Exception expected, none thrown?');
        }
    },
    shouldNotThrow: function(f, args, scope) {
        var passed = true;
        try {
            f.apply(scope || this, args);
        } catch (e) {
            passed = false;
        }

        if (!passed) {
            throw new AssertionError('Exception thrown, none expected?');
        }
    },
    fail: function(msg) {
        throw new AssertionError(msg);
    }
}

function expect(expected, actual) {
    throw new AssertionError([
        'Expected: ',
            sys.inspect(expected),
        ' but was: ',
            sys.inspect(actual)
    ].join(''));
}

function equals(expected, actual) {
    return expected === actual;
}

module.exports = testlib;