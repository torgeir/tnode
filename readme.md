tnode
===

tnode is yet another node.js web application framework!

The coolest features of tnode is probably the **regex** and **rest-style routing** accompanied by **[jade](http://github.com/masylum/jade) templates** supporting both **partials** and site-wide **layouts**. tnode also comes with a testing framework (whose syntax is highly inspired by that of [djangode](http://github.com/simonw/djangode/)) complete with asynchronous test support.


## Usage:

### Getting started

    $ git clone git://github.com/torgeir/tnode.git && cd tnode
    $ git submodule update --init --recursive
                                                                                       
### Running the examples

tnode comes with examples describring most of its functionality, located in the `examples/` folder. Each example can be started independently from their respective folder using `node the_example.js`. E.g.

    $ cd examples/1/ && node exampleapp.js

Now, visit http://localhost:8888/
                                            
## Tests                                    

At this point no test-runner exists, but I would reckon something like the following should work

    $ cd test/ && for test in $(ls *.js); do node $test; done;

## Can't wait to see an app using tnode?

This is it!

    // app.js
    var t = require('lib/tnode/t');
    t.app({
	  routes: {
		'/': function(req, res) {
		  res.respond('Yeah!');
	    }
	  }
	}).listen(8888);

Easy, aye? Run it using
                           
    $ node app.js

## Now, go have fun!