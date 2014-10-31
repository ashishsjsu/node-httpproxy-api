var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProxyConfig = new Schema({url : String, client : String, latency: String});

module.exports = mongoose.model("ProxyDB", ProxyConfig) 