var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql=require('mysql');
var country=require('./routes/country.js');

//var country=require('./routes/country.js');
/*
 var routes = require('./routes/index');
 var users = require('./routes/users');
 */

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var router=express.Router();
//app.use('/country', country);
//app.use('/userss', users);
//app.use('/userslogin',users.login);

//REGISTER ROUTES PREFIXED WITH /users
var dbOptions={
    "host":"localhost",
    "user":"root",
    "password":"",
    "port": 3306,
    "database":"games"
};
var pool=mysql.createPool(dbOptions);


router.use(function(error,res,next){
    console.log("Something is happening.");
    next();
});

router.get('/',function(req,res){
    //res.json({message:'hooray! welcome to out api!'});
    res.render('index', { titlee: 'Take A Time But Never Relax',logged:false });


});
//responde com os paises para a chamada AJAX
router.route('/country').post(function(req,res){
    //res.writeHead(200,{"Content-type":"application/json"});
    //res.send(country);
    //res.end(country);
    res.end(country);

});

router.route('/signin').post(function(req,res){
    console.log("foiii");
    var data={};
    data=req.body;
    pool.getConnection(function(error,connection){
        if (error) {
            console.error("error connecting: %s", error);
            return;
        }
        console.log('connected as id: ' + connection.threadId);
        connection.query('SELECT * FROM Users WHERE user=?',data.user  , function (error, rows) {
            if (error) {
                console.log("Error selecting: %s", error);
            }
            console.log(rows);
            console.log(rows[0].password);

            if(rows[0].password==data.password){
                console.log("CONNECTED");
                res.json(console.log("CONNECTED"));
            }
            else {
                console.log("SENHA INCORRETA");
                res.json();
            }
        });
    });
});
router.route('/signup').post(function(req,res){
    req.setEncoding("utf8");
    pool.getConnection(function(error,connection){
        if (error){
            console.error("error connecting: %s",error);
            return;
        }
        var input=JSON.parse(JSON.stringify(req.body));
        console.log(req.body);
        console.log(input);
        var data=new Object();
        data=input;
        console.log('connected as id: '+connection.threadId);
        connection.query("INSERT INTO Users set ?",data,function(error,rows){
            if(error) {
                return console.error("Error inserting: %s", error);
            }
            res.send("CADASTRADO");
        });
    });
});

app.use('/users',router);


//app.use('/users',router);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
