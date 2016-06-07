require('dotenv').config();
var mongoose = require('mongoose');
var express = require('express');
var app = express();
mongoose.connect(process.env.DB_CONNECTION);
var Url = require('./model/url');

app.get('/', function(req, resp){
	resp.contentType('text/html');
	resp.sendFile(__dirname+'/view/home.html');
});

app.get('/register', function(req, resp){
	if ( req.query.url ) {
		resp.redirect('/register/'+encodeURIComponent(req.query.url));
	} else {
		resp.redirect('/');
	}
});

app.get('/register/:url', function(req, resp){
	resp.contentType('text/JSON');
	var strUrl = req.params.url;
	Url.findOne({'url': strUrl}, function(err, result){
		if ( err ) return console.log(err);
		if ( !result ) {
			var newURL = {
				'url': strUrl,
				'hash': new Date().getTime().toString(36)
			};
			var insert = new Url(newURL).save();
			return resp.end(JSON.stringify(newURL));
		}
		return resp.end(JSON.stringify({
			'url': result.url,
			'hash': result.hash}));
	});
	
});

app.get('/:hash', function(req, resp){
	var strHash = req.params.hash;
	Url.findOne({'hash': strHash}, function(err, result){
		if ( err ) return console.log(err);
		if ( result ) {
			return resp.redirect(result.url);
		}
		return resp.redirect('/');
	});
})

app.listen(8080);