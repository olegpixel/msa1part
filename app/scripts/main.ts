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
    let ifError:boolean = false;
    $.each(twitterResultArray, function( index, value ) {
        let tempString:string = (value.text).replace(/#|\//g, '');
        $.ajax({
            // Problem with
            // No 'Access-Control-Allow-Origin' header is present on the requested resource. 
            // Use back-end to solve it
            url: "/textanalysis/" + tempString,
            type: "GET",
            async: false,
        })
        .done(function(data) {
            let result:any = $.parseJSON(data);
            console.log(result);
            let resEl = new ResultElement (value.text, result.documents[0].score, value.createdAt, value.retweet_count, value.followers_count);
            // add the object into result array
            ResultArray.push(resEl);     
            // show parse status into div on loader layer
            $("#parseStatus > p").text(ResultArray.length + " out of " + twitterResultArray.length + " tweets analysed");       
        })
        .fail(function() {
            ifError = true;
        }); 
    });
    if (ifError) {
        alert("Error with Text Analytics API");
    }    
   
}

// ----------------------------------------------------------------------------- //
// -------------------------- show results function ---------------------------- //
// ----------------------------------------------------------------------------- //
function renderResults(tResultArray: Array<ResultElement>): void {
    $.each(tResultArray, function( index, value ) {

        // check sentiment of the text and assign appropriate css class
        let sentimentClass:string;
        if (value.sentiment >= 0 && value.sentiment < 0.4) {
            sentimentClass = "negativeText";
        } else if (value.sentiment > 0.6 && value.sentiment <= 1) {
            sentimentClass = "positiveText";
        } else {
            sentimentClass = "neutralText";
        }
        let creationDateConversion: Date = new Date(value.createdAt);
        
        let resultHTMLelement:string = "<div class='bs-callout " + sentimentClass + "'>";
        resultHTMLelement += "<span class='twiDate'>" + creationDateConversion.toDateString() + "</span>";
        resultHTMLelement += "<p>" + value.text + "</p>";
        resultHTMLelement += "<p><span><i class='glyphicon glyphicon-user'></i> Followers: " + value.followers_count + "</span>";
        resultHTMLelement += "<span><i class='glyphicon glyphicon-retweet'></i> Retweets: " + value.retweet_count + "</span>"
        resultHTMLelement += "<span><i class='glyphicon glyphicon-stats'></i> Sentiment value: " + Math.round(value.sentiment * 100) / 100 + "</span></p>";
        resultHTMLelement += "</div>";
        $('#finalResult').append(resultHTMLelement);
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
    // show loader layer
    $("#fakeloader").fakeLoader();
    $("#parseStatus > p").text("Call Twitter API");
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
        // check if something was found for our keyword
        if (data.statuses.length == 0) {
            resultDiv.append("<p>Sorry, nothing found for this query.</p>");
            $("#fakeloader").fadeOut();
        } else {
            $("#parseStatus > p").html("Found " + data.statuses.length + " tweets<br />Starting text analysis...");
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
            // hide loader layer
            $("#fakeloader").fadeOut();
            // call function for showing results
            renderResults(ResultArray);
            console.log(ResultArray);
        }
    })
    .fail(function() {
        alert("Error with Twitter API");
    });
});