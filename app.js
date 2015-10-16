
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

//USERS OPTIONS
usersOn=function(){
  this.signUp=0;
  this.signIn=0;
  this.playersOn=0;
  this.idFree=[30];
  this.lastOnline=0;
  this.players=[
     {
       idOnline:55,
        user:"",
        sexy:"",
        country:"",
        state:"",
       timeOnline:0,
       lastActivity:0,
       socketId:0
      }];
};
app.usersOnline=new usersOn();
app.usersOnline.players.pop();
console.log(app.usersOnline.signUp);
module.exports=app.usersOnline;

var users = require('./routes/users');
//END OF USERS CONFIG


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
//app.use('/country', country);
//app.use('/userss', users);
//app.use('/userslogin',users.login);

//login, create account, everything about mysql is here
app.use('/users',users);



//setTimeout(theGame,2000);



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
