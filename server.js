var http = require('http');
var md5 = require('MD5');
httpServer = http.createServer(function(req,res){
    console.log('a user has seen the page ');
})
httpServer.listen(1337);
var io = require('socket.io').listen(httpServer);
var users = {}; // variables global coté serveur intialisé une fois lors que on demare le server via nodjs
var messages = []; //
var history = 2 ; //
io.sockets.on('connection',function(socket){
    var me = false ;
    /**
     *  Je me connecte
     */
    socket.on('login',function(user){
        me = user;
        me.id = user.mail.replace('@','-').replace('.','-');
        for(var k in users){
            socket.emit('newuser',users[k]);
        }

        for(var k in messages){
            socket.emit('newmsg',messages[k]);
        }
        users[me.id] = me ;
        me.avatar = 'https://gravatar.com/avatar/'+ md5(user.mail) +'?s=50';
        io.sockets.emit('newuser',me);              //socket.broadcast.emit('newuser');// broadcast alert tous les autres utilisateur saf l'utilisateur corant
        socket.emit('logged',me.id);
    })
    /**
     * Je quite le chat .
     */
    socket.on('disconnect',function(){
        if(!me){ return false;  }
        delete users[me.id];
        io.sockets.emit('disuser',me);
    });

    /**
     * Je recois un nouveau message
     */
    socket.on('newmsg',function(message){
        message.user = me ;
        d = new Date();
        message.h = d.getHours();
        message.m = d.getMinutes();
        messages.push(message);
        if(messages.length > history ){
            messages.shift();
        }
        io.sockets.emit('newmsg',message);
    });
});