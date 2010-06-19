var log = require('./logger').log;

module.exports = (function() {
	var compiledRoutes = {};
	
	function init(routes) {
		if(!routes) {
			throw Error('You need to provide some routes.')
		}
		
		for(var path in routes) {
			var callback = routes[path];
			var verb = 'GET';
			var verbMatch = /^(GET|POST|PUT|DELETE|TRACE|CONNECT|HEAD|OPTIONS) .*/.exec(path);
			if(verbMatch) {
				verb = verbMatch[1];
				path = path.substring(verb.length);
			}
			
			compiledRoutes[path] = { 
				verb: verb,
				regex: new RegExp(path.trim(), ''),
				callback: callback
			};
		}
	}
	
	return {
		init : init,
		parse : function(url) {
			
			for(var path in compiledRoutes) {
				var route = compiledRoutes[path];
				var matches = route.regex.exec(url);
				if(matches) {
					
					log('Route found! - ' + route.verb + ' - '+ url);
					return {
						groups: matches,
						method: route.verb,
						callback: route.callback
					};
				}	
			}
			
			log('Route not found - ' + url);
			return null;
		}
	};

})();