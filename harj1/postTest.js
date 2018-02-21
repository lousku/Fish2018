var request = require('request');
var http = require('http');

var obj = JSON.parse('{ "destUrl":"192.168.0.1:3000"}')
options = {
  method: 'post',
  body:  obj ,
  json: true, // Use,If you are sending JSON data
  url: 'http://192.168.100.113/rest/events/time/notifs',
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

http.createServer((request, response) => {
  const { headers, method, url } = request;
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log(body);
    console.log(method);
    console.log(url);
  });
}).listen(3000);
