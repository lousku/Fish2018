var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var seriveWakeURI = 'http://escop.rd.tut.fi:3000/RTU/SimROB1/services/LoadPaper'
var destURL = "http://escop.rd.tut.fi:3000/fmw"

request.post(
    seriveWakeURI, { json: {"destUrl": destURL} },
    function (error, response, body) {
        console.log(body);
        console.log('paperi ladattu');
    }
);


app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('viestin valitys',msg);
  });
});

http.listen(3000, function(){
  console.log('listening on 3000');
});
