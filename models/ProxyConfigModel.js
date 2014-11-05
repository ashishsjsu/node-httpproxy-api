var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var simpleproxy = new Schema({configid: String, targeturl: String, proxyurl: String, latency: String});

var loadbalance = new Schema({configid: String, targeturl: [], proxyurl: String, latency: String})

var ProxyConfig = new Schema({clientid: String, email: String, password: String, Simpleproxy: [simpleproxy], Loadbalance: [loadbalance]});

module.exports = mongoose.model("ProxyDB", ProxyConfig)