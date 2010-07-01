var sys = require('sys'),
    p = sys.puts;
    color = require('./color'),
    log = require('./logger').log;
    
DEBUG = false;

/** AssertionError class */
var AssertionError = function(message) {
    this.message = message;
};         

/** Pending class */
var Pending = function() {
    
};

/** Status singleton */
var Status = {
    INIT: -1,
    DONE: 0,
    PENDING: 1,
    FAILED: 2,
    ERROR: 3,
    getStatusColor: function(status) {
        switch (status) {
            case Status.DONE:       return color.green;
            case Status.PENDING:    return color.yellow;
            default:                return color.red;
        }
    }
};
               




/** Test class */
var Test = function(name, block, async, testcase) {
    this.name = name;
    this.block = block;
    this.async = async || false;    
    this.status = Status.INIT;
    this.timeout = null;
    this.next = function() {};                
    this.testcase = testcase;
};                  

Test.prototype.printStatus = function() {
    var textColor = Status.getStatusColor(this.status);
    p(textColor('\t' + this.name)); 
};
Test.prototype.printError = function() {
    var error = this.error;
    if (error) {
        ['message', 'type', 'stack'].forEach(function(k) {
            if (error[k])
                p('\t  ' + error[k] + '\n');
        });
    }
};
Test.prototype.run = function(nextTestInvoker) {     
    var self = this;      
    
    this.invokeNextTest = function() {
        process.nextTick(nextTestInvoker);
    };
    
    try {                  
        if(this.async) {
            this.timeout = setTimeout(function() {
                self.handleResult(new AssertionError('Oups, test did never complete?'));
            }, 1000);
        }
        
        this.block.call(this, function(e) {
            self.handleResult(e);
        });                  
        
        if (!this.async) {
            this.handleResult();
        }             
        
    }
    catch (e) {       
        this.handleResult(e);
    }
};
Test.prototype.handleResult = function(error) {
    if (this.status != Status.INIT)
        return;

    clearTimeout(this.timeout);
    this.timeout = null;
                      
    this.status = Status.DONE;

    if (error) {                                        
        this.handleError(error);
    }
                           
    this.invokeNextTest();
};                             
Test.prototype.handleError = function(error) {
    if (error instanceof Pending) {
        this.status = Status.PENDING;
        this.error = error;
    }
    else if (error instanceof AssertionError) {
        this.testcase.passed = false;
        this.status = Status.FAILED;
        this.error = error;
    }
    else if (error instanceof Error) {
        this.testcase.passed = false;
        this.status = Status.ERROR;
        this.error = error;     
    }                               
};
        




/** Testcase class */
var Testcase = function(name, async) {
    this.name = name;
    this.async = async || false;
    this.tests = [];           
    this.passed = true;    
};                                   
Testcase.prototype.printSummary = function() {
    this.printStatus();
    this.tests.forEach(function(test) {
        test.printStatus();  
        test.printError();
    });
}
Testcase.prototype.printStatus = function() {
    if (this.passed) {
        p(color.green(this.name));
    } 
    else {
        p(color.red(this.name));
    }
};    
Testcase.prototype.run = function(nextTestcaseInvoker) {
    var self = this;                
    var testIndex = 0;
    (function runTests() {
        var test = self.tests[testIndex++];
        if (test) {                       
            test.run(function() {
                runTests.call(self);
            });
        }                      
        else {                         
            self.printSummary();           
            process.nextTick(nextTestcaseInvoker);
        }                                                                   
    })();
};            
         





var testcases = [];

var testlib = {
    asynctestcase: function(name) {
        testcases.push(new Testcase(name, true));
    },
    testcase: function(name) {
        testcases.push(new Testcase(name, false));
    }, 
    test : function(name, block) {
        var testcase = testcases[testcases.length - 1];
        testcase.tests.push(new Test(name, block, testcase.async, testcase));
    },
    run: function() {                      
        p('\nRunning tests');              

        var testcaseIndex = 0;       
        (function runTestCases() {         
            var testcase = testcases[testcaseIndex++];
            if (testcase) {                
                testcase.run(runTestCases);
            }
        })();
    },                     
    assertEquals: function(expected, actual, callback) {        
        if(!equals(expected, actual)) {
            var ex = expect(expected, actual);
            handleExpectedException(ex, callback);
        }
    },
    assertTrue: function(actual, callback) {
        this.assertEquals(true, actual, callback);
    },
    assertFalse: function(actual, callback) {
        this.assertEquals(false, actual, callback);
    },
    shouldThrow: function(f, args, scope, callback) {
        this.assertThrow(f, args, scope, callback, true);
    },
    shouldNotThrow: function(f, args, scope, callback) {
        this.assertThrow(f, args, scope, callback, false);
    },                 
    assertThrow: function(f, args, scope, callback, expectException) {
        var thrown = false;
        try {
            f.apply(scope || this, args);
        } catch (e) {
            thrown = true;
        }
                              
        var ex = null;
        if (thrown != expectException) {
            ex = new AssertionError(!thrown && expectException ? 'Exception expected, none thrown?' : 'Exception thrown, none expected?');               
        }
        handleExpectedException(ex, callback);
    },
    fail: function(msg, callback) {
        var ex =  new AssertionError(msg);
        handleExpectedException(ex, callback);
    },
    pending: function() {
        throw new Pending();
    }                                                               
};

function handleExpectedException(ex, callback) {
    if(callback) callback(ex);
    else throw ex;
}

function expect(expected, actual) {
    return new AssertionError([
        'Expected: ',
            color.bold(sys.inspect(expected)),
        ' but was: ',
            color.bold(sys.inspect(actual))
    ].join(''));
}

function equals(expected, actual) {
    return expected === actual;
}

module.exports = testlib;