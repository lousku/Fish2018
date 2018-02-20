var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

var seriveWakeURI = 'http://192.168.100.113/rest/events/time/notifs'
var destURL = "http://192.168.0.1:3000"

request.post(seriveWakeURI, { json: {"destUrl": destURL} },
function (error, response, body) {
        console.log('body');
        console.log(body);
        console.log('response');
      //  console.log(response);

    }
);

app.post('/', function(req,res){
  console.log(res);
  console.log(req);
});



/*
app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
  console.log("nettisivu ladattiin");
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('viestin valitys',msg);
  });
});
*/
http.listen(3000, function(){
  console.log('listening on 3000');
});
