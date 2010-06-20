var sys = require('sys');

if(typeof DEBUG)
	DEBUG = false;

var logger = { 
	log: function (arg) {
		if(!!!DEBUG)
			return;
			
		var now = new Date();
	   	switch (typeof arg) {
	    	case 'object':
	    		var str = '';
	    		for (var k in arg) str += k + ': ' + arg[k] + '\n';
	    		logger.print(now + ' ' + str);
    
	    		break;
	    	default:
	    		logger.print(now + ' ' + arg);
	    }
	},
	print: function(str) {
		sys.puts(str);
	}
};

module.exports = logger;