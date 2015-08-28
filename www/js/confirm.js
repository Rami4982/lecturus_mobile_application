/* confirm
confirm the request for joining the session that comes from the gcm request .
* */
var app = {
    initialize    : function ()
    {
        this.initializeAll();
        this.bindEvents();
    } ,
    bindEvents    : function ()        // Bind Event Listeners    //    // Bind any events that are required on startup. Common events are:    // 'load', 'deviceready', 'offline', and 'online'.
    {
        document.addEventListener( 'deviceready' , this.onDeviceReady , false );
    } ,
    initializeAll : function ()
    {
        $( document ).ready( function ()
        {
            $("#owner" ).append( localStorage.getItem( "owner_L" ));
            $("#Confirm_No" ).click( function ()
            {
                location='home.html';
            });
            //send the request to join the session to the server
            $("#Confirm_Yes" ).click( function ()
            {
                dataPost = {'email' : EmailC , 'org' : 'shenkar', sessionId : localStorage.getItem( "session_L" )};
                $.ajax( {
                    url      : API_Url + "session/joinSession" ,
                    type     : "POST" ,
                    data     : dataPost ,
                    dataType : "json" ,
                    success  : function ( result )
                    {
                        if ( result.status == 1 )
                        {//redirect the user immediately to the recordings page
                            $( "#Timer" ).append( '<pre>' + preJs( result ) + '</pre>' );
                            //                     alert(result.desc);
                            location = 'rec.html';
                        }

                        else
                        {
                            $( "#Timer" ).append( '<pre>' + preJs( result ) + '</pre>' );
                        }
                    } ,
                    error    : errorFromAjaxCall

                } );

            });
        } );
    } ,
    onDeviceReady : function ()
    {
        registerNotification();
        app.receivedEvent( 'deviceready' );
    } ,
// Update DOM on a Received Event
    receivedEvent : function ( id )
    {
    }
};
app.initialize();


/*initializeAll : function ()
 {
 JSONTest = function ()
 {
 console.log( 'star' );

 f = $( "#name" ).val();
 e = $( "#room" ).val();
 l = $( "#Subject" ).val();

 $.ajax( {
 url      : "http://lecturus.herokuapp.com/session/createSession",//page not allowed lecturus
 type     : "POST",                                           //{"uid":"a@b.c","status":2,"desc":"user exist"}
 //data: { name: "eran", email: "a@b.c" },                 //{"uid":"ass@b.c","status":1,"active":false,"desc":"register"}
 data     : { 'name' : f, 'room' : l, 'email' : 'cohen_rami@hotmail.com', 'Subject' : e },
 dataType : "json",                                       //{"uid":"ass@b.c","status":2,"desc":"user exist"}
 success  : function ( result )
 {
 $( "#msg" ).val( result );
 console.log( result );
 // alert(result)
 location = 'add_members.html';
 },
 error    : function ( xhr, ajaxOptions, thrownError )
 {
 console.log( xhr );
 console.log( 'errorr' );
 alert( 'server not availble' )

 alert( xhr.status );

 }
 } );
 };
 },*/
//set courses list


/*                        $.each( result.degrees, function ()
 {
 obj = {'courses' : this.courses, 'name' : this.name}
 courseMy[this.id] = obj;
 obj = {};
 $( "#Category" ).append( $( "<option />" ).val( this.id ).text( this.name ) );
 } );*/
