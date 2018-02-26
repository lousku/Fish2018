var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

const bodyParse=require('body-parser');

app.use(bodyParse.json());


var seriveWakeURI = 'http://192.168.100.113/rest/services/startEvents'
var serviceUrl = 'http://192.168.100.113/rest/events'
var SubscribeUrl = 'http://192.168.100.113/rest/events/time/notifs/'
var outputUri = 'http://192.168.100.113/rest/services/changeOutput'
var destURL = "http://192.168.0.1:3456" //my own IP
var IPadressS1000 = "http://192.168.100.113"   //S1000 IP


//

//When got POST request from S1000 this function starts.
app.post('', function(req,res){
  console.log( JSON.stringify(req.body.payload.timeStamp));
  io.emit('messageToUi',"post request received with timestamp: " + JSON.stringify(req.body.payload.timeStamp));

  var timeStamp = JSON.stringify(req.body.payload.timeStamp);
  var seconds = timeStamp.substring(18,20);
  var binarySeconds = parseInt(seconds).toString(2);

//fill to eight bit binary
  for (i = binarySeconds.length; i < 8;i++){
    binarySeconds = "0"+binarySeconds;
  }

  changeLights(binarySeconds);

});

//When opening website from browser. send index html page
app.get('/', function(req,res){
  res.sendFile(__dirname + '/index.html');
  console.log("HTML User Interface opened");
});

//when webbrowser connection is established
io.on('connection', function(socket){
  console.log('a user connected');

  //when from frontend get service - button is pressed
  //send get request to S1000 receive json filled with service info
  socket.on('get services', function(){
    request.get(serviceUrl, { json: {"destUrl": destURL} },
    function (error, response, body) {
      console.log('available services: '+ JSON.stringify(body));
      io.emit('messageToUi','available services: '+ JSON.stringify(body))
    });
  });

  //when from frontend wake service - button is pressed
  //send post request to S1000 startEvents service is waken
  socket.on('wakeService', function(){
    console.log('waking services');
    var options = {
      method: 'post',
      body: {"destUrl":"http://192.168.0.1:3456/"},
      json: true, // Use,If you are sending JSON data
      url: seriveWakeURI,
      headers: {'Content-Type': 'application/json'},

      };

      //sen request to RTU
      request(options, function (err, res, body) {
          if (err) {
              console.log('Error :', err);
              return;
          }
          //check zonenumber from request (because requests are async functions, they may return at any time)
          console.log('Service waken, received body: ' + JSON.stringify(body));
          io.emit('messageToUi','Service waken, received body: ' + JSON.stringify(body));

    });

  });
  //when from frontend subscribe - button is pressed
  // subscribing to time notifs is established. start receiving timestamps from S1000
  socket.on('subscribe', function(){
    var options = {
      method: 'post',
      body: {"destUrl":"http://192.168.0.1:3456/"},
      json: true, // Use,If you are sending JSON data
      url: SubscribeUrl,
      headers: {'Content-Type': 'application/json'},

      };

      //sen request to RTU
      request(options, function (err, res, body) {
          if (err) {
              console.log('Error :', err);
              return;
          }

          console.log('Subscribed. received Body: ' + JSON.stringify(body));
          io.emit('messageToUi','Subscribed. received Body: ' + JSON.stringify(body));

    });

  });





//change S1000 outputs. input is eigh char string containing 1 or 0 (example "10101010")
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

function changeLights(trueStates) {

  var States = [false, false, false,false,false,false,false,false];
  //käydään läpi truestates stringin merkit, jos 1
  for (i = 0; i < trueStates.length; i++) {
      if(trueStates.charAt(i) == 1){
        States[i] = true;
      }
      else{
        States[i] = false;
      }
  }

  request.post(outputUri  ,
  {body: {"state0":States[0],"state1":States[1],"state2":States[2],"state3":States[3],"state4":States[4],"state5":States[5],"state6":States[6],"state7":States[7]}, json: true },
  function (error, response, body) {
    console.log('outputs changed to: '+ trueStates);
    io.emit('messageToUi','outputs changed to: '+ trueStates);
  });
}

http.listen(3456,"0.0.0.0", function(){
  console.log('listening on 3456');
});
