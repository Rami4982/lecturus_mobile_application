var app = {
        initialize    : function ()
        {
            this.initializeAll();
            this.bindEvents();

        },
        // Bind Event Listeners    //    // Bind any events that are required on startup. Common events are:    // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents    : function ()
        {
            document.addEventListener( 'deviceready', this.onDeviceReady, false );
        },
        initializeAll : function ()
        {
            $( document ).ready( function ()
            {
                var url = API_Url + "session/tagIds";
                dataPost={'email' : localStorage.getItem( "email_L" ), 'sessionId' : sessionC, 'tags' : tagsToSend, 'org' : 'shankar', 'timestamp' : timestamp };
                $.ajax(
                    {
                        url         : url ,//  1427744683980106958182
                        type        : "POST",
                        crossDomain : true,
                        dataType    : "json",
                        data        : dataPost,
                        success     : function ( data, textStatus, jqXHR )
                        {
                            $( "#Timer" ).append( '<pre>' + preJs( data ) + '</pre>' );

                        }, error    : function ( data, textStatus )
                    {
                        $( "#Timer" ).append( '<pre>' + preJs( data ) + '   textStatus=  ' + textStatus + '</pre>' );

                    }
                    } );

            } );

        },
        onDeviceReady : function ()
        {
            if ( navigator.notification )
            { // Override default HTML alert with native dialog
                window.alert = function ( message )
                {
                    navigator.notification.alert(
                        message,    // message
                        null,       // callback
                        "Lecturus", // title
                        'Got It'        // buttonName
                    );
                };
            }
            app.receivedEvent( 'deviceready' );

        },
// Update DOM on a Received Event
        receivedEvent : function ( id )
        {
            var parentElement = document.getElementById( id );
            var listeningElement = parentElement.querySelector( '.listening' );
            var receivedElement = parentElement.querySelector( '.received' );
            listeningElement.setAttribute( 'style', 'display:none;' );
            receivedElement.setAttribute( 'style', 'display:block;' );
            console.log( 'Received Event: ' + id );
        }
    }
    ;

app.initialize();


