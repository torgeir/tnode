test: make

make:
	node test/dispatcher_test.js
	node test/router_test.js
	node test/mime_test.js