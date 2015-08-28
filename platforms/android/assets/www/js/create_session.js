/**
 * Created by Rami Cohen on 26/04/15.
 * js file for the create session page
 * dealing with the creation  of the session after the user chooses the degree and the courses and redirecting the user according to the server response
 */
var whereLoc='rec.html';//variBALES to determine whether the user will be redirected to rec or add members page
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
        {//            $( "#errorMsg" ).text( EmailC );
            $(".submit img:nth-of-type(1)").click( function ( e )
            {
                submitAndGo( 'add_members.html')
            } );
            $(".submit img:nth-of-type(2)").click( function ( e )
            {
                submitAndGo( 'rec.html');
            } );


            dt = new Date();
           $( "#name" ).val( '' + (dt.getHours()) + ":" + dt.getMinutes() + ":" + dt.getSeconds() );
            $( "#Subject" ).val(UserC.Subject);
            //first try to load the degree list from loCAL storage in order to save complexity and server redundant calls
            if(  localStorage.getItem( "degrees_L" )!=undefined && localStorage.getItem( "degrees_L" )!='')
            {
                degreesC = localStorage.getItem( 'degrees_L' );
                populateDegree( JSON.parse(degreesC));
            }
            else
            {//get the degree from the server
                $.ajax( {
                    url      : API_Url + "auxiliary/getCoursesByOrg " ,
                    type     : "POST" ,
                    data     : {  'email' : EmailC , 'org' : 'shenkar'} ,
                    dataType : "json" ,
                    success  : function ( result )
                    {//                        console.log( result.degrees );
                        if ( result.status == 1 )
                        {
                            localStorage.setItem( 'degrees_L' , JSON.stringify(result.degrees ));
                            populateDegree( result.degrees);
                        }
                        else
                        {
                            $( "#errorMsg" ).text( result.desc )
                        }
                    } ,
                    error    :errorFromAjaxCall
                } );
            }
        } );

        $( "#myform" ).submit( function ( event )
        {
            event.preventDefault();

        } );
        //depend on what the user click submit the form and redirect him to the desired page
        submitAndGo=function (whereLocP)
        {
            whereLoc=whereLocP
            document.forms['myform'].submit();
        }

        sendJson = function ()
        {//in case of public show the user alert meSSAGE

                localStorage.setItem( 'private_L' , '' );
                privateC=0;

//populate all the vaRIBALES with what the user chose
            UserC.Category=CategoryC = $( "#listOfDegrees" ).val();
            UserC.Courses=CoursesC = $( "#listOfCourses" ).val();
            UserC.Lecturers=LecturersC = $( "#listOfLecturers" ).val();
            nameC = $( "#name" ).val();
            roomC = $( "#room" ).val();
            UserC.Subject=SubjectC = $( "#Subject" ).val();
            dataPost = {'degreeId' : CategoryC , 'courseId' : CoursesC , 'degree' : $( "#degree" ).val() , 'course' : $( '#course' ).val() , 'lecturer' : LecturersC , 'description' : SubjectC , 'title' : nameC , 'email' : EmailC , 'org' : 'shenkar','private':privateC};
            if ( LecturersC != undefined &&  LecturersC != '' &&   $( '#course' ).val().length>0)
            {
                $("#loader" ).show();
                $("#deviceready" ).css("opacity","0.3");
                //send the request to the server
                $.ajax( {
                    url      : API_Url + "session/createSession" ,//page not allowed lecturus
                    type     : "POST" ,                                           //{"uid":"a@b.c","status":2,"desc":"user exist"}
                    data     : dataPost ,
                    dataType : "json" ,                                       //{"uid":"ass@b.c","status":2,"desc":"user exist"}
                    success  : function ( result )
                    {
                        //console.log( result );
                        if ( result.status == 1 )
                        {
                            timestamp = result.timestamp;
                            diff = parseInt( timestamp ) - (Math.floor( Date.now() / 1000 ));

                            localStorage.setItem( "diff_L" , diff );
                            (nameC=='testrami')?  localStorage.setItem( "show_devMessage" , 1 ):'';
                            localStorage.setItem( "session_L" , result.sessionId );
                            localStorage.setItem( "owner_L" , '' );
                            localStorage.setItem( 'user_L' , JSON.stringify(UserC ));
                            toast('loading');
                            location =whereLoc;
                        }

                        else
                        {
                            $( "#errorMsg" ).text( result.desc )
                        }
                    } ,
                    error    : function ( xhr , ajaxOptions , thrownError )
                    {
                        toast( 'server is not available. no network connection',5000 )
                    }
                } );

            }

        };
//populate the Degrees list according to what the user chose
        populateDegree = function ( degrees )
        {
            var listitems;
            //in order to save complexity first populate all the degrees to varIBALE and then assign it to the dom
            $.each( degrees , function ( key , val )
            {
                listitems += '<option title="' + val.name + '" value="' + val.id + '" name="' + key + '" '+ ((UserC.Category==val.id)?'selected = "selected"':'')+'>' + val.name + '</option>';


            } );
            $( "#listOfDegrees" ).append(listitems);
            if(UserC.Category!=undefined && UserC.Category!='')
            {
                $( '#degree' ).val(   $( "#listOfDegrees" ).find( "option:selected" ).attr( "title" ) );
                degreeSelectedPosition = $( "#listOfDegrees" ).find( "option:selected" ).attr( "name" );
                populateCourse(degrees[degreeSelectedPosition ].courses);
            }

            $('#listOfCourses').children().remove();
            $( '#listOfDegrees' ).focus();
            $( "#listOfDegrees" ).change( function ()
            {
                $('#listOfCourses')
                    .find('option')
                    .remove()
                    .end()
                    .append('<option  value="" selected>choose course</option>')
                    .val('')
                ;
                $( '#course' ).empty();
                $('#listOfCourses')[0].options.length = 0;
                $( "#listOfCourses" ).val('');
                $( "#listOfLecturers" ).empty();
                $( '#degree' ).val( $( this ).find( "option:selected" ).attr( "title" ) );
                degreeSelectedPosition = $( this ).find( "option:selected" ).attr( "name" );                //console.log($( this ).find( "option:selected" ).attr( "value" ));
                populateCourse(degrees[degreeSelectedPosition ].courses);
            });


        }
        //populate the Courses list according to what the user chose
        populateCourse= function (coursesC)
        {
            $( "#listOfCourses" ).empty();
            $( "#listOfLecturers" ).empty();
            var listlecturers='<option  value="">choose lecturer</option>';
            var listcourse='<option  value="">choose course</option>';
            //in order to save complexity first populate all the degrees to varIBALE and then assign it to the dom
            $.each( coursesC, function ( key , val )
            {
                listcourse += '<option title="' + val.name + '" value="' + val.id + '" name="' + key + '">' + val.name + '</option>';
            } );
            $( "#listOfCourses" ).append(listcourse);
            $( "#listOfCourses" ).change(function()
            {
                $( "#listOfLecturers" ).empty();
                $( '#course' ).val( $( this ).find( "option:selected" ).attr( "title" ) );
                courseSelectedPosition = $( this ).find( "option:selected" ).attr( "name" );
                //populate the lecturers list according to what the user chose
                $.each( coursesC[courseSelectedPosition].lecturers, function ( key , val )
                {
                    listlecturers += '<option value="' + val + '" >' + val + '</option>';
                } );
                $( "#listOfLecturers" ).append(listlecturers );
            })

        }
    } ,
    onDeviceReady : function ()
    {
        //prevent the back button from being active as the user is in recordings process and back button can cause multiply problems in the order of the recordings process
        document.addEventListener( "backbutton", function ( e )
        {
            e.preventDefault();
        }, false );
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

/*
if ( ($( '#private' ).is( ":checked" )) == true )
{
    localStorage.setItem( 'private_L' , '1' );
    privateC=1;

}
else
{}*/
