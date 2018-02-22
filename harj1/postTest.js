var request = require('request');
var http = require('http');

var obj = JSON.parse('{ "destUrl":"192.168.0.1:3000"}')
options = {
  method: 'post',
  body: {"destUrl":"http://192.168.0.1:3000"},
  json: true, // Use,If you are sending JSON data
  url: 'http://192.168.100.102/rest/services/startEvents',
  headers: {'Content-Type': 'application/json'},

  };

  //sen request to RTU
  request(options, function (err, res, body) {
      if (err) {
          console.log('Error :', err);
          return;
      }
      //check zonenumber from request (because requests are async functions, they may return at any time)
      console.log(body) ;
});

var server = http.createServer(function (request, response) {
    var REQ_url = request.url;
    var REQ_Method = request.method;

  console.log(REQ_url);
  console.log(REQ_method);


    response.write('<!DOCTYPE html>');

    response.end();

});

server.listen(3000,'0.0.0.0');

// Put a friendly message on the terminal
console.log("Server running at http://192.168.100.113:3000/");
