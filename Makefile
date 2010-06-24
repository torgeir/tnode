test: make

make:
	node test/dispatcher_test.js
	node test/router_test.js
	node test/mime_test.js
	node test/template_test.js
	node test/responder_test.js
	node test/color_test.js
