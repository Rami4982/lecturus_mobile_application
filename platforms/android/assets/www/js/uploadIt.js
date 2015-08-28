/**
 * Created by user on 22/02/15.
 */

$( document ).ready( function ()
{
    // are we running in native app or in a browser?
    window.isphone = false;
    if ( document.URL.indexOf( "http://" ) === -1
        && document.URL.indexOf( "https://" ) === -1 )
    {
        window.isphone = true;
    }

    if ( window.isphone )
    {
        document.addEventListener( "deviceready", onDeviceReady, false );
    }
    else
    {
        onDeviceReady();
    }
} );

function onDeviceReady()
{
    $( '#sendIt' ).click( function ()
    {
        console.log( 'about to post' );
        $.ajax( {
            url      : 'http://lecturus.herokuapp.com/session/uploadImage',
            data     : {}, // your data (if any) should go here
            dataType : 'application/json', // or whatever you expect back
            success  : function ( data )
            {
                console.log( 'In callback' );
                console.log( data );
            },
            error    : function ( error )
            {
                console.log( error );
            }
        } );
    } );
    // do everything here.
}