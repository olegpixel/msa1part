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

router.get('/:val', function(req, res, next) {
  console.log(req.params.val);
  res.status(200).json({
    title: 'test-title'
  });
});

module.exports = router;