var arguments = process.argv.splice(2);
var httpProxy = require('http-proxy'),
 	http = require('http'),
  	express = require('express'),
  	app = express(),
    bodyParser = require('body-parser'),
    Client = require('node-rest-client').Client;


var router = express.Router();
var target;
var targeturl;
var latency;
var Request;
var Response;
var errMsg=null;
var simpleproxyserver;
var loadbalancedserver;
var targetarray;





//configure app to use bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//configure app for cross-origin requests
app.all('*', function(req, res, next){

	console.log("In app all");
	if (!req.get('Origin')) return next();
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	if ('OPTIONS' == req.method) return res.sendStatus(200);
	next();
});


app.use('/proxyserver', router);

//app middleware
router.use(function(req, res, next){
	console.log("Proxyserver middleware...");
	next();
});


var ProxyConfig = require("./models/ProxyConfigModel");
var mongoose = require("mongoose");
var dbURI = "mongodb://ashishsjsu:ashishsjsu@novus.modulusmongo.net:27017/iQeg2igi";
mongoose.connect(dbURI);


	// CONNECTION EVENTS
	// When successfully connected
	mongoose.connection.on('connected', function () {
	  console.log('Mongoose default connection open to ' + dbURI);
	});
	 
	// If the connection throws an error
	mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
	});
	 
	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
	  console.log('Mongoose default connection disconnected');
	});


router.route('/createproxy')

	.post(function(req, res){

		targeturl  = req.body.targeturl;
		latency = req.body.latency;
		
		var portnumber = generatePortNumber();
		createProxyServer(portnumber);
		//res.json({msg : "Proxyserver running on port " + portnumber, port : portnumber});
		res.json({msg : "Proxyserver running on " + "54.183.158.108" + portnumber, port: "54.183.158.108" + portnumber});
	});


router.route('/createproxy/:config_id')

	
	.put(function(req, res){

		targeturl = req.body.targeturl;
		latency = req.body.latency;

		res.json({msg : "Configuration updated"})
	})

	.delete(function(req, res){

		if(simpleproxyserver === undefined)
		{
			console.log('Server not running');
		}
		else
		{ 	simpleproxyserver.close();	}

		res.json({msg : "Proxy stopped"});
	});


router.route('/createloadbalancer')
	
	.post(function(req, res){

		console.log("in /createloadbalancer");
		targetarray = req.body.targets;
		console.log(targetarray);

		var portnumber = generatePortNumber();
		createLoadBalancer(portnumber);
		res.json({msg : "Load balanced server running on port " + portnumber});

	});


app.listen(8006);
console.log("Listening on 8006");



function getProxyIP()
{
	var client = new Client();

	console.log("In getProxyIP");

	client.get('http://169.254.169.254/latest/meta-data/public-ipv4/', function(data, response){
		console.log(data);

		console.log(response);
	});

}


var loadProxy = httpProxy.createProxy();

function createLoadBalancer(portno){

	loadbalancedserver = http.createServer(function(req, res){

		if(req.url === '/favicon.ico')
		{
			console.log("favicon disabled");
			res.end();
			return;
		}


		loadtargets = {target: targetarray.shift()};

		loadProxy.web(req, res, loadtargets);

		targetarray.push(loadtargets.target);

	});

	loadbalancedserver.listen(portno);

	process.on('uncaughtException', function(err){
			if(err.errno === 'EADDRINUSE')
			{
				console.log("Port already in use");
			   errMsg = "Port already in use";
			}
			else{
					console.log("Exception happened");

			}
		});
	process.on('SIGINT', function() {
		console.log("Exiting..........");
  		server.close();
  	});

}


var proxy = httpProxy.createProxy();

function createProxyServer(portnumber){

	simpleproxyserver = http.createServer(function (req, res) {

		if(req.url === '/favicon.ico')
		{
			console.log("favicon disabled");
			res.end();
			return;
		}

		console.log(targeturl);
	
		//set the target for proxy
		target = {target : targeturl} 

		console.log("target: " +target);

		if(latency > 0)
		{
			setTimeout(function()
			{
				console.log('forwarding request with latency: ', target.target + "latency: " +latency);
				proxy.web(req, res, target);
			}, latency);
		}
		else
		{
    	 	console.log('forwarding request to: ', target.target);
			proxy.web(req, res, target);	
		}

	})

	simpleproxyserver.listen(portnumber);

		process.on('uncaughtException', function(err){
			if(err.errno === 'EADDRINUSE')
			{
				console.log("Port already in use");
			   errMsg = "Port already in use";
			}
			else{
					console.log("Exception happened");

			}
		});

		process.on('SIGINT', function() {
		console.log("Exiting..........");
  		server.close();
  	});


}//createProxyServer


function generatePortNumber()
{
	var proxyport = Math.floor(Math.random() * 16383) + 49152;
	return proxyport;
}

