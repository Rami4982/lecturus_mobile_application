/**
 * Created by Rami Cohen on 16/03/15.
 * js file for the login page
 * dealing with the authentication of the user when the application start operating from the point of view of the server and shenkar users and redirecting the user according to his status
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

            var lock = null;
            $( document ).ready( function ()
            {
                $( "#myform" ).submit( function ( e )
                {
                    return false;
                } );
                /*Auth0Lock section*/
                lock = new Auth0Lock( 'jz66JZzwou5QxIthr3F2HduTO8RdVJWG' , 'lecturus.auth0.com' );
                var userProfile;

                $( '.btn-login' ).click( function ( e )
                {
                    e.preventDefault();
                    lock.show( function ( err , profile , token )
                    {
                        if ( err )
                        {
                            // Error callback
                            toast( "There was an error logging in",5000 );
                        }
                        else
                        {
                            // Success calback
                            // Save the JWT token.
                            localStorage.setItem( 'userToken' , token );
                            // Save the profile
                            userProfile = profile;
                            $( '.login-box' ).hide();
                            $( '.logged-in-box' ).show();
                            if ( profile.given_name!= undefined  )//&& profile.name.length > 0
                            {
                                localStorage.setItem( "fname_L" , profile.given_name );
                            }
                            if ( profile.family_name != undefined  )//&& profile.family_name.length > 0
                            {
                                localStorage.setItem( "lname_L" , profile.family_name );
                            }
                            localStorage.setItem( "image_L" , profile.picture );
                            //if user logged in properly send him to create_session other wise to register user
                            if ( profile.email.indexOf( '@' ) != -1  )//&& profile.family_name.length > 0
                            {
                                localStorage.setItem( "email_L" , profile.email );
                                updateUser( 'home.html' );
                                //updateUser( 'create_session.html' );
                                //updateUser( 'rec.html' );
                            }
                            else
                            {
                                updateUser( 'registerUser.html' );
                            }
                        }
                    } );
                } );
            } );
        } ,
        onDeviceReady : function ()
        {
            if ( navigator.notification )
            { // Override default HTML alert with native dialog
                window.alert = function ( message )
                {
                    navigator.notification.alert(
                        message ,    // message
                        null ,       // callback
                        "Lecturus" , // title
                        'Got It'        // buttonName
                    );
                };
            }
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
    }
    ;

app.initialize();
