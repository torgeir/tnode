var log = require('./logger').log;
var sys = require('sys')

var router = (function() {
    
	var compiledRoutes = {};
	var routesByName = {};
	
	function lookup() {
	    var num = 0,
	        args = arguments,
	        route = routesByName[args[0]];
	    return route ? route.replace(/\([^\)]+?\)+/g, function() {
	        return args[++num] || '';
	    }) : '';
	}
	
    function url(route, linktext) {
        var args = [];
        for(var arg in arguments) {
            args.push(arguments[arg]);
        }
        return '<a href="' + lookup.apply(this, [route].concat(args.slice(2))) + '">' + linktext + '</a>';
	}
	
	global.url = url;
	
	function init(routes) {
		if(!routes) {
			throw Error('You need to provide some routes.')
		}
		
		for(var path in routes) {
			var route = routes[path];
		    prepare(path, route);
		}
	}
	
	function prepare(path, route) {
	    
		var verb = 'GET';
		var httpVerbMatch = extractHttpVerb(path);
		if(httpVerbMatch) {
			verb = httpVerbMatch[1];
			path = path.substring(verb.length);
		}
		
		var name = extractName(route)
        mapName(name, path);
        
		compiledRoutes[path] = {
		    name: name,
			verb: verb,
			regex: new RegExp(path.trim(), ''),
			callback: route[name] || route
		};
	}
	
	function extractHttpVerb(path) {
	    return /^(GET|POST|PUT|DELETE|TRACE|CONNECT|HEAD|OPTIONS) .*/.exec(path);
	}
	
	function mapName(name, path) {
        routesByName[name] = path.trim()
                                .replace(/^(\^)/, '')
                                .replace(/\$$/, '')
                                .replace(/\?/g, '')
                                .replace(/\+/g, '')
                                .replace(/\*/g, '');
	}
	
	function extractName(route) {
	    var functionNameMatch = /function ([^\(]+)/.exec(route.toString());;
	    return functionNameMatch ? functionNameMatch[1] : undefined; 
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
			
			log('Route not found for url - ' + url);
			return null;
		},
		url: url
	};

})();

module.exports = router;