var sys = require('sys');

var logger = { 
	log: function (arg) {
		if(!!!DEBUG)
			return;
			
		var now = new Date();
	   	switch (typeof arg) {
	    	case 'object':
	    		var str = '';
	    		for (var k in arg) str += k + ': ' + arg[k] + '\n';
	    		sys.puts(now + ' ' + str);
    
	    		break;
	    	default:
	    		sys.puts(now + ' ' + arg);
	    }
	}
};

module.exports = logger;