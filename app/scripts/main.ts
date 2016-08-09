declare var $ : any;

// class for Twitter Results
class TwitElement {
    // twit text
    public text: string;
    // twit creation date
    public createdAt: Date;
    // retweet count
    public retweet_count: number;
    // user followers count
    public followers_count: number;
    public constructor(message: string, date?: Date, retweetCnt?: number, followersCnt?: number) {
        this.text = message;
        this.createdAt = date;
        this.retweet_count = retweetCnt;
        this.followers_count = followersCnt;
    }
}

// class for final results - Twitter + Text Analytics API
class ResultElement extends TwitElement {
    // sentiment from MS Text Analytics API
    public sentiment: number;
    constructor(message: string, sentiment: number, date?: Date, retweetCnt?: number, followersCnt?: number) {
        super(message, date, retweetCnt, followersCnt);
        this.sentiment = sentiment;
    }    
}

// arrays for storing received info
var twitterResultArray: Array<TwitElement> = [];
var ResultArray: Array<ResultElement> = [];


// ----------------------------------------------------------------------------- //
// -------------------------- text analyse function ---------------------------- //
// ----------------------------------------------------------------------------- //
function textAnalytics(twitterResultArray: Array<TwitElement>): void {
    // params for Text Analytics API
    let params = {
        "language": "en"
    };

    let ifError:boolean = false;

    $.each(twitterResultArray, function( index, value ) {
        console.log(value.text);
        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","78ab253d040649f3a5d2e577e959d596");
            },
            type: "POST",
            // Send text value for analyse
            data: value.text,
        })
        .done(function(data) {
            console.log(data);
            console.log(data.documents[0]);
            console.log(data.documents[0].score);
            let resEl = new ResultElement (value.text, data.documents[0].score, value.created_at, value.retweet_count, value.followers_count);
            // add the object into array
            ResultArray.push(resEl);            
        })
        .fail(function() {
            ifError = true;
        }); 
        if (ifError) {
            alert("Error with Text Analytics API");
        }
    });
   
}


// ----------------------------------------------------------------------------- //
// -------------------------- submit form event -------------------------------- //
// ----------------------------------------------------------------------------- //
$('#service').submit(function( event ) {
    // prevent default event
    event.preventDefault();
    // Get input text value
    let value:string = $("#value_submit").val();
    // send request to our back-end for twitter results
    $.ajax({
        url: "/twi/" + value,
        type: "GET",
    })
    // on success - store information into an array 
    .done(function(data) {
        $("#results").addClass( "block grey");
        // scroll to our results div
        $('html, body').animate({
            scrollTop: $("#results").offset().top
        }, 500);
        // select div for future result
        var resultDiv = $('#results > .container > .row');
        // clear all old information
        resultDiv.html('');
        // show title and search keyword
        resultDiv.append("<div class='col-sm-12'><h2>Twitter Results for keyword: " + value + "</h2></div>");

        console.log(data.statuses);
        // check if something was found for our keyword
        if (data.statuses.length == 0) {
            resultDiv.append("<p>Sorry, nothing found for this query.</p>");
        } else {
            // store all received info into an array
            $.each(data.statuses, function(key, str) {
                // create new object with one particular twit
                let twiEl = new TwitElement(str.text, str.created_at, str.retweet_count, str.user.followers_count);
                // add the object into array
                twitterResultArray.push(twiEl);
            });
            // creat div for finalized results with unique id=finalResult
            resultDiv.append("<div class='col-sm-12'><div id='finalResult'></div></div>");
            // call Text Analytics API function
            textAnalytics(twitterResultArray);
            // call function for showing results

        }
    })
    .fail(function() {
        alert("Error with Twitter API");
    });
});


                //<div class="alert alert-success" role="alert">
                //resultDiv.append("<div class='alert alert-success' role='alert'>" + str.text + "</div>");