
//connect to database
var ProxyConfig = require("../models/ProxyConfigModel");
var mongoose = require("mongoose");
mongoose.connect("mongodb://ashishsjsu:ashishsjsu@novus.modulusmongo.net:27017/iQeg2igi");

var Client = require('node-rest-client').Client;

var targetArray = [];

//new config post
exports.addProxyConfiguration = function(req, res){
		ProxyConfig.findOne({"clientid": req.params.userid}, function(err, proxydb){
			if(err)
				res.send(err);
			
			var count = 0;	
	
			if(proxydb != null)
			{
				proxydb.Simpleproxy.forEach(function(item){
					count++;
				})
			
				proxydb.Simpleproxy.push({configid: ++count  ,targeturl: req.body.targeturl, proxyurl : '', latency: req.body.latency});

				proxydb.save(function(err, data){
					if(err) 
					res.send(err);
			 	 	res.send( (err === null) ? { msg: '' } : { msg: err });
				});
				
			}
			else{
				res.send( (err === null) ? { msg: 'User does not exist' } : { msg: err });
			}
		});
}	



exports.getProxyConfiguration = function(req, res){

		ProxyConfig.findOne( { "clientid" : req.params.userid }, function(err, dbObj){
			if(err)
				res.send(err);
			
			console.log("in GET");
			res.json(dbObj);

		});

}

exports.addUser = function(req, res){
		

		ProxyConfig.find({}, function(err, proxydb){
			if(err)
				res.send(err);

			var count = 0;

			if(proxydb != null){
				proxydb.forEach(function(item){
					count++;
				})
			}

		var proxydb = new ProxyConfig;

		proxydb.email = req.body.email;
		proxydb.password = req.body.password;
		proxydb.clientid = "U-" + count++;
		console.log(proxydb);
		proxydb.save(function(err, data){
			if(err) 
				res.send(err);	
			  res.send( (err === null) ? { msg: data } : { msg: err });
		});	
	});	
}

exports.getAllUsers = function(req, res){
		
		ProxyConfig.find( {}, function(err, dbObj){
			if(err)
				res.send(err);
			res.json(dbObj);
		});
}


exports.updateProxyConfiguration = function(req, res){


	var query = {"clientid" : req.params.userid};
	var update = { $pull : { Simpleproxy : {configid: req.params.configid}}};

	ProxyConfig.findOneAndUpdate(query, update, function(err, data){


	var proxyurl = req.body.proxyurl;

	console.log("proxyurl : " +proxyurl);

	var query = {"clientid" : req.params.userid};
	var update = { $push : { Simpleproxy : { targeturl : req.body.targeturl, proxyurl: req.body.proxyurl, latency : req.body.latency, configid: req.params.configid}}};

		ProxyConfig.findOneAndUpdate(query, update, function(err, data){

				res.send( (err === null) ? { msg: '' } : { msg: err });

		})
	})

}

exports.deleteProxyConfiguration = function(req, res){


	var query = {"clientid" : req.params.userid};
	var update = { $pull : { Simpleproxy : {configid: req.params.configid}}};

	ProxyConfig.findOneAndUpdate(query, update, function(err, data){

			res.send( (err === null) ? { msg: '' } : { msg: err });

	})
}


exports.addLoadBalancerConfiguration = function(req, res){

	ProxyConfig.findOne({"clientid": req.params.userid}, function(err, proxydb){
			if(err)
				res.send(err);
	

		var count = 0;	
	
			if(proxydb != null)
			{
				proxydb.Simpleproxy.forEach(function(item){
					count++;
				})
			
				id = ++count;

				var targets = req.body.targets;
				console.log(targets);

				proxydb.Loadbalance.push({configid: "L-"+id  ,targeturl: targets, proxyurl : '', latency: req.body.latency});

				proxydb.save(function(err, data){
					if(err) 
					res.send(err);
			 	 	res.send( (err === null) ? { msg: '' } : { msg: err });
				});
				
			}
			else{
				res.send( (err === null) ? { msg: 'User does not exist' } : { msg: err });
			}
		});
}
