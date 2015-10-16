
var app=require('../app');
var usersOnline=app.usersOnline;
var server=require('../bin/www');
var country=require('../routes/country');
var playersOnlineNow=[];
var controlTime=true; //control the function  timeInactivity to only run one time
var controlPageLeft=true; //control the function userLeftThePage to only run one time
var nameSpace='/'; //maybe the default room
setInterval(function(){
    var j=0;
    for(var player in usersOnline.players){

        //console.log(usersOnline.players);
        playersOnlineNow[j]=usersOnline.players[player];
        j++;
    }
},5000);
console.log(playersOnlineNow);
var io=require('socket.io').listen(server);

io.on('connection',function(socket){

    //verify if already have At least one player onliny in the first time the server run
    if(usersOnline.playersOn>0){
        //join the channel all
        socket.channel="all";
        socket.join(socket.channel);
        //store the username and id in the socket session for this client
        console.log("last Online "+usersOnline.lastOnline);
        socket.userName=usersOnline.players[usersOnline.lastOnline].user;
        socket.idOnline=usersOnline.players[usersOnline.lastOnline].idOnline;

        usersOnline.players[usersOnline.lastOnline].socketId=socket.id;
        console.log("socket connected as: "+socket.userName);
        function updateChat(){
            var j=0;

            console.log("sockets id "+io.nsps[nameSpace].sockets.id);
            for(var player in usersOnline.players){

                playersOnlineNow[j]=usersOnline.players[player];
                j++;
            }
            io.emit('updateChat',playersOnlineNow);
        }
        updateChat();

        //if the player is more then X time without request the server then close him
        var date=new Date();
        usersOnline.players[usersOnline.lastOnline].timeOnline=date.getTime();
        usersOnline.players[usersOnline.lastOnline].lastActivity=date.getTime();
        socket.lastActivity=date.getTime();

        function timeInactivity(){
            controlTime=false;
            setInterval(function(){
                var date2=new Date();
                for(var player in io.nsps[nameSpace].sockets){
                    if(io.nsps[nameSpace].sockets[player].lastActivity+30000<date2.getTime()){
                        io.nsps[nameSpace].sockets[player].disconnect('unauthorized');
                    }
                }

                /*
                * verify if have less sockets then players on
                * */
                if(io.nsps[nameSpace].sockets.length<usersOnline.playersOn){
                    console.log("MENOS SOCKETS THEN PLAYERS ON");
                }
                else if(io.nsps[nameSpace].sockets.length>usersOnline.playersOn){

                }
            },3000);
        }
        if(controlTime) timeInactivity();//end players activitys

        socket.on('message-chat-to-server',function(data){

            console.log("MENSAGEM SERVER");
            var dataActivity=new Date().getTime();
            socket.lastActivity=dataActivity;
            usersOnline.players[socket.idOnline].lastActivity=dataActivity;
            io.in(socket.channel).emit('message-chat-to-client',{userName:socket.userName+": ",messageChat:data.messageChat});

        });

        socket.on('changeChannel',function(data){
            console.log(data.channel);
            socket.leave(socket.channel);
            socket.channel=data.channel;
            socket.join(data.channel);
            socket.emit('changeChannelClient',data);
        });


        socket.on('disconnect',function(data){
            //remove the username from global username list
            console.log("DISCONNECTED");
            usersOnline.players.splice(socket.idOnline,1);
            usersOnline.playersOn--;
            console.log("idOnline "+socket.idOnline+" idFree "+usersOnline.idFree);
            usersOnline.idFree[socket.idOnline]=0;
        });
    }
});
