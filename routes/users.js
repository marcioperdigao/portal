var express = require('express');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();
var mysql=require('mysql');
var bodyParser = require('body-parser');
var country=require('./country.js');
var usersOnline=require('../app');
/* GET users listing. */
//REGISTER ROUTES PREFIXED WITH /users

var dbOptions={
    "connectionLimit":100,
    "host":"localhost",
    "user":"root",
    "password":"",
    "port": 3306,
    "database":"games"
};
var pool=mysql.createPool(dbOptions);


router.use(function(error,res,next){
    console.log("Something is happening.");
    console.log();
    next();
});

router.get('/',function(req,res){

    console.log("AQUI VAI");
    res.render('index', { titlee: 'Take A Time But Never Relax',logged:false });

});

//responde com os paises para a chamada AJAX
router.route('/country').post(function(req,res){

    res.end(country);

});

router.route('/signin').post(function(req,res){
    var dataSend={
        gameState:0//start the GAME_STATE_SIGNIN
    };

    console.log("signin funciona até aqui");
    var data={};
    data=req.body;

    //verifica se ja esta online
    for(var players in usersOnline.players){
        console.log(data.user+"  "+usersOnline.players[players].user)
        if(data.user==usersOnline.players[players].user){
            res.json(dataSend);
            return;
        }

    }

    pool.getConnection(function(error,connection){
        if (error) {
            console.error("error connecting: %s", error);
            return;
        }
        console.log('connected as id: ' + connection.threadId);
        connection.query('SELECT * FROM Users WHERE user=?',data.user  , function (error, rows) {
            if (error) {
                console.log("Error selecting: %s", error);
                res.json(dataSend);
                return;

            }
            else if(rows==0){

                console.log("user don't exist");
                res.json(dataSend);
                res.end();
                return;
            }
            console.log(data.password+" "+rows[0].password);


            if(bcrypt.compareSync(data.password,rows[0].password)){
                var freeId;
                console.log(usersOnline.signIn);
                for(var i=0;i<=30;i++){
                    if(usersOnline.idFree[i]!=1){
                        console.log(usersOnline.idFree);
                        usersOnline.idFree[i]=1;
                        freeId=i;
                        break;
                    }
                }
                dataSend={
                    email:rows[0].email,
                    user:rows[0].user,
                    sexy:rows[0].sexy,
                    borned:rows[0].borned,
                    fName:rows[0].fName,
                    lName:rows[0].lName,
                    country:rows[0].country,
                    state:rows[0].state,
                    gameState:1,//start the GAME_STATE_SIGNIN
                    idOnline:freeId
                };

                    usersOnline.players[freeId]=
                        {
                            idOnline:freeId,
                            user:dataSend.user,
                            sexy:dataSend.sexy,
                            country:country=dataSend.country,
                            state:dataSend.state,
                            timeOnline:0,
                            lastActivity:0,
                            socketId:0
                        };

                console.log("last free "+freeId);
                usersOnline.signIn++;
                usersOnline.playersOn++;
                usersOnline.lastOnline=freeId;
                console.log("playersONlINE "+usersOnline.playersOn);

                res.json(dataSend);
                res.end();
            }
            else {

                console.log("PASSWORD IS INCORRECT");
                res.json(dataSend);
                res.end();
            }
        });
    });
});
router.route('/signout').post(function(req,res){
    req.setEncoding('utf8');

    console.log(req.body.id);

    var input=JSON.parse(JSON.stringify(req.body));
    /*usersOnline.playersOn--;
    usersOnline.players.splice(input.id,1);
    usersOnline.idFree[input.id]=0;*/
    res.end();

});
router.route('/signup').post(function(req,res){
    req.setEncoding("utf8");
    var responder={
        userExist:false,
        massage:"Cadastro realizado com sucesso"
    };
    pool.getConnection(function(error,connection){
        if (error){
            console.error("error connecting: %s",error);
            return;
        }
        connection.query("SELECT user,email FROM Users WHERE user=? or email=?",[req.body.user,req.body.email],function(error,rows) {
            if (error) {

                return console.error("Error selecting: %s", error);
            }
            if(rows.length>0){
                responder={
                    userExist:true,
                    message:"Este usuario/e-mail já se encontra cadastrado no banco de dados"
                };
                res.json(responder);
                res.end();
                return console.error(responder.message);
            }
            else{
                var input=JSON.parse(JSON.stringify(req.body));
                console.log("se nao continue a execução");

                var salt=bcrypt.genSaltSync(8);
                input.password=bcrypt.hashSync(input.password,salt);
                console.log(input.password);
                //criptografia propria ainda não implementada
                /*var hashPassword=input.password;
                 function encriptPassword(){

                 }*/
                var data=new Object();
                data=input;
                console.log('connected as id: '+connection.threadId);
                connection.query("INSERT INTO Users set ?",data,function(error,rows){
                    if(error) {
                        return console.error("Error inserting: %s", error);
                    }
                    responder={
                        userExist:false,
                        message:"Usuário cadastrado com sucesso"
                    };
                    res.json(responder);
                });
            }
        });
    });
});

module.exports =router;