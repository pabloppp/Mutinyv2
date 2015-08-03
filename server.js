var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');
var low = require('lowdb');
var db = low('db.json');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

app.use(bodyParser.json()); //ACCEPT JSON
app.use(bodyParser.urlencoded({ extended: true })); //ACCEPT URL-ENCODED FORM

app.use(express.static('public')); 

app.get('/', function(req, res){
    console.log(req.session);
  res.sendFile('modules/main/index.html', { root: __dirname+"/public" });
});

app.get('/access', function(req, res){
    console.log(req.session);
  res.sendFile('modules/login/index.html', { root: __dirname+"/public" });
});

//LOAD ALL MDULES
fs.readdirSync(__dirname+"/public/modules/").filter(function(file) {

  if(file == "main" || file == "login" || file[0] == '.') return; //main modules are loaded appart

  console.log("Lading module "+file);
  app.get('/'+file, function(req, res){
    res.sendFile('index.html', { root: __dirname+"/public/modules/"+file });  
  });

});

//EXTRA API ROUTES
require('./routes/api.js')(app);


io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});