//var arguments = process.argv.splice(2);

//call the packages we need
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser');

var crypto = require('crypto');

var port = process.env.port || 8080; 

//configure app to use bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//connect to database
var ProxyConfig = require(".app/modules/proxyconfdb");
var mongoose = require("mongoose");
mongoose.connect("mongodb://ashishsjsu:ashishsjsu@novus.modulusmongo.net:27017/iQeg2igi");

//Routes for our API
var router = express.Router();

router.use(function(req, res, next){

	console.log("Something is happening...");
	next();
});


router.route('/simpleproxy')

	//post configuration parameters
	.post(function(req, res){

		var proxydb = new ProxyConfig;
		var targetserver = req.body.targetserver;
		var client = req.body.clientname;
		
		//proxydb.url = targetserver;
		proxydb.url.push(targetserver);
		proxydb.client = client;
		proxydb.latency = req.body.latency;

		var string = req.body.targetserver + req.body.latency;
		console.log(string)
		var hashed = crypto.createHash('md5').update(string, 'utf8').digest('hex')
			console.log(hashed);
		proxydb.hash = hashed;

		proxydb.save(function(err){
			if(err) throw err;

		res.json({ message : "Target added"})			
	    });
		console.log(targetserver)
		//res.json({ message : "Target added"})
	})

	//update configuration parameters
	.put(function(req, res){
		ProxyConfig.findOne({"client":"ME"}, function(err, proxydb){

			if(err)
				res.send(err)
			//proxydb.url = req.body.targetserver;
			proxydb.url.push(req.body.targetserver);
			proxydb.latency = req.body.latency;

			var string = req.body.targetserver + req.body.latency;
			var hashed = crypto.createHash('md5').update("ashish", 'utf8').digest('hex')

			proxydb.hash = hashed;
		
			proxydb.save(function(err){
				if(err)
					res.send(err)

				res.json({message : "Url changed"})
			});
		});
	})

	//get configuration parameters
	.get(function(req, res){
 
 		ProxyConfig.find(function(err, url){
			if(err)
				res.send(err);

			res.json(url);
		});
		
	});

app.use('/myapi', router);

app.listen(port);
console.log("Magic happens on port " + port);