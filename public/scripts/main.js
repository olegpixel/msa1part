function textAnalytics(t){var e=!1;$.each(t,function(n,s){var a=s.text.replace(/#|\//g,"");$.ajax({url:"/textanalysis/"+a,type:"GET",async:!1}).done(function(e){var n=$.parseJSON(e);console.log(n);var a=new ResultElement(s.text,n.documents[0].score,s.createdAt,s.retweet_count,s.followers_count);ResultArray.push(a),$("#parseStatusText").text(ResultArray.length+" out of "+t.length+" tweets analysed")}).fail(function(){e=!0})}),e&&alert("Error with Text Analytics API")}function renderResults(t){$.each(t,function(t,e){var n;n=e.sentiment>=0&&e.sentiment<.4?"negativeText":e.sentiment>.6&&e.sentiment<=1?"positiveText":"neutralText";var s;s=new Date(Date.parse(e.createdAt.replace(/( \+)/," UTC$1")));var a="<div class='bs-callout "+n+"'>";a+="<span class='twiDate'>"+s.toDateString()+"</span>",a+="<p>"+e.text+"</p>",a+="<p><span><i class='glyphicon glyphicon-user'></i> Followers: "+e.followers_count+"</span>",a+="<span><i class='glyphicon glyphicon-retweet'></i> Retweets: "+e.retweet_count+"</span>",a+="<span><i class='glyphicon glyphicon-stats'></i> Sentiment value: "+Math.round(100*e.sentiment)/100+"</span></p>",a+="</div>",$("#finalResult").append(a)})}var __extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var s in e)e.hasOwnProperty(s)&&(t[s]=e[s]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)},TwitElement=function(){function t(t,e,n,s){this.text=t,this.createdAt=e,this.retweet_count=n,this.followers_count=s}return t}(),ResultElement=function(t){function e(e,n,s,a,r){t.call(this,e,s,a,r),this.sentiment=n}return __extends(e,t),e}(TwitElement),twitterResultArray=[],ResultArray=[];$("#service").submit(function(t){t.preventDefault(),twitterResultArray=[],ResultArray=[];var e=$("#value_submit").val();$("#fakeloader").fakeLoader(),$("#fakeloader").fadeIn(),$("#parseStatusText").text("Call Twitter API"),$.ajax({url:"/twi/"+e,type:"GET"}).done(function(t){$("#results").addClass("block grey"),$("html, body").animate({scrollTop:$("#results").offset().top},500);var n=$("#results > .container > .row");n.html(""),n.append("<div class='col-sm-12'><h2>Twitter Results for keyword: "+e+"</h2></div>"),0==t.statuses.length?(n.append("<p>Sorry, nothing found for this query.</p>"),$("#fakeloader").fadeOut()):(document.getElementById("parseStatusText").innerHTML="123123",$("#parseStatusText").text("Found "+t.statuses.length+" tweets<br />Starting text analysis..."),$.each(t.statuses,function(t,e){var n=new TwitElement(e.text,e.created_at,e.retweet_count,e.user.followers_count);twitterResultArray.push(n)}),n.append("<div class='col-sm-12'><div id='finalResult'></div></div>"),textAnalytics(twitterResultArray),$("#fakeloader").fadeOut(),renderResults(ResultArray),console.log(ResultArray))}).fail(function(){alert("Error with Twitter API")})});