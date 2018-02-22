var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

var seriveWakeURI = 'http://192.168.100.113/rest/services/startEvents'
var eventWakeUp = 'http://192.168.100.113/rest/events/timeWS'
var serviceUrl = 'http://192.168.100.113/rest/events'
var destURL = "http://192.168.0.1:3000" //my own IP
var IPadressS1000 = "http://192.168.100.113"   //S1000 IP

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

//Kun nettiselaimella mennään localhost:3000
io.on('connection', function(socket){
  console.log('a user connected');

  //Kun käyttiksen kautta tulee "get services"-käsky
  socket.on('get services', function(){
    request.get(serviceUrl, { json: {"destUrl": destURL} },
    function (error, response, body) {
      console.log('available services: '+ JSON.stringify(body));
      io.emit('messageToUi','available services: '+ JSON.stringify(body))
    });
  });

//Kun käyttiksen kautta tulee wake event - käsky
  socket.on('wake event', function(uriValue, sentBody){
    changeLights(sentBody);

  });

  //8 bits string in example 11110000
  function changeLights(trueStates) {

    var States = [false, false, false,false,false,false,false,false];
    //käydään läpi truestates stringin merkit, jos 1
    for (i = 0; i < trueStates.length; i++) {
        if(trueStates.charAt(i) == 1){
          States[i] = true;
          console.log(i.toString() + "=" + "True")
        }
        else{
          States[i] = false;
        }
    }

    request.post(IPadressS1000+"/rest/services/changeOutput"  , {body: {"state0":States[0],"state1":States[1],"state2":States[2],"state3":States[3],"state4":States[4],"state5":States[5],"state6":States[6],"state7":States[7]}, json: true },
    function (error, response, body) {
      console.log('event waked at:' + IPadressS1000 +"/rest/services/changeOutput" + ' body received: '+ JSON.stringify(body));
      io.emit('messageToUi','event waked at:' + IPadressS1000 +"/rest/services/changeOutput" +' body received: '+ JSON.stringify(body));
    });
  }
});

http.listen(3000, function(){
  console.log('listening on 3000');
});
