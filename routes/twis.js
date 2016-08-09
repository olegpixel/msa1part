var express = require('express');
var router = express.Router();

var Twit = require('twit');

var T = new Twit({
  consumer_key:         'YOFhlVyRefd9mxt0Pk8JE4awW',
  consumer_secret:      'g3vyvv7Smse30uciHlPNqsOwOCmTI13XoL4vUr1hXv0bbVCLtS',
  access_token:         '84084674-fYXZEvKTLDUiueS997Ph3cfPFCEiFQVyVIYKSyHam',
  access_token_secret:  'x91q0CHUNsNyQmH8OgeWe33AhmosTnrGYx9gMjGH43a54',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});

// Twitter Parse Parameters
const twiParams = {
    "lang": "en",
    "count": "20",
    "result_type": "popular"
};

router.get('/:val', function(req, res, next) {
    T.get('search/tweets', { q: req.params.val, result_type:"popular", lang:"en", count: 30 }, function(err, data, response) {
        res.status(200).json(data);
    });
});

module.exports = router;