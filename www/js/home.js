/**
 * Created by Rami Cohen on 16/03/15.
 * js file for the Home page
 * dealing with the choice of the user when the application start operating and redirecting the user according to his choice
 */
var app = {
    initialize    : function ()
    {
        this.initializeAll();
        this.bindEvents();

    } ,
    // Bind Event Listeners    //    // Bind any events that are required on startup. Common events are:    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents    : function ()
    {
        document.addEventListener( 'deviceready' , this.onDeviceReady , true );
    } ,
    initializeAll : function ()
    {
        $( document ).ready( function ()
        {
            $( '.choicesHmoe >img' ).click( function (  )
            {
                location = 'create_session.html';
            } );
        } );
    } ,
    onDeviceReady : function ()
    {

        navigator.geolocation.getCurrentPosition( onSuccessGeo , onErrorGeo );
        registerNotification();


        app.receivedEvent( 'deviceready' );

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
