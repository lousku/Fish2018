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

  socket.on('wake service', function( uriToSend){
    options = {
      method: 'post',
      body: {"destUrl":"http://192.168.0.1:3000/"},
      json: true, // Use,If you are sending JSON data
      url: 'http://192.168.100.113' + uriToSend,
      headers: {'Content-Type': 'application/json'},

      };

      //sen request to RTU
      request(options, function (err, res, body) {
          if (err) {
              console.log('Error :', err);
              return;
          }
          //check zonenumber from request (because requests are async functions, they may return at any time)
          console.log('received body: ' + JSON.stringify(body));

    });

  });


//Kun käyttiksen kautta tulee wake event - käsky
  socket.on('ChangeLights', function( sentBody){
    changeLights(sentBody);

  });

  socket.on('Blink', function( sentBody){
    var lightStatuses = "";
    setInterval(function() {
      lightStatuses = "";
      for (var i = 0; i < 8; i++){
        lightStatuses += (parseInt(Math.random()*2)).toString(); //add random number to strin 0 or 1;
        console.log("light statuses: " + lightStatuses);
      }
      changeLights(lightStatuses);
    }, 5000);


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
          console.log(i.toString() + "=" + "False")

        }
    }

    request.post(IPadressS1000+"/rest/services/changeOutput"  , {body: {"state0":States[0],"state1":States[1],"state2":States[2],"state3":States[3],"state4":States[4],"state5":States[5],"state6":States[6],"state7":States[7]}, json: true },
    function (error, response, body) {
      console.log('event waked at:' + IPadressS1000 +"/rest/services/changeOutput" + ' body received: '+ JSON.stringify(body));
      io.emit('messageToUi','event waked at:' + IPadressS1000 +"/rest/services/changeOutput" +' body received: '+ JSON.stringify(body));
    });
  }

  function changeLightsSOAP(trueStates){
    var SOAP_message = '<?xml version="1.0" encoding="ISO-8859-1"?>'+
        '<s12:Envelope'+
        'xmlns:s12="http://www.w3.org/2003/05/soap-envelope"'+
        'xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">'+
        '<s12:Header>'+
        '<wsa:Action>http://www.tut.fi/fast/Assignment/UpdateOutputs_Request</wsa:Action>'+
        '</s12:Header>'+
        '<s12:Body>'+
      '  <!—PUT YOU MESSAGE OF THE OUTPUTS HEREUSE THE WSDL FILE FOR THIS-->'+
        '</s12:Body>'+
        '</s12:Envelope>'


  var options = {
    method: 'post',
    body: SOAP_message,
    json: true, // Use,If you are sending JSON data
    Link: 'http://192.168.100.113/dpws/WS01',
    headers: {'Content-Type': ' text/xml; charset=utf-8',
              'host': '192.168.100.113:80',
              'connection': 'close',
              'accept-charset': 'utf-8',
              'accept-encoding': 'none',
              'accept':'text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8'
              },

    };
  }

});

http.listen(3000,"0.0.0.0", function(){
  console.log('listening on 3000');
});
