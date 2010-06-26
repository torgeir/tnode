var fs = require('fs'),
	log = require('./logger').log;

TEMPLATES_DIR = './templates';

var template = {
	find: function(name) {
		return TEMPLATES_DIR + '/' + name + '.html';
	},
	serve: function(name, callback) {
		var template = this.find(name);
		
		log('Serving template - ' + template)
		fs.readFile(template, function(error, data) {

			if(error) {
				throw error;
			}

			try {
				callback.call(this, data.toString());
			}
			catch(error) {
				throw error;
			}

		});
	}
};
module.exports = template;