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
	
    function url(route) {
        var args = [];
        for(var arg in arguments) {
            args.push(arguments[arg]);
        }
        return lookup.apply(this, [route].concat(args.slice(2)));
	}
	
	function link(route, linktext) {
        return '<a href="' + url(route) + '">' + linktext + '</a>';
	}
	
	global.link = link;
	global.url = url;
	
	function init(routes, resources) {
		if(!routes && !resources) {
			throw Error('You need to provide at minimum 1 route.')
		}
		routes = routes || {};
		compiledRoutes = {};
    	routesByName = {};
    	
    	/*
            list:       GET /resource/?
            get:        GET /resource/([^/]+)/?
            save:       POST /resource/?
            update:     PUT /resource/([^/]+)/?
            destroy:    DELETE /resource/?
	    */
    	for(var resource in resources) {
    	    
            var operations = resources[resource];
            for(var operation in operations) {
        
                var callback = operations[operation];
                var path = '^/' + resource + '/';
                var group = '([^\/]+)/?'
                
                switch(operation) {
                    case 'list':
                        path = 'GET ' + path + '?'; 
                        break;
                    case 'get':
                        path = 'GET ' + path; 
                        path += group;
                        break;
                    case 'save': 
                        path = 'POST ' + path + '?';  
                        break;
                    case 'update':
                        path = 'PUT ' + path; 
                        path += group;
                        break;
                    case 'destroy': 
                        path = 'DELETE ' + path + '?';
                        break;
                    default:
                        throw new Error('Unsupported resource operation');
                        break;
                }
                path += '$'
                routes[path] = callback;
            }
    	}
		
	    sys.puts('Serving routes:');
		for(var path in routes) {
			var route = routes[path];
		    prepare(route, path);
		    sys.puts('  ' + path)
		}
	}
	
	function prepare(route, path) {
	    
		var verb = 'GET';
		var httpVerbMatch = extractHttpVerb(path);
		if(httpVerbMatch) {
			verb = httpVerbMatch[1];
			path = path.substring(verb.length);
		}
		
		var name = extractName(route)
        mapName(name, path);
        
		compiledRoutes[verb + ' ' + path] = {
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
		parse : function(method, url) {
			
			for(var path in compiledRoutes) {
				var route = compiledRoutes[path];
				var matches = route.regex.exec(url);
				if(matches && method === route.verb) {
					
					log('Route found! - ' + route.verb + ' - '+ url);
					return {
						groups: matches,
						method: route.verb,
						callback: route.callback
					};
				}	
			}
			
			log('Route not found for - ' + method + ' ' + url);
			return null;
		},
		url: url
	};

})();

module.exports = router;