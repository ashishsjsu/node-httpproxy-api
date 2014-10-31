var arguments = process.argv.splice(2);
var httpProxy = require('http-proxy');
var http = require('http');
var crypto = require('crypto');

var target;
var latency;
var Request;
var Response;
var array;
var originalhash;
//target = {target : "http://localhost:8001"};

var ProxyConfig = require("./app/modules/proxyconfdb");
var mongoose = require("mongoose");
mongoose.connect("mongodb://ashishsjsu:ashishsjsu@novus.modulusmongo.net:27017/iQeg2igi");


ProxyConfig.find(function(err, dbobj){
	if(err)
		console.log(err)
	console.log("hahahah")
	array = dbobj[0].url;
	latency = dbobj[0].latency;
	originalhash = dbobj[0].hash;
});

var callback = function(){

	ProxyConfig.find(function(err, obj){
			if(err)
				console.log(err);
	
			var string = obj[0].url + obj[0].latency; 
			var newhash = crypto.createHash('md5').update(string, 'utf8').digest('hex');
	
			if(originalhash == newhash)
			{
			}
			else
			{
			originalhash = newhash;
			array = obj[0].url;
			latency = obj[0].latency;
			}
		
		});
}

var interval = setInterval(callback, 6000);


function latentProxy(req, res){
	setTimeout(function()
			{
				console.log('forwarding request with latency: ', target.target);
				proxy.web(req, res, target);
			}, latency);
}

var proxy = httpProxy.createProxy();

		http.createServer(function (req, res) {
				
		Request = req;
		Response =  res;

		req.socket.on("error", function(){
			console.log(err);
		});

		if(req.url === '/favicon.ico')
		{
			console.log("chutya favicon");
			res.end();
			return;
		}

		target = {target : array.shift()};
		console.log(array);
		if(latency > 0)
		{
			latentProxy(Request, Response);	
		}
		else
		{
    		console.log('forwarding request to: ', target.target);
			proxy.web(req, res, target);
			array.push(target.target)
			console.log(array)
		}
		

}).listen(8005);