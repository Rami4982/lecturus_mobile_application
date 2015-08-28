/**
 * Created by user on 16/03/15.
 * functions for the rec page
 */
//start or Stop Rec functions
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
                tagsToSend.length = 0;
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
