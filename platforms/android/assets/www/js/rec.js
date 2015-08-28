/**
 * Created by Rami Cohen on 26/04/15.
 * js file for the recordings page
 * dealing with the recordings , taking pictures and adding tags functionality
 */
//_________________VARIABLES
var CurUpload = API_Url + 'session/uploadAudio';//        http://lecturus.herokuapp.com/session/uploadImage
var CurUploadImg = API_Url + 'session/uploadImage';
//var CurUploadImg = CurUpload = 'http://ramiir.site90.com/upload.php';//        http://lecturus.herokuapp.com/session/uploadImage
var uploadToMp3 = CurUpload;
var tagsToSend = new Array();
var EmailC = localStorage.getItem( "email_L" );
var sessionC = localStorage.getItem( "session_L" );
var diff = localStorage.getItem( "diff_L" );
var OrgC = 'shenkar';
var secInterval, pictureWasTake = false;
var secShow = 0;
var index = 1;
var maxSave = 3;
var curInd = nextInd = 1;
var app = {    // Application Constructor
    initialize    : function ()
    {
        this.initializeAll();
        this.bindEvents();
    } ,        // Bind Event Listeners    //    // Bind any events that are required on startup. Common events are:    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents    : function ()
    {
        document.addEventListener( 'deviceready' , this.onDeviceReady , false );
    } ,
    initializeAll : function ()
    {
        $( document ).ready( function ()
        {//            $( "#errorMsg" ).text( 'session = ' + sessionC );
            $("#Thank_message_owner button:nth-of-type(1),#Thank_messge button:nth-of-type(1)").click( function (  )
            {
                location='home.html'
            } );
            $("#Thank_message_owner button:nth-of-type(2),#Thank_messge button:nth-of-type(2)").click( function (  )
            {
                updateUser( 'exit' );
            } );
            $("#Thank_message_owner button:nth-of-type(3)").click( function (  )
            {
                location='create_session.html'
            } );
            if ( localStorage.getItem( "owner_L" ) == 'undefined' || localStorage.getItem( "owner_L" ) == '' )
            {//is the owner of the recordings
                $( '#blockFromParticipants' ).hide();
            }
            else
            {//participants
                $( '#blockFromParticipants' ).show();
                //  alert( localStorage.getItem( "owner_L" ) );
                $( '#recordBtn' ).hide();
                $( '#messageOpenSession' ).text( 'session is about to begin' );

            }
            initBtns();

        } );
        function initBtns()
        {            //init the buttons for the tags

            for(i=1; i<=Num_Tags; i++)
            {
                $(".Notes " ).append($("<li>").attr('id','tag'+i).text(localStorage.getItem( 'tag'+i+'_L' )));

             //   <li id="tag1"></li><li id="tag2"></li><li id="tag3"></li><li id="tag4"></li>
                //$( "#tag"+i ).val( localStorage.getItem( 'tag'+i+'_L' ) );

            }

            $( ".Notes li" ).click( function ()
            {
                if ( secShow > 0 )
                {
                    timestamp = secShow;//(Math.floor( Date.now() / 1000 )) + parseInt( localStorage.getItem( "diff_L" ) );
                    var object = {'timestamp' : timestamp , 'text' : $( this ).text()};// 'email' : EmailC,                //object[timestamp] = $( this ).text();
                    tagsToSend.push( object );                //insert all the button to the array
                    secTemp = pad( timestamp % 60 );
                    minutesTemp = pad( parseInt( timestamp / 60 , 10 ) );
                    $( "#NotesDisplay ul" ).append( '<li><aside>' + minutesTemp + ': ' + secTemp + '</aside><section>' + $( this ).text() + '</section></li>' );
                    /*                    $("#errorMsgAjax").empty();                     $( "#errorMsgAjax" ).append( JSON.stringify( tagsToSend ) );*/
                }                //    $( "#Timer" ).append(  ' tag\'s post Inputs = <pre>' + preJs( tagsToSend ) + '</pre>' );
            } );
        }
    } ,    // deviceready Event Handler        //    // The scope of 'this' is the event. In order to call the 'receivedEvent'    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady : function ()
    {
        document.addEventListener( "backbutton" , function ( e )
        {
            e.preventDefault();
        } , false );
        registerNotification();
        app.receivedEvent( 'deviceready' );
        var messageBox = document.getElementById( "Wrapper_Body" ).querySelector( '.System_Messeges' );
        //Prepares File System for Audio Recording        /*var fileName = 'media/1';         var fileName = '1'*/
        var mediaRec = [];//array for switching the media files
        for ( i = 1 ; i < maxSave ; i++ )
        {            // i = 1;
            mediaRec[i] = new Media( i + '.amr' , function ()
                {
                    uploadVoice( i + '.amr' , '' , 'audio/amr' , uploadToMp3 );//audio/wav for ios
                } ,        // error callback
                function ( err )
                {
                    toast( "recordAudio():Audio Error: " + err.code );
                }
            );
        }
        //upload the audio file
        function uploadVoice( fileName , dirName , fileMime , uploadURL )
        {
            fileName = curInd + '.amr';//            $( "#Timer" ).append( '\n____________fileName = '+fileName );
            var UploadAudioSucceed = function ( r )
            {
                $( '#Timer' ).append( "Code = " + r.responseCode + "Response = " + r.response + "Sent = " + r.bytesSent + 'url to upload = ' + uploadToMp3 );                //messageBox.innerHTML = "Code = " + r.responseCode + "Response = " + r.response + "Sent = " + r.bytesSent + 'url to upload = ' + uploadToMp3;
                index++;
                curInd = nextInd;
            };
// file system fail
            var fsFail = function ( error )
            {
                toast( "failed with error code: " + error.code , 5000 );
            };
            var dirFail = function ( error )
            {
                toast( "Directory error code: " + error.code , 5000 );
            };
            var fileURI;
            var gotFileSystem = function ( fileSystem )
            {//prepare the mp3 audio file for upload
                fileSystem.root.getDirectory( dirName , { create : true , exclusive : false } ,
                    function ( dataDir )
                    {
                        fileURI = dataDir.fullPath;
                        fileURI = fileURI + '/' + fileName;
                        var options = new FileUploadOptions();
                        options.fileKey = "file";
                        options.fileName = fileURI.substr( fileURI.lastIndexOf( '/' ) + 1 );
                        options.mimeType = fileMime;
                        var params = new Object();
                        params.sessionId = localStorage.getItem( "session_L" );
                        params.email = localStorage.getItem( "email_L" );
                        params.timestamp = (Math.floor( Date.now() / 1000 )) + parseInt( localStorage.getItem( "diff_L" ) );
                        params.data = options.fileName;
                        params.type = 'audio';
                        params.audioLength = (sec > 0) ? sec : 60;
                        sec = 0;
                        options.params = params;//alert(fileURI);                        // document.getElementById( "postInpu" ).value = 'postInput for  upload audio = ' + JSON.stringify( options.params ) + ' ' + Convert_seconds_HH( params.timestamp );
                        $( "#Timer" ).append( ' fileURL  ' + fileURI + ' upload audio\'s post Inputs = <pre>' + preJs( options.params ) + '</pre>' );
                        fileURI = fileSystem.root.toURL() + fileName                    //fileURI='mnt/sdcard'+fileURI;
                        var ft = new FileTransfer();
                        ft.upload( fileURI , encodeURI( uploadURL ) , UploadAudioSucceed , UploadAudioFail , options );
                    } , dirFail );
            };
            window.requestFileSystem( LocalFileSystem.PERSISTENT , 0 , gotFileSystem , fsFail );// get file system to copy or move image file to
        }


//            record the Audio file
        function recordAudio()
        {
            sec = secShow = 0;
            startTImeShow = startTIme = Math.floor( Date.now() / 1000 );
            messageBox.innerHTML = ' startRecord .. ';
            mediaRec[curInd].startRecord();            // Stop recording after 10 minutes
            secInterval = setInterval( function () {myTimer()} , 1000 );
            function myTimer()
            {
                sec = ((Math.floor( Date.now() / 1000 )) - startTIme);
                secShow = ((Math.floor( Date.now() / 1000 )) - startTImeShow);
                document.getElementById( "seconds" ).innerHTML = pad( secShow % 60 );
                document.getElementById( "minutes" ).innerHTML = pad( parseInt( secShow / 60 , 10 ) );                //messageBox.innerHTML=window.orientation+' '+d.toLocaleTimeString()+' '+pictureWasTake;
                if ( (window.orientation == 90 || window.orientation == 180 ) && !pictureWasTake && ( localStorage.getItem( 'autoCamera_L' ) == '1' ) )
                {                    //$( "#Timer" ).val( sec++ );
                    pictureWasTake = true;
                    takePicture();                    //messageBox.innerHTML = 'takepicture' + ' ' + d.toLocaleTimeString() + ' ' + pictureWasTake;
                }
                if ( (sec % divideTime) == 0 )
                {
                    curInd = (index % 2) ? 1 : 2;
                    nextInd = (curInd == 1) ? 2 : 1;
                    mediaRec[curInd].stopRecord();//                    $( "#Timer" ).append( '____________index = '+index );                    //(index==maxSave-1)?index=1:index++;                    $( "#Timer" ).append( '____________index = '+index );
                    mediaRec[nextInd].startRecord();

                    startTIme = Math.floor( Date.now() / 1000 );
                }

            }
        }

//stop the Audio progress
        function stopAudio()
        {            //      $( ".Notes" ).hide();
            mediaRec[curInd].stopRecord();
            messageBox.innerHTML = 'file was uploaded ';//messageBox.innerHTML = uploadToMp3;
            clearInterval( secInterval );
            if ( tagsToSend.length > 0 )
            {
                uploadTags();
            }
            pictureWasTake = false;
        }

        //switch Owner button
        $( "#switchOwnerBtn" ).click( function ()
        {
            dataPost = {  'email' : EmailC , 'sessionId' : sessionC }
            $.ajax( {
                url      : API_Url + "session/seekSessionStandby " ,
                type     : "POST" ,
                data     : dataPost ,
                dataType : "json" ,                                       //{"uid":"ass@b.c","status":2,"desc":"user exist"}
                success  : function ( result )
                {
                    $( "#Timer" ).append( ' seekSessionStandby result= <pre>' + preJs( result ) + '</pre>' );
                    if ( result.status == 0 )
                    {
                        stopAudio();
                    }
                    else
                    {
                        $( "#errorMsg" ).text( result )
                    }
                } ,
                error    : errorFromAjaxCall
            } );
        } );
        //take the Picture with the parameters
        function takePicture( fromLib )
        {
            navigator.camera.getPicture( uploadPhoto , function ( message ) { $( "#Timer" ).append( 'get picture failed' ); } ,
                { quality           : 50 ,
                    destinationType : navigator.camera.DestinationType.FILE_URI ,
                    sourceType      : ((fromLib != undefined) ? navigator.camera.PictureSourceType.PHOTOLIBRARY : navigator.camera.PictureSourceType.CAMERA ) ,//PHOTOLIBRARY
                    encodingType    : 0
                }
            );
        }

        //stop the session and display the correct messages to the participants and to the owner
        function stopSession()
        {
            stopAudio();
            $( "#Menu nav > ul" ).show();
            document.getElementById( "stopBtn" ).style.display = "none";
            setTimeout( function ()
            {
                startStopRec( 0 );
            } , 5000 );//60000
            $( "#record_Section" ).hide();
            $( "#Thank_message_owner" ).show();

        }

        document.getElementById( "CameraBtn" ).addEventListener( "click" , function ()
        {
            takePicture();
        } , false );
        document.getElementById( "recordBtn" ).addEventListener( "click" , function ()
            {
                this.style.display = "none";
                $( '#CameraBtn,#switchOwnerBtn' ).css( 'display' , 'inline-block' );
                $( "#stopBtn" ).show();
                $( "#Menu nav> ul" ).hide();
                recordAudio();                    //$( this ).hide();
                startStopRec( 1 );

            } ,
            false );
        document.getElementById( "stopBtn" ).addEventListener( "click" , function ()
            {
                stopSession();
            } ,
            false );

//upload the Photo to the server
        function uploadPhoto( imageURI )
        {
            messageBox.innerHTML = 'uploading Image to ' + CurUploadImg + ' Please be patient';
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = imageURI.substr( imageURI.lastIndexOf( '/' ) + 1 );
            options.mimeType = "image/jpeg";
            var params = new Object();
            //set the parameters
            params.timestamp = secShow;//(Math.floor( Date.now() / 1000 )) + parseInt( localStorage.getItem( "diff_L" ) );
            params.sessionId = localStorage.getItem( "session_L" );
            params.email = localStorage.getItem( "email_L" );
            params.data = options.fileName;
            params.type = 'image';
            options.params = params;            //document.getElementById( "errorMsgAjax" ).value = JSON.stringify( options.params );
            $( "#Timer" ).append( ' file URL  ' + imageURI + ' upload image\'s post Inputs = <pre>' + preJs( options.params ) + '</pre>' );
            options.chunkedMode = false;
            var ft = new FileTransfer();
            ft.upload( imageURI , encodeURI( CurUploadImg ) , win , fail , options );
            setTimeout( function ()
            {
                pictureWasTake = false;
            } , 10000 );//60000

        }

        function win( r )
        {                /*alert( "Code = " + r.responseCode );                 alert( "Response = " + r.response );                 alert( "Sent = " + r.bytesSent );*/
            //messageBox.innerHTML = r + "Code = " + r.responseCode + "Response = " + r.response + "Sent = " + r.bytesSent;
            messageBox.innerHTML = 'images was uploaded';
        }

        function fail( error )
        {
            $( "#Timer" ).append( HR + '!!!!error!!!! with uploading image <pre>' + preJs( error ) + '</pre>' );
            toast( 'error with uploading image, no network connection ' , 5000 );
        }


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
/*                    mediaRec[1].stopRecord();                     (index<maxSave)?index++:index=1;                     mediaRec[1].startRecord();*/