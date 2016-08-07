declare var $ : any;

// $(document).on('click', 'a[href^="#"]', function(event){
//     event.preventDefault();
//     $('html, body').animate({
//         scrollTop: $( $.attr(this, 'href') ).offset().top
//     }, 500);
// });

$('#service').submit(function( event ) {
    event.preventDefault();
    // Get input text value
    let value:string = $("#value_submit").val();

    $.ajax({
        url: "/twi/" + value,
        type: "GET",
    })
    .done(function(data) {
        $("#results").addClass( "block grey");
        $('html, body').animate({
            scrollTop: $("#results").offset().top
        }, 500);
        var resultDiv = $('#results > .container > .row');
        resultDiv.html('');
        resultDiv.append("<div class='col-sm-12'><h2>Twitter Results for keyword: " + value + "</h2></div>");

        console.log(data.statuses);
        $.each(data.statuses, function(key, str) {
            //<div class="alert alert-success" role="alert">
            resultDiv.append("<div class='alert alert-success' role='alert'>" + str.text + "</div>");
            console.log(key + ": " + str.text);
        });
    });

});
