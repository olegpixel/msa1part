var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// class for Twitter Results
var TwitElement = (function () {
    function TwitElement(message, date, retweetCnt, followersCnt) {
        this.text = message;
        this.createdAt = date;
        this.retweet_count = retweetCnt;
        this.followers_count = followersCnt;
    }
    return TwitElement;
}());
// class for final results - Twitter + Text Analytics API
var ResultElement = (function (_super) {
    __extends(ResultElement, _super);
    function ResultElement(message, sentiment, date, retweetCnt, followersCnt) {
        _super.call(this, message, date, retweetCnt, followersCnt);
        this.sentiment = sentiment;
    }
    return ResultElement;
}(TwitElement));
// arrays for storing received info
var twitterResultArray = [];
var ResultArray = [];
// ----------------------------------------------------------------------------- //
// -------------------------- text analyse function ---------------------------- //
// ----------------------------------------------------------------------------- //
function textAnalytics(twitterResultArray) {
    var ifError = false;
    $.each(twitterResultArray, function (index, value) {
        var tempString = (value.text).replace(/#|\//g, '');
        $.ajax({
            // Problem with
            // No 'Access-Control-Allow-Origin' header is present on the requested resource. 
            // Use back-end to solve it
            url: "/textanalysis/" + tempString,
            type: "GET",
            async: false
        })
            .done(function (data) {
            var result = $.parseJSON(data);
            var resEl = new ResultElement(value.text, result.documents[0].score, value.createdAt, value.retweet_count, value.followers_count);
            // add the object into result array
            ResultArray.push(resEl);
            console.log(this);
            console.log($("#parseStatusText"));
            // show parse status into div on loader layer
            // document.getElementById('parseStatusText').innerHTML = ResultArray.length + " out of " + twitterResultArray.length + " tweets analysed";
            $("#parseStatusText").html(ResultArray.length + " out of " + twitterResultArray.length + " tweets analysed");
            window.setTimeout(this, 50);
        })
            .fail(function () {
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
function renderResults(tResultArray) {
    $.each(tResultArray, function (index, value) {
        // check sentiment of the text and assign appropriate css class
        var sentimentClass;
        if (value.sentiment >= 0 && value.sentiment < 0.4) {
            sentimentClass = "negativeText";
        }
        else if (value.sentiment > 0.6 && value.sentiment <= 1) {
            sentimentClass = "positiveText";
        }
        else {
            sentimentClass = "neutralText";
        }
        // convertison date of the tweet into readable format
        var creationDateConversion;
        // IE bug fix
        creationDateConversion = new Date(Date.parse(value.createdAt.replace(/( \+)/, ' UTC$1')));
        var resultHTMLelement = "<div class='bs-callout " + sentimentClass + "'>";
        resultHTMLelement += "<span class='twiDate'>" + creationDateConversion.toDateString() + "</span>";
        resultHTMLelement += "<p>" + value.text + "</p>";
        resultHTMLelement += "<p><span><i class='glyphicon glyphicon-user'></i> Followers: " + value.followers_count + "</span>";
        resultHTMLelement += "<span><i class='glyphicon glyphicon-retweet'></i> Retweets: " + value.retweet_count + "</span>";
        resultHTMLelement += "<span><i class='glyphicon glyphicon-stats'></i> Sentiment value: " + Math.round(value.sentiment * 100) / 100 + "</span></p>";
        resultHTMLelement += "</div>";
        $('#finalResult').append(resultHTMLelement);
    });
}
// ----------------------------------------------------------------------------- //
// -------------------------- submit form event -------------------------------- //
// ----------------------------------------------------------------------------- //
$('#service').submit(function (event) {
    // prevent default event
    event.preventDefault();
    // clear previous result if exist
    twitterResultArray = [];
    ResultArray = [];
    // Get input text value
    var value = $("#value_submit").val();
    // check if keyword not empty or short
    if (value.length > 2) {
        // show loader layer
        $("#fakeloader").fakeLoader();
        $("#fakeloader").fadeIn();
        $("#parseStatusText").text("Call Twitter API");
        // send request to our back-end for twitter results
        $.ajax({
            url: "/twi/" + value,
            type: "GET"
        })
            .done(function (data) {
            $("#results").addClass("block grey");
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
            }
            else {
                $("#parseStatusText").html("Found " + data.statuses.length + " tweets<br />Starting text analysis...");
                // setTimeout to prevent the cpu intensive task from running until the div has been updated
                setTimeout(function () {
                    // store all received info into an array
                    $.each(data.statuses, function (key, str) {
                        // create new object with one particular twit
                        var twiEl = new TwitElement(str.text, str.created_at, str.retweet_count, str.user.followers_count);
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
                }, 10);
            }
        })
            .fail(function () {
            alert("Error with Twitter API");
            $("#fakeloader").fadeOut();
        });
    }
    else {
        $("#dialog").dialog();
    }
});
