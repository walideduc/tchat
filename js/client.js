$(document).ready(function(){
    var socket = io.connect('http://localhost:1337');
    var msgtpl_left = $('#msgtpl_left').html();
    $('#msgtpl_left').remove();
    var msgtpl_right = $('#msgtpl_right').html();
    $('#msgtpl_right').remove();
    var lastmessage = false ;
    var user_id = false ;
    $('#loginform').submit(function(event){
        event.preventDefault();
        socket.emit('login',{ // envoyer un evenement à notre serveur
            mail : $('#mail').val(),
            username : $('#username').val()
        });
    });

    socket.on('logged',function(userid){
        $('#loginform').fadeOut();
        user_id = userid ;
        $('#message').focus();
    });
    /**
     * Envoies des messages
     */
    $('#sendform').submit(function(event){
        event.preventDefault();
        socket.emit('newmsg',{ message : $('#message').val() });
        $('#message').val('');
        $('#message').focus();
    });
    socket.on('newmsg',function(message){
        if( lastmessage != message.user.id){ // pour separer le discour de diffirent users
            $('#messages').append('<hr class="'+'hr-clas" />');
            lastmessage = message.user.id ;
        }
        if( user_id != message.user.id){
            $('#messages').append(Mustache.render(msgtpl_left,message));
        }else{
            $('#messages').append(Mustache.render(msgtpl_right,message));
        }
        $('#messages').animate({scrollTop : $('#messages').prop('scrollHeight')},500);
    })

    /**
     *  Gestion de connectés
     */
    socket.on('newuser',function(user){
        $('#users').append('<div id="'+ user.id+'" > <img src="'+user.avatar+'"class="img-circle" /> (@'+user.username+')<hr class="hr-clas-low'+' " /> </'+ 'div>' );
    });
    socket.on('disuser',function(user){
        $('#' + user.id).remove();
    });

});