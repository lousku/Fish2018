var http = require("http");

http.createServer(function (req,res){

  res.write("Miika on paras!");
  res.end();
}).listen(8080)
