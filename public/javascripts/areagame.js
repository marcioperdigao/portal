var areaGame=function(){
    this.statesChannels=["Rio de Janeiro","São Paulo","Bahia","New York","London","Berlin"];
    this.statesBreve=["RJ","SP","BH","NY","BE"];
    console.log("Chat started");
    this.areaDoGame=document.getElementById("areadogame");
    this.signUp=document.getElementById("cadastrando");
    this.signUp.style.visibility="hidden";
    this.areaDoGame.style.visibility="visible";
    console.log(playerData);

};
areaGame.prototype.newChannel=function(socket){
    console.log("CANAL CRIANDO");
    this.divCreateChannel=document.createElement('div');
    this.divCreateChannel.id="divCreateChannel";
    this.divCreateChannel.style.width="30%";
    this.divCreateChannel.style.height="30%";
    this.divCreateChannel.style.position="absolute";
    this.divCreateChannel.style.top="1%";
    this.divCreateChannel.style.left="30%";
    this.divCreateChannel.style.backgroundColor="blue";
    this.divCreateChannel.style.right="1%";



    var formCreateChannel=document.createElement('form');
    formCreateChannel.id="formCreateChannel";
    formCreateChannel.class="";
    formCreateChannel.action='javascript:void(0);';

    var SelectCreateChanel=document.createElement('select');
    SelectCreateChanel.class="form-control";
    SelectCreateChanel.id="SelectCreateChanel";
    SelectCreateChanel.style.width="200px";
    SelectCreateChanel.name="SelectCreateChanel";



    SelectCreateChanel.length=0;
    SelectCreateChanel.options[0]=new Option('Select Channel','-1');
    SelectCreateChanel.selectedIndex=0;

    for(var i=0;i<this.statesChannels.length;i++){
        SelectCreateChanel.options[SelectCreateChanel.length]=new Option(this.statesChannels[i],this.statesBreve[i]);
    }

    var labelCreateChannel=document.createElement('label');
    labelCreateChannel.for="SelectCreateChanel";
    labelCreateChannel.innerHTML="Selecione o Canal";
    labelCreateChannel.style.fontSize="0.8em";

    var submitCreateChannel=document.createElement('input');
    submitCreateChannel.type="submit";
    submitCreateChannel.class="btn-primary";
    submitCreateChannel.value="Acessar";
    submitCreateChannel.id="submitCreateChannel";
    submitCreateChannel.style.display="block";
    submitCreateChannel.style.position="absolute";
    submitCreateChannel.style.left="30%";

    formCreateChannel.appendChild(labelCreateChannel);
    formCreateChannel.appendChild(SelectCreateChanel);

    formCreateChannel.appendChild(submitCreateChannel);
    this.divCreateChannel.appendChild(formCreateChannel);

    document.getElementById('areadogame').appendChild(this.divCreateChannel);

    submitCreateChannel.addEventListener('click',function(){
        console.log("teste submit");
        if(SelectCreateChanel.value!=-1){
            socket.emit('changeChannel',{channel:SelectCreateChanel.value});
        }

    })

};


