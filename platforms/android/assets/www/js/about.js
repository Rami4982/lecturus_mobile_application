/**
 * Created by Rami Cohen on 16/03/15.
 * js file for the about us page
 * explaining about us
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
        var EmailC = localStorage.getItem( "email_L" );
        //    console.log( 'is' + EmailC );
        $( document ).ready( function ()
        {


        } );
    } ,
    onDeviceReady : function ()
    {
        document.addEventListener( "backbutton" , function ( e )
        {
            e.preventDefault();
        } , false );
        registerNotification();
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
