declare var $ : any;

// Twitter Parse Parameters
const twiParams = {
    "lang": "en",
    "count": "20",
    "result_type": "popular"
};

$('#service').submit(function( event ) {
    event.preventDefault();
    // Get input text value
    let value:string = $("#value_submit").val();

    $.ajax({
        // url: "https://api.twitter.com/1.1/search/tweets.json?q=#"+ value + "&" + $.param(twiParams),
        url: "/twi/" + value,
        type: "GET",
    })
    .done(function(data) {
        console.log(data);
        alert('done');
    });

});
