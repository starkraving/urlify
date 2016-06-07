var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
	url: String,
	hash: String
});

module.exports = mongoose.model('url', urlSchema);