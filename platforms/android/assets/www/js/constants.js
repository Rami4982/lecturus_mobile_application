var API_Url = 'http://lecturus.herokuapp.com/';//        http://lecturus.herokuapp.com/session/uploadImage

var CurUpload = API_Url + 'session/uploadAudio';//        http://lecturus.herokuapp.com/session/uploadImage
var CurUploadImg = API_Url + 'session/uploadImage';
var AUTH0_CLIENT_ID = 'jz66JZzwou5QxIthr3F2HduTO8RdVJWG';
var AUTH0_DOMAIN = 'lecturus.auth0.com';
var AUTH0_CALLBACK_URL = location.href;
var pushNotification;
var startTIme, startTImeShow = 0;
var divideTime = 60;
var Num_Tags = 4;
var HR = '<br> _____________<br>';
var EmailC = (  localStorage.getItem( "email_L" ) == undefined || localStorage.getItem( "email_L" ) == '') ? '' : localStorage.getItem( "email_L" );//ramycohen@gmail.com
var UserC = {};
(  localStorage.getItem( 'tag1_L' ) == undefined || localStorage.getItem( 'tag1_L' ) == '') ? localStorage.setItem( 'tag1_L' , 'Important' ) : '';
(  localStorage.getItem( 'tag2_L' ) == undefined || localStorage.getItem( 'tag2_L' ) == '') ? localStorage.setItem( 'tag2_L' , 'Not Clear' ) : '';
(  localStorage.getItem( 'tag3_L' ) == undefined || localStorage.getItem( 'tag3_L' ) == '') ? localStorage.setItem( 'tag3_L' , 'For Test!' ) : '';
(  localStorage.getItem( 'tag4_L' ) == undefined || localStorage.getItem( 'tag4_L' ) == '') ? localStorage.setItem( 'tag4_L' , 'Check Fact' ) : '';
(  localStorage.getItem( 'autoCamera_L' ) == undefined || localStorage.getItem( 'autoCamera_L' ) == '') ? localStorage.setItem( 'autoCamera_L' , '' ) : '';
//in case the user has already logged with the application once than set the global vaRIBALE userc with the user_l value
if ( localStorage.getItem( "user_L" ) != undefined && localStorage.getItem( "user_L" ) != '' )
{
    UserC = localStorage.getItem( "user_L" );
    UserC = JSON.parse( UserC );
}//ramycohen@gmail.com


// API key  AIzaSyAjgyOeoxz6TC8vXLydERm47ZSIy6tO_6I "senderID" : "910330551860"