/**
 * Created by user on 16/03/15.
 * global functions for the application
 */
//convert timestamp to HHMMSS format
String.prototype.toHHMMSS = function ()
{
    var sec_num = parseInt( this , 10 ); // don't forget the second param
    var hours = Math.floor( sec_num / 3600 );
    var minutes = Math.floor( (sec_num - (hours * 3600)) / 60 );
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if ( hours < 10 )
    {
        hours = "0" + hours;
    }g
    if ( minutes < 10 )
    {
        minutes = "0" + minutes;
    }
    if ( seconds < 10 )
    {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}
//get the current date in HHMMSS format
function getCurDate( today )
{
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if ( dd < 10 )
    {
        dd = '0' + dd
    }
    if ( mm < 10 )
    {
        mm = '0' + mm
    }
    return  yyyy + '-' + mm + '-' + dd;

}
//convert seconds to HHMMSS format

function Convert_seconds_HH( totalSec )
{

    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}
// update user status
function updateUser( Where )
{
    activeC = (Where == 'exit') ? 0 : 1;
    EmailC = localStorage.getItem( "email_L" );
    FnameC = localStorage.getItem( "fname_L" );
    LnameC = localStorage.getItem( "lname_L" );
    imageC = localStorage.getItem( "image_L" );
    dataPost = { 'name' : FnameC , 'lastName' : LnameC , 'email' : EmailC , 'org' : 'shenkar' , 'image' : imageC , 'active' : activeC , 'regId' : localStorage.getItem( "regid_L" ) , 'latitude' : localStorage.getItem( "latitude_L" ) , 'longitude' : localStorage.getItem( "longitude_L" )};
    if ( EmailC != '' )
    {
        $.ajax( {
            url      : API_Url + "users/updateUser" ,
            type     : "POST" ,
            data     : dataPost ,
            dataType : "json" ,                                       //{"uid":"ass@b.c","status":2,"desc":"user exist"}
            success  : function ( result )
            {
                console.log( result );
                if ( result.status != 1 )
                {
                    $( "#errorMsg" ).text( result.desc );
                    Where = 'registerUser.html';

                }
                setTimeout( function ()
                {
                    if ( activeC == 0 )
                    {                        //               pushNotification.unregister( successHandler , errorHandler );//we don't need this for the application at this moment
                        navigator.app.exitApp();
                    }
                    else
                    {
                        $( "#Timer" ).append( '<pre>' + preJs( dataPost ) + '</pre>' );
                        location = Where;
                    }
                } , 1000 );//60000

            } ,
            error    : function ( xhr , ajaxOptions , thrownError )
            {
                toast( 'server not availble, no network connection ' , 5000 );                //alert( xhr.status );
            }
        } );

    }

}
// Display `Position` properties from the geolocation

function onSuccessGeo( position )
{
    localStorage.setItem( 'latitude_L' , position.coords.latitude );
    localStorage.setItem( 'longitude_L' , position.coords.longitude );
}

// Show an alert if there is a problem getting the geolocation
//
function onErrorGeo()
{
    alert( 'onError!' );
}
function preJs( json )
{
    if ( typeof json != 'string' )
    {
        json = JSON.stringify( json , undefined , 2 );
    }
    json = json.replace( /&/g , '&amp;' ).replace( /</g , '&lt;' ).replace( />/g , '&gt;' );
    return json.replace( /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g , function ( match )
    {
        var cls = 'number';
        if ( /^"/.test( match ) )
        {
            if ( /:$/.test( match ) )
            {
                cls = 'key';
            }
            else
            {
                cls = 'string';
            }
        }
        else if ( /true|false/.test( match ) )
        {
            cls = 'boolean';
        }
        else if ( /null/.test( match ) )
        {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    } );
}
function startStopRec( start )
{
    timestamp = (Math.floor( Date.now() / 1000 )) + parseInt( localStorage.getItem( "diff_L" ) );
    var EmailC = localStorage.getItem( "email_L" );
    var sessionC = localStorage.getItem( "session_L" );
    postData = {'email' : EmailC , 'sessionId' : sessionC , 'status' : start , 'timestamp' : timestamp };// 'org' : 'shankar',
    $( "#Timer" ).append( 'Request stop start session  : <pre>' + preJs( postData ) + '</pre>' );
    document.getElementById( "errorMsgAjax" ).value = JSON.stringify( postData );
    $.ajax(
        {
            url         : API_Url + "session/updateSessionStatus" ,//  1427744683980106958182
            type        : "POST" ,
            crossDomain : true ,
            dataType    : "json" ,
            data        : postData ,
            success     : function ( data , textStatus , jqXHR )
            {
                console.log( data );
                $( "#Timer" ).append( 'server result <pre>' + preJs( data ) + '</pre>' );

            } , error   : function ( data , textStatus )
        {
            $( "#errorMsgAjax" ).append( '<pre>' + preJs( data ) + '   textStatus=  ' + textStatus + '</pre>' );

        }   } );

}
//register the phone to recieve notIFICATION
function registerNotification()
{
    try
    {
        pushNotification = window.plugins.pushNotification;        //  $( "#app-status-ul" ).append( '<li>registering ' + device.platform + '</li>' );
        if ( device.platform == 'android' || device.platform == 'Android' ||
            device.platform == 'amazon-fireos' )
        {
            pushNotification.register( successHandler , errorHandler , {"senderID" : "910330551860" , "ecb" : "onNotification"} );		// required!
        }

    }
    catch ( err )
    {
        txt = "There was an error on this page.\n\n";
        txt += "Error description: " + err.message + "\n\n";
        toast( txt , 5000 );
    }
}
//upload tags function
function uploadTags()
{
    timestamp = (Math.floor( Date.now() / 1000 )) + parseInt( localStorage.getItem( "diff_L" ) );
    var postData = {'email' : EmailC , 'sessionId' : sessionC , 'tags' : tagsToSend , 'org' : OrgC , 'timestamp' : timestamp }
    $( "#Timer" ).append( 'Request uploadTags =<pre>' + preJs( postData ) + '</pre>' );
    $.ajax(
        {
            url         : API_Url + "session/uploadTags " ,//  1427744683980106958182
            type        : "POST" ,
            crossDomain : true ,
            dataType    : "json" ,
            data        : postData ,
            success     : function ( data , textStatus , jqXHR )
            {
                $( "#Timer" ).append( 'Server result  for uploadTags <pre>' + preJs( data ) + '</pre>' );
                tagsToSend.length=0;
                if ( data.status == 2 )
                {//in case the session is over but the participants didnt recieve notification about it.
                    $( '#messageOpenSession' ).text( 'session is finished thank you' );
                    clearInterval( secInterval );
                    $( ".Error_Black_BG,#Thank_message" ).show();
                    localStorage.setItem( "session_L" , '' );


                }

            } , error   : errorFromAjaxCall
        } );
}
//generic function for any error come from ajax call
function errorFromAjaxCall( data , textStatus )
{
    stringToApp = '<pre>' + preJs( data );
    (textStatus != undefined) ? stringToApp += '   textStatus=  ' + textStatus : '';
    stringToApp += '</pre>';
    $( "#errorMsgAjax" ).append( stringToApp );


}
// handle GCM notifications for Android
function onNotification( e )
{
    $( "#app-status-ul" ).append( '<li>EVENT -> RECEIVED:' + e.event + '</li>' );

    switch ( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                localStorage.setItem( "regid_L" , e.regid );                //     $( "#app-status-ul" ).append( '<li> REGID:' + e.regid + "</li>" );
                // Your GCM push server needs to know the regID before it can push to this device here is where you might want to send it the regID for later use.
                $( "#Timer" ).val( e.regid );
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if ( e.foreground )
            {
                $( "#app-status-ul" ).append( '<li>--INLINE NOTIFICATION--' + '</li>' );
                // on Android soundname is outside the payload.                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.                // playing a sound also requires the org.apache.cordova.media plugin
                var my_media = new Media( "/android_asset/www/" + soundfile );
                my_media.play();
            }
            else
            {	// otherwise we were launched because the user touched a notification in the notification tray.
                if ( e.coldstart )
                {
                    $( "#app-status-ul" ).append( '<li>--COLDSTART NOTIFICATION--' + '</li>' );
                }
                else
                {
                    $( "#app-status-ul" ).append( '<li>--BACKGROUND NOTIFICATION--' + '</li>' );
                }
            }

            $( "#Timer" ).append( '<pre>' + preJs( e.payload ) + '</pre>' );
            $( "#app-status-ul" ).append( '<li>MESSAGE -> MSG: ' + e.payload.message + '</li>' );
            $( "#app-status-ul" ).append( '<li>MESSAGE -> MSG: ' + e.payload.sessionId + '</li>' );
            if ( e.payload.sessionId != undefined && e.payload.sessionId != '' && e.payload.sessionId != null )//&& (localStorage.getItem('session_L')==undefined || localStorage.getItem('session_L')=='')
            {
                localStorage.setItem( "session_L" , e.payload.sessionId );
            }
            if ( e.payload.ownerId != undefined && e.payload.ownerId != '' && e.payload.ownerId != null && (localStorage.getItem( 'owner_L' ) == undefined || localStorage.getItem( 'owner_L' ) == '') )
            {
                localStorage.setItem( "owner_L" , e.payload.ownerId );
            }
            //android only            //       $( "#app-status-ul" ).append( '<li>message -> timestamp: ' + e.payload.timStamp + '</li>' );
            if ( parseInt( e.payload.status ) == 1 )
            {
                localStorage.setItem( "join_L" , '1' );
                location = 'confirm.html';//TODO:
            }           //     if ( e.payload.message.indexOf( 'join' ) != -1  )
            else if ( parseInt( e.payload.status ) == 2 )
            {//start session
                $( ".Notes" ).show();
                $( '#blockFromParticipants' ).hide();
                $( '#record_Section' ).show();
                $( '#CameraBtn' ).show();

                startTImeShow = startTIme = Math.floor( Date.now() / 1000 );
                secInterval = setInterval( function () {myTimerParticipent()} , 1000 );
            }
            else if ( parseInt( e.payload.status ) == 3 )
            {//stop session
                toast('session is about to end in 10 seconds. please upload images and tags. thank you. ',5000);
                setTimeout( function ()
                {//SHOW THE SPLASH SCREEN for 2 seconds after that redirect the user to home page
                    $( '#messageOpenSession' ).text( 'session is finished thank you' );
                    clearInterval( secInterval );
                    $( ".Error_Black_BG,#Thank_message" ).show();
                    localStorage.setItem( "session_L" , '' );
                    if ( tagsToSend.length > 0 )
                    {
                        uploadTags();
                    }

                } , 10000 );
            }
            break;
        case 'error':
            $( "#app-status-ul" ).append( '<li>ERROR -> MSG:' + e.msg + '</li>' );
            break;

        default:
            $( "#app-status-ul" ).append( '<li>EVENT -> Unknown, an event was received and we do not know what it is</li>' );
            break;
    }
}
//the timer that shows only in the participants application
function myTimerParticipent()
{
    sec = ((Math.floor( Date.now() / 1000 )) - startTIme);
    secShow = ((Math.floor( Date.now() / 1000 )) - startTImeShow);
    document.getElementById( "seconds" ).innerHTML = pad( secShow % 60 );
    document.getElementById( "minutes" ).innerHTML = pad( parseInt( secShow / 60 , 10 ) );                //messageBox.innerHTML=window.orientation+' '+d.toLocaleTimeString()+' '+pictureWasTake;
    if ( (sec % divideTime) == 0 )
    {
        startTIme = Math.floor( Date.now() / 1000 );
        if ( tagsToSend.length > 0 )
        {
            uploadTags();
        }

    }

}
// Your iOS push server needs to know the token before it can push to this device
// here is where you might want to send it the token for later use.
function tokenHandler( result )
{
    $( "#app-status-ul" ).append( '<li>token: ' + result + '</li>' );
}

function successHandler( result )
{
    $( "#app-status-ul" ).append( '<li>success:' + result + '</li>' );
}

function errorHandler( error )
{
    $( "#app-status-ul" ).append( '<li>error:' + error + '</li>' );
}
//pad zero before one digit number
function pad( val )
{
    return val > 9 ? val : "0" + val;
}
var UploadAudioFail = function ( error )
{
    alert( 'fail upload audio' );
    document.getElementById( "postInpu" ).value = 'fail upload audio= ' + JSON.stringify( error );
    $( '#Timer' ).append( JSON.stringify( error ) );
};
//CLOSE OPEN Menu WHEN USER CLICK ON LINK
function Toggle_Menu()
{
    console.log( $( "#deviceready" ).css( "left" ) );
    if ( $( "#deviceready" ).css( "left" ) == "0px" )
    {
        console.log( ' is ' );
        $( "#deviceready" ).animate( {            left : "90%"        } );
        $( "#Menu" ).animate( {            left : "0%"
        } , function ()
        {
            $( "#closeMenu" ).show();
            $( "#openMenu" ).hide();
        } );
    }
    else
    {
        $( "#deviceready" ).animate( {            left : "0"        } );
        $( "#Menu" ).animate( {            left : "-100%"        } , function ()
        {
            $( "#closeMenu" ).hide();
            $( "#openMenu" ).show();
        } );
    }

}
//save the camera user preference setting
function saveSettingCamera()
{
    if ( ($( '#autoCamera' ).is( ":checked" )) == true )
    {
        localStorage.setItem( 'autoCamera_L' , '1' );
    }
    else
    {
        localStorage.setItem( 'autoCamera_L' , '' );
    }
    //  console.log( localStorage.getItem( 'autoCamera_L' ) );

}
//act as toast in android
var toast = function ( msg , delay )
{
    (delay == undefined || delay == '') ? delay = 2000 : '';
    $( "<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'>" + msg + "</div>" )
        .css( { display  : "block" ,
            opacity      : 1 ,
            position     : "fixed" ,
            textShadow   : "none !important" ,
            padding      : "7px" ,
            color        : "white" ,
            fontSize     : "150%" ,
            "text-align" : "center" ,
            fontWeight   : "normal  !important" ,
            width        : "270px" ,
            left         : ($( window ).width() - 284) / 2 ,
            top          : $( window ).height() / 2 } )
        .appendTo( $.mobile.pageContainer ).delay( 2000 )
        .fadeOut( 400 , function ()
        {
            $( this ).remove();
        } );
}

//load default functions on load
$( document ).ready( function ()
{
    $( '#Menu' ).load( 'include/menu.html' , function ()
    {
        console.log( ' is ' + localStorage.getItem( "show_devMessage" ) );
        if ( localStorage.getItem( "show_devMessage" ) == 1 )
        {
            console.log( ' is ' + localStorage.getItem( "show_devMessage" ) );
            $( '#Dev_Messages' ).show();

        }
        if ( localStorage.getItem( 'autoCamera_L' ) == '1' )
        {
            $( '#autoCamera' ).prop( 'checked' , true ).checkboxradio( 'refresh' );

        }


    } );
    //$.mobile.loading('show');
    $( "#Menu" ).on( "swipe" , function ()
    {
        Toggle_Menu();
    } );

    //$( '#Dev_Messages' ).hide();

    //$("#record_Section").stick_in_parent({offset_top: 200});


} );
