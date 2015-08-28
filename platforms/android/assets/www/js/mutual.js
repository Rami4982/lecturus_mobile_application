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
//for rec