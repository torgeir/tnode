require('../vendor/underscore');

var fs = require('fs'),
	log = require('./logger').log;

var TEMPLATES_DIR = './templates';

module.exports = {
	find: function(name) {
		return TEMPLATES_DIR + '/' + name + '.html';
	},
	serve: function(res, name, scope, callback) {
		var template = this.find(name);
		
		log('Serving template - ' + template)
		fs.readFile(template, function(error, data) {

			if(error) {
				throw error;
			}

			try {
				callback.call(this, _.template(data.toString(), scope));
			}
			catch(error) {
				throw error;
			}

		});
	}
};