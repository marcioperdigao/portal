const GAME_STATE_SIGNOFF = 0;
const GAME_STATE_SIGNIN = 1;
const GAME_NEW_CHANNEL = 2;
const GAME_STATE_ROOM= 3;
const GAME_STATE_ONGAME = 4;
const GAME_STATE_EXIT = 5;
var gameState=0;
var playerData={
    gameState:0
};

    function switchGame(){
        console.log(playerData.gameState);
        switch (playerData.gameState){
            case GAME_STATE_SIGNOFF :

                toMySql();
                break;
            case GAME_STATE_SIGNIN :
                var connectIo=new ioConnection();
                break;
            case GAME_NEW_CHANNEL:

                break;

        }
        console.log("fjdskf");
    }
switchGame();

var ioConnection=function(){

    var messagesToPrint=[];
    this.gameNow=new areaGame();
    console.log("io conectando");
    var socket=io({'multiplex': false});
    console.log("io conectado");

    //update the chat: basically the players online
    socket.on('updateChat',function(data){
        console.log(data);
        var selectPlayers=document.getElementById('chat-to');
        selectPlayers.length=0;
        selectPlayers.options[0]=new Option('Todos','-1');
        selectPlayers.selectedIndex=0;
        for(var i=0;i<data.length;i++){
            selectPlayers.options[selectPlayers.length]=new Option(data[i].user,data[i].user);
        }
    });

    var submitMessage=document.getElementById('submit-chat');
    var _this=this;
    submitMessage.addEventListener('click',submiting);

        function submiting(){
            var  messageChat=document.getElementById('message').value;
            socket.emit('message-chat-to-server',{messageChat:messageChat});
            console.log("MENSAGEM");

        }

    socket.on('message-chat-to-client',function(data){

        document.getElementById('message').value="";
        var messages=document.getElementById('messages');

        //var lix=messages.getElementsByTagName('li');
        if(messagesToPrint.length<30){

            messagesToPrint[messagesToPrint.length]=data.userName+data.messageChat;

            var li=document.createElement('li');
            var text=document.createTextNode(messagesToPrint[messagesToPrint.length-1]);
            li.appendChild(text);
            messages.appendChild(li);
           messages.scrollTop+=500;

        }
        else{
            var lix=messages.getElementsByTagName('li');
            for(var i=0;i<29;i++){
                lix[i].innerHTML=lix[i+1].innerHTML;

            }

            lix[29].innerHTML=data.messageChat;
            messages.scrollTop+=500;
            console.log(data.messageChat);
        }



    });

    //Change Channel
    document.getElementById('createChannel').addEventListener('click',function(){
        _this.CreateChannel(socket);
    });

    socket.on('changeChannelClient',function(data){

        console.log(data.channel);
        _this.gameNow.divCreateChannel.style.display="none";
    });

    //logout
    function logOut(){
        //disconnect to reconnect without problem later;
        messagesToPrint=[];
        socket.disconnect();

        submitMessage.removeEventListener('click',submiting);
        logout.removeEventListener('click',logOut);


        var xmlhttp=new XMLHttpRequest();
        var id=playerData.idOnline;
        console.log(id);
        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4 && xmlhttp.status==200){

                if(playerData.gameState==1){
                    var sectionLogin=document.getElementById("section-login");
                    var sectionLogout=document.getElementById("section-logout");
                    var areaDoGame=document.getElementById("areadogame");
                    this.signUp=document.getElementById("cadastrando");
                    this.signUp.style.visibility="visible";
                    areaDoGame.style.visibility="hidden";
                    sectionLogin.style.visibility="visible";
                    sectionLogout.style.visibility="hidden";

                    playerData=null;
                    console.log(playerData);
                    playerData={
                        gameState:0
                    };
                }
                switchGame();
            }
        };

        xmlhttp.open('post','/users/signout',true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send("id="+id);
    }

    var logout=document.getElementById('logout');
    logout.addEventListener('click',logOut);

};


ioConnection.prototype.CreateChannel=function(socket){
    console.log("criando");
    this.gameNow.newChannel(socket);
    console.log("ate aqui");
};