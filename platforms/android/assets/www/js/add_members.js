/**
 * Created by Rami Cohen on 26/04/15.
 * js file for the add members page
 * dealing with the adding of the members after the user chooses the degree and the courses and redirecting the user according to the server response
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
        $( document ).ready( function ()
        {
            $( '#addMembers' ).click( function ( e )
            {
                addSelectedMembers();
            } );


            //change the  color for the li that was chosen in the online members list
            changeColor = function ( thisCur )
            {//                console.log(' is '+$( thisCur ).css( "color" ) );
                if ( $( thisCur ).css( "color" ) == 'rgb(232, 232, 233)' )
                {
                    $( thisCur ).addClass( 'changeColor' );
                }
                else
                {
                    $( thisCur ).removeClass( 'changeColor' );
                }

            }
            //get the Active Users from the user table in the database
            $.ajax( {
                url      : API_Url + "users/getActiveUsers " ,//page not allowed lecturus
                type     : "POST" ,
                data     : {  org : 'shenkar'} ,
                dataType : "json" ,
                success  : function ( data , textStatus , jqXHR )
                {//                    console.log( "get members success" , data );
                    $.each( data.users , function ( index , value )
                    {
                        if ( EmailC != value.email )
                        {
                            $( '#ActiveUsers' ).append( '<li ><label class="" for = "' + index + '_Member" onclick="changeColor(this);">' + value.name + '</label>' +
                                '<input data-cacheval="true" value="' + value.email + '" name="members" id="' + index + '_Member" type="checkbox" ></li>' );
                        }
                    } );
                } ,
                error    : errorFromAjaxCall    } );
        } );
    } ,


    onDeviceReady : function ()
    {
        app.receivedEvent( 'deviceready' );
    } ,
    // Update DOM on a Received Event
    receivedEvent : function ( id )
    {
    }
};
app.initialize();

//add the Selected Members that the user picks from the members list
function addSelectedMembers()
{

    var checkedValues = $( 'input:checkbox:checked' ).map(function ()
    {
        return this.value;
    } ).get();//    console.log( 'members to add: ' , checkedValues )
    dataPost = {  sessionId : localStorage.getItem( "session_L" ) , 'email' : localStorage.getItem( "email_L" ) , participants : checkedValues};
    //return if the all the check box are not selected
    if ( checkedValues.length == 0 )
    {
        return
    }
    $( "#loader" ).show();
    $( "#deviceready" ).css( "opacity" , "0.3" );
//send the request to the server
    $.ajax( {
        url      : API_Url + "session/addMembers " ,
        type     : "POST" ,
        data     : dataPost ,
        dataType : "json" ,
        success  : function ( data , textStatus )
        {
            $( "#Timer" ).append( 'data Post<pre>' + preJs( dataPost ) + '   textStatus=  ' + textStatus + '</pre>' );
            $( "#Timer" ).append( HR + 'server Resutl<pre>' + preJs( data ) + '   textStatus=  ' + textStatus + '</pre>' );
            location = 'rec.html';


        } ,
        error    : errorFromAjaxCall
    } );
}


/*var li = $( '<li>' ).text( value.name );
 var input = $( '<input>' ).attr( {type : 'checkbox' , id : index , name : 'members' , value : value.email} )
 li.prepend( input );*/

/*$( '#ActiveUsers' ).append( '<li><div class="ui-checkbox"><label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off" for = "' + index + '_Member" >' + value.name + '</label>' +
 '<input data-cacheval="true" value="' + value.email + '" name="members" id="' + index + '_Member" type="checkbox"></div></li>' );*/
//$( '#ActiveUsers' ).append( '<li><input  type="checkbox" id="autoCamera" name="test"> <label for = "autoCamera" id="autoCameraLabel">auto activate camera on lanscape mode </label></li>' );
//$( '#ActiveUsers' ).append('<li><button class="ui-btn ui-corner-all ui-btn-inherit " id = "addMembers" onclick = "addSelectedMembers();">add members </button></li>                        <li><button onclick = "location=\'rec.html\';">continue </button></li>');
