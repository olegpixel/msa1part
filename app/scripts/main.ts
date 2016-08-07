declare var $ : any;

$('#service').submit(function( event ) {
    event.preventDefault();
    let value:string = $("#value_submit").val();
    alert(value);
});
