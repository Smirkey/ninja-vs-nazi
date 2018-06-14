var metaServerurl = "http://localhost:80";
var currentUrl = "https://localhost:8083";

var express = require('express');
var path = require('path');
var bcrypt = require('bcrypt');
var fs = require('fs');
var http = require('http');
var https = require('https');
var connect = require('connect');
var app = connect();
var privateKey  = fs.readFileSync('certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('certificates/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};


var app = express();
var server = https.createServer(credentials, app).listen(8083);

var socket = require('socket.io');
var MongoClient = require("mongodb").MongoClient;

var io = socket(server).listen(server);
console.log("Database up!");

io.sockets.on('connection', function newConnection(socket){
	socket.on('newUser', function(data){
		MongoClient.connect("mongodb://localhost/ninjavsnazi", function(error, db) {
		    if (error){
		    	console.log(error);
		    	var answer = 0;
		    	socket.emit('newUserBack',answer); 
		    	return 0;
		    }
		    db.collection("users").findOne({pseudo: data.pseudo}, function(error, result) {
		    	if (error != null || result != null){
		    		var answer = 'wrongPseudo';
		    		socket.emit('newUserBack',answer); 
		    	}
		    	else {
		    		db.collection("users").findOne({email: data.email}, function(error, result) {
				    	if (error != null || result != null){
				    		var answer = 'wrongEmail';
				    		socket.emit('newUserBack',answer); 
				    	}
				    	else {
				    		data.skins = [];
			    			data.ttlKills = 0;
			    			data.highScore = 0;
						    data.ttlDeaths = 0;
						    data.profilePic = '/images/defaultPic.svg';
							db.collection("users").insert(data, null, function (error, results) {
								if (error){
									console.log(error);
									answer = 0;
									socket.emit('newUserBack',answer); 
								}
								else{
									answer = 1;
									socket.emit('newUserBack',answer); 
								}
							});
				    	}
		    		});
		    	}
		    });

		});
	});
	socket.on('newSignIn',function(data){
		console.log('sign');
		MongoClient.connect("mongodb://localhost/ninjavsnazi", function(error, db) {
			if (error){
				console.log(error);
				return 0;
			}
			else {
				db.collection("users").findOne({email: data.email}, function(error, result) {
					if (error != null || result == null){
						db.collection("users").findOne({pseudo: data.email}, function(error, result){
							if (error != null || result == null){
								socket.emit('newSignInBack',0);
							}
							else {
								if(data.password == result.password){
									socket.emit('newSignInBack', result);
								}
								else {
									socket.emit('newSignInBack', result);
								}
							}
						});
					}
					else {
						console.log()
						if(data.password == result.password){
							socket.emit('newSignInBack', result);
						}
						else {
									socket.emit('newSignInBack', result);
								}
					}
				});
			}
		});
	});
});