var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

var port = process.env.PORT || 3000;

app.use(express.static('public')); 

app.get('/', function(req, res){
  res.sendFile('index.html', { root: __dirname+"/public" });
});

//LOAD ALL MDULES
fs.readdirSync(__dirname+"/public/modules/").filter(function(file) {

  if(file == "main" || file == "login") return; //main modules are loaded appart

  console.log("Lading module "+file);
  app.get('/'+file, function(req, res){
    res.sendFile('index.html', { root: __dirname+"/public/modules/"+file });  
  });

});


io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});