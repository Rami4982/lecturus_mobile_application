/**
 * Created by Rami Cohen on 16/03/15.
 * js file for the setting tag page
 * dealing with the setting tag  of the user according to his choice
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
        $( document ).ready( function ()
        {
            //set the vaRIBALES according to the locAL storage values
            for(i=1; i<=Num_Tags; i++)
            {
                $( "#tag"+i ).val( localStorage.getItem( 'tag'+i+'_L' ) );
                $( "#tag"+i ).keyup( function ()
                {
                    $( "#btn" ).addClass( 'btnBold' );
                } );
            }
        } );
        $( "#myform" ).submit( function ( event )
        {
            event.preventDefault();
        } );
        //save the user preference in the loCAL storage for next time
        sendJson = function ()
        {
            for(i=1; i<=Num_Tags; i++)
            {
                localStorage.setItem( 'tag'+i+'_L' , $( "#tag"+i ).val() );
            }
            toast( 'submit successfully' );
        };

    } ,
    onDeviceReady : function ()
    {
        document.addEventListener( "backbutton" , function ( e )
        {
            e.preventDefault();
        } , false );
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

