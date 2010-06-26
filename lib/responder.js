var fs = require('fs'),
	mime = require('./mime'),
	log = require('./logger').log;

var responder = (function() {
	
	function respond(res, body, contentType, status, encoding) {
		contentType = contentType || 'text/html';
		body = body || '';
		encoding = encoding || 'utf-8';
		res.writeHead(status || 200, {
			'Content-Length': (encoding === 'utf-8')
                ? encodeURIComponent(body).replace(/%../g, 'x').length
                : body.length,
			'Content-Type' : contentType + '; charset=' + encoding
		});
		res.write(body, encoding);
		res.end();
	}
	
	function redirect(res, location, encoding) {
		log('Redirecting - ' + location)
		encoding = encoding || 'utf-8'
		res.writeHead(302, {
			'Content-Type' : 'text/html; charset=' + encoding,
			'Location' : location
		});
		res.end();
	}

	function respond404(res) {
		respond(res,'<h1>404 Not Found</h1>', 'text/html', 404);
	}

	function respond500(res, error){
		log('Responding 500 - ' + error);
		respond(res, '<h1>500 Internal Server Error</h1>', 'text/html', 500);
	}

	function serveFile(req, res, file) {
		var contentType = mime.lookup(file.substring(file.lastIndexOf('.')));
		var encoding = (contentType.slice(0,4) === 'text') ? 'utf-8' : 'binary';
		fs.readFile(file, encoding, function(error, data) {

			if(error) {
				log('Error serving file - ' + file);
				return respond404(res);
			}

			log('Serving file - ' + file);
			respond(res, data, contentType, 200, encoding);
		});
		
	}
	return {
		respond: respond,
		redirect: redirect,
		respond404: respond404,
		respond500: respond500,
		serveFile: serveFile
	};

})();

module.exports = responder;