var express = require('express');
var router = express.Router();
//Load the request module
var request = require('request');

// API url with params
var urlMS = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment";

router.get('/:val', function(req, res, next) {
    var textToSend = '"' + req.params.val + '"';

    var dataToSend = 
    {
        "documents": [
            {
            "language": "en",
            "id": "noid",
            "text": "As a child, Daiya Seto looked up to Michael Phelps. Now he might outswim him at the Olympic Games."
            }
        ]
    };
    
    //Lets configure and request
    request({
        url: urlMS, //URL to hit
        method: 'GET', //Specify the method
        headers: { // headers with Key
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '78ab253d040649f3a5d2e577e959d596'
        },
        data: dataToSend
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            res.status(200).json(response);
            console.log(response, response.statusCode, body);
        }
        console.log('request sent');
    });
});

module.exports = router;