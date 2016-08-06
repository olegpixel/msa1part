// The App
var express = require("express");
var app = express();

// Use static middleware
app.use(express.static(__dirname + '/app'));

// Set the view engine
app.set('view engine', 'html');

// Set the directory that contains the views
app.set('views', __dirname + '/app');

// Create HTTP server with your app
var http = require("http");
var server = http.createServer(app)

// Listen to port 3000 
server.listen(3000);

