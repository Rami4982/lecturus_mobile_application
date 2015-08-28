/**
 * Created by Rami Cohen on 16/03/15.
 * js file for the register user page
 * dealing with the registeration  of the user if he doesn't exist from the point of view of the server and shenkar users and redirecting the user according to the server response
 */
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
            $( "#Email" ).val( localStorage.getItem( "email_L" ) );
            $( "#Fname" ).val( localStorage.getItem( "fname_L" ) );
            $( "#Lname" ).val( localStorage.getItem( "lname_L" ) );
        } );

        $( "#myform" ).submit( function ( event )
        {
            event.preventDefault();

        } );
        sendJson = function ()
        {
            FnameC = $( "#Fname" ).val();
            EmailC = $( "#Email" ).val();
            LnameC = $( "#Lname" ).val();
            imageC = localStorage.getItem( "image_L" );
            if ( EmailC != '' )
            {
                $.ajax( {
                    url      : API_Url + "users/registerUser" ,
                    type     : "POST" ,
                    data     : { 'name' : FnameC , 'lastName' : LnameC , 'email' : EmailC , 'org' : 'shenkar' , 'image' : imageC } ,
                    dataType : "json" ,                                       //{"uid":"ass@b.c","status":2,"desc":"user exist"}
                    success  : function ( result )
                    {
                        if ( result.status == 1 )
                        {
                            localStorage.setItem( "email_L" , EmailC );
                            localStorage.setItem( "fname_L" , FnameC );
                            localStorage.setItem( "lname_L" , LnameC );
                            localStorage.setItem( "image_L" , imageC );
                            location = 'create_session.html';
                        }
                        else
                        {
                            $( "#errorMsg" ).text( result.desc )
                        }
                    } ,
                    error    : function ( xhr , ajaxOptions , thrownError )
                    {
                        toast( 'server not availble' )
                        toast( xhr.status );
                    }
                } );
            }
        };
    } ,
    onDeviceReady : function ()
    {

        app.receivedEvent( 'deviceready' );
        var messageBox = document.getElementById( "deviceready" ).querySelector( '.received' );
    } ,
// Update DOM on a Received Event
    receivedEvent : function ( id )
    {
        var parentElement = document.getElementById( id );
        var listeningElement = parentElement.querySelector( '.listening' );
        var receivedElement = parentElement.querySelector( '.received' );
        listeningElement.setAttribute( 'style' , 'display:none;' );
        receivedElement.setAttribute( 'style' , 'display:block;' );
    }
};
app.initialize();


