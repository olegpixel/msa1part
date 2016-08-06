var http = require('http');

http.createServer(function (req, res) {

    res.render("index");
    
}).listen(process.env.PORT || 8080);