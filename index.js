var mode = process.argv[2] || 'development';
if ( mode == 'development' ) {
	require('dotenv').config();
}
var mongoose = require('mongoose');
var express = require('express');
var app = express();
//mongoose.connect(process.env.MONGODB_URI);
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
			result = {
				'url': strUrl,
				'hash': new Date().getTime().toString(36)
			};
			var insert = new Url(result).save();
		}
		return resp.end(JSON.stringify({
			'original': result.url,
			'shortened': process.env.APP_DOMAIN
					+((process.env.APP_PORT != '80') ? ':'+process.env.APP_PORT+'/' : '/')
					+result.hash}));
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

app.listen(process.env.APP_PORT);
