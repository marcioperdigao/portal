
var countriesList=null;
var pessoal={};
//É chamada ao clicar em Sign Up, mostrando o cadastro flutuante, fazendo uma chamada ajax para o servidor para objeter os países e estados
function cadastro() {
    var cad=document.getElementById("cadastroFlutuante");
    cad.style.visibility="visible";
    if(countriesList==null){

    var xmlhttp=new XMLHttpRequest();

    xmlhttp.onreadystatechange=function(){
        if(xmlhttp.readyState==4 && xmlhttp.status==200){
            countriesList=JSON.parse(xmlhttp.responseText);
            listingCountries();
        }
    };
    xmlhttp.open('post','/users/country',true);
    xmlhttp.setRequestHeader("Content-type","application/json");
    xmlhttp.send();
    }
    else{
        listingCountries();
    }
    //criando a lista de paises
    function listingCountries(){
        var countryElement=document.getElementById('country');
        countryElement.length=0;
        countryElement.options[0]=new Option('Select Country','-1');
        countryElement.selectedIndex=0;
        for(var i=0;i<countriesList.length;i++){
            countryElement.options[countryElement.length]=new Option(countriesList[i].sName,countriesList[i].sName);
        }
    }

    var country=document.getElementById('country');

    //Verifica o país escolhido e mostra os estados deste país
    var stateElement=document.getElementById('state');
    stateElement.options[0]=new Option('Select State','-1');
    country.addEventListener('change',function(){
        var stateElement=document.getElementById('state');
        stateElement.length=0;
        stateElement.options[0]=new Option('Select State','-1');
        stateElement.selectedIndex=0;
        var selectedStateElement=document.getElementById('country').selectedIndex;
        for(var i=0;i<countriesList[selectedStateElement-1].states.length;i++){
            stateElement.options[stateElement.length]=new Option(countriesList[selectedStateElement-1].states[i],countriesList[selectedStateElement-1].states[i].state);
        }
    });

    var closeButton=document.getElementById('button-close');
    closeButton.addEventListener('click',function(){

        var cad=document.getElementById("cadastroFlutuante");
        cad.style.visibility="hidden";
    });


}
function toMySql(){


    function signIn(){

        var data={
            user:login.userLogin.value,
            password:login.userPassword.value
        };
        if(data.password.length<6 || data.user.length<6){
            console.log("user or password invalid");
            return;
        }
        else{
            login.removeEventListener('submit',signIn);
            var xmlhttp=new XMLHttpRequest();
        }

        xmlhttp.onreadystatechange=function(){
            if(xmlhttp.readyState==4 && xmlhttp.status==200){

                playerData=JSON.parse(xmlhttp.responseText);
                var sectionLogin=document.getElementById("section-login");
                var sectionLogout=document.getElementById("section-logout");
                if(playerData.gameState==1){
                    console.log("user logado");
                    sectionLogin.style.visibility="hidden";
                    sectionLogout.style.visibility="visible";
                    switchGame();
                    xmlhttp=null;
                }
                else{
                    console.log("login or password invalid");
                    switchGame();
                    xmlhttp=null;
                }
            }
        };

        xmlhttp.open('post','/users/signin',true);
        xmlhttp.setRequestHeader("Content-type","application/json;charset=utf8");
        xmlhttp.send(JSON.stringify(data));

    }

    function signUp(){

        var form=document.getElementById("form");

        var data={
            email:formSignUp.email.value,
            user:formSignUp.user.value,
            password:formSignUp.password.value,
            borned:formSignUp.borned.value,
            fName:formSignUp.fName.value,
            lName:formSignUp.lName.value,
            sexy:formSignUp.sexy.value,
            country:formSignUp.country.value,
            state:formSignUp.state.value
        };
        console.log(data.borned);
        console.log(data.country+" "+data.state);
        function validaForm(){
            signUpNow.removeEventListener('click',signUp);
            var formSignUp=document.getElementById('formSignUp');
            console.log(formSignUp.email.value);
            if(!data.email.length>=5){
                console.log("erro validaForm emprty");
                return formSignUp.email.focus();
            }
            //verify if @ exist
            else if(!emailArroba(data.email)){
                console.log("erro validaForm @");
                return formSignUp.email.focus();
            }
            //verify if . exist
            else if(!emailDot(data.email)){
                console.log("erro validaForm DOT");
                return formSignUp.email.focus();
            }
            else if(!data.user.length>=8){
                console.log("erro validaForm user length");
                return formSignUp.user.focus();
            }
            else if(!data.password>=8){
                console.log("erro validaForm");
                return formSignUp.password.focus();
            }
            else if(!data.borned){
                console.log("erro validaForm");
                return form.SignUp.password.focus();
            }
            else if(!data.fName){
                console.log("erro validaForm");
                return false;
            }
            else if(!data.lName){
                console.log("erro validaForm");
                return false;
            }
            else if(data.country==-1){
                console.log("erro validaForm country");
                return false;
            }
            else if(data.state==-1){
                console.log("erro validaForm state");
                return false;
            }
            else{
                var xmlhttp=new XMLHttpRequest();
                console.log("sending data to the server...");
                xmlhttp.onreadystatechange=function(){
                    if(xmlhttp.readyState==4 && xmlhttp.status==200){
                        /* var sectionLogin=document.getElementById("cadastro-flutuand");
                         sectionLogin.visibility="hidden";*/
                        var inputError=document.getElementById("Sign-Up-Error");
                        playerData=JSON.parse(xmlhttp.responseText);
                            if(playerData.userExist){

                                inputError.style.visibility="visible";
                                inputError.textContent=playerData.message;
                                console.log(playerData.message);
                                xmlhttp=null;
                        }
                        else{
                                inputError.style.visibility="hidden";
                                var cadastroFlutuante=document.getElementById("cadastroFlutuante");
                                cadastroFlutuante.style.visibility="hidden";

                            }
                    }
                };
                xmlhttp.open('post','/users/signup',true);
                xmlhttp.setRequestHeader("Content-type","application/json;charset=utf8");
                xmlhttp.send(JSON.stringify(data));
            }
            function emailArroba(email){
                arrobaIndex=email.indexOf('@',0);
                if(arrobaIndex==-1) return false;
                else return true;
            }
            function emailDot(email){
                var arrobaIndex=email.indexOf('@',0);
                var dotIndex=email.indexOf('.',arrobaIndex);
                if(dotIndex==-1) return false;
                else return true;
            }

        }
        validaForm(data);

    }
    var signUpNow=document.getElementById("signUpNow");
    signUpNow.addEventListener('click',signUp);

    var login=document.getElementById('formLogin');
    login.addEventListener('submit',signIn);
}

/*
function logOut(){

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
}*/
