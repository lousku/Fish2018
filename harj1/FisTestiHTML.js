var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

var seriveWakeURI = 'http://192.168.100.113/rest/services/startEvents'
var serviceUrl = 'http://192.168.100.113/rest/events'
var destURL = "http://192.168.0.1:3000"


//


app.post('', function(req,res){
  console.log('post request received: ');
  io.emit('messageToUi',"post request received: " + req);
  res.write('amazing!');
  res.end();
});

app.on('data',function(){
  console.log('received!!!');
});

//
app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
  console.log("HTML User Interface opened");
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('event request', function(){
    request.post(seriveWakeURI, { json: {"destUrl": destURL} },
    function (error, response, body) {
            console.log('event request done, returned body: ' + JSON.stringify(body));
            io.emit('messageToUi',"Request done, received body: " + JSON.stringify(body));
    });
  });

  socket.on('get services', function(){
    request.get(serviceUrl, { json: {"destUrl": destURL} },
    function (error, response, body) {
      console.log('available services: '+ JSON.stringify(body));
      io.emit('messageToUi','available services: '+ JSON.stringify(body))
    });
  });

});


http.listen(3000, function(){
  console.log('listening on 3000');
});
