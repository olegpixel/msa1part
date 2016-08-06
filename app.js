// The App
var express = require("express");
var app = express();

// Use static middleware
app.use(express.static(__dirname + '/public'));

// Set the view engine
app.set('view engine', 'jade');

// Set the directory that contains the views
app.set('views', __dirname + '/app');

// Use the router middleware
app.use(app.router);

// Get route with one middleware
app.get("/", function (req, res) {
  res.send("app");
});

// Create HTTP server with your app
var http = require("http");
var server = http.createServer(app)

// Listen to port 3000 
server.listen(3000);

