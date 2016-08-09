var express = require('express');
var router = express.Router();
//Load the request module
var request = require('request');
// Load node js serialize
var serialize = require('node-serialize');

// API url with params
var urlMS = "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment?";

router.get('/:val', function(req, res, next) {
    var textToSend = '"' + req.params.val + '"';

    var dataToSend = 
{
  "documents": [
        {
            "language": "en",
            "id": "1",
            "text": textToSend
        }
    ]
};

    var dataToSendSerialized = JSON.stringify(dataToSend);

    //Lets configure and request
    request({
        url: urlMS, //URL to hit
        headers: { // headers with Key
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '78ab253d040649f3a5d2e577e959d596'
        },
        method: 'POST', //Specify the method        
        body: dataToSendSerialized
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            res.status(200).json(body);
            console.log(response, response.statusCode, body);
        }
    });
});

module.exports = router;