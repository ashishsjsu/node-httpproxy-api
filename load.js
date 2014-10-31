var httpProxy = require('http-proxy');
var http = require('http');

var target;
var array = ["http://localhost:8001", "http://localhost:8002"] 

var proxy = httpProxy.createProxy();

		http.createServer(function (req, res) {
				
		Request = req;
		Response =  res;

		if(req.url === '/favicon.ico')
		{
			console.log("chutya favicon");
			res.end();
			return;
		}

		target = {target : array.shift()};
		console.log(array);
		console.log('forwarding request to: ', target.target);
			proxy.web(req, res, target);
			//console.log(target.target);
			array.push(target.target)
		console.log(array)
		
		

}).listen(8005);