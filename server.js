//Variable delcarations
var http = require('http');

var fs = require('fs');

var path = require('path');

var cache = {};

var mime = require('mime');

var socketio = require('socket.io');


//Setting up sending file data and error responses
//For 404 Errors
function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'});
	response.write('Error 404: resource not found.');
	response.end();
	
}

//Serves file data

function sendFile(response, filePath, fileContents) {
	response.writeHead(
		200,
		{"content-type": mime.getType(path.basename(filePath))}
		);
	response.end(fileContents);
	
}

//Checks is a file exists in cache, if not serve from disk or 404 if still not found

function serveStatic(response, cache, absPath) {
	if (cache[absPath]) { //checks if file is in the cache memory
		sendFile(response, absPath, cache[absPath]); //serves file from cache
	} else {
		fs.exists(absPath, function(exists) { //check if file exists
			if (exists) {
				fs.readFile(absPath, function(err, data) { //serve file from disk
					if(err) {
						send404(response);
					}
					else {
						cache[absPath] = data;
						sendFile(response, absPath, data);
					}
				});
			}
			else {
				send404(response); //send http404 if file does not exist
			}
		});
	}
	
}


//Logic to create an http server

var server = http.createServer(function(request, response) { //create HTTP server
		var filePath = false;
		
		if (request.url == '/') {
			filePath = 'public/index.html'; //define html file to be served by default
		}
		else {
			filePath = 'public' + request.url; //translate url path to relative file path
		}

		var absPath = './' + filePath;
		serveStatic(response, cache, absPath); //serve the static file
							   		   						   
							 
});

server.on('listening',function(){
    console.log('ok, server is running');
});

server.listen(8080);

//starting the http server

server.listen(3000, function() {
	console.log("Server listening on port 3000.");
	
});
							   
							   
const strava = new require("strava")({
        client_id: "22264",	
        client_secret: "f31774d980e2f6e97403b8fd404deecff420201a",
        redirect_uri: "http://localhost:3000/mile-money/",
        access_token: "a481290c9c01de67dbef70f0fb0b1207591c75cb"
});   
							   
							   
							   
strava.athlete.get(function(err, res) {
        console.log(res);
});	

						   
							   
							   
							   
							   
							   
							   
							   
							   
							   
							   
							   