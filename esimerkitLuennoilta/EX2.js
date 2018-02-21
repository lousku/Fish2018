var events = require('events');
var eventEmitter = new events.EventEmitter();

var record = [];

eventEmitter.on('submit', function(msg){
	record.push(msg);
	console.log(record)
});


eventEmitter.emit('submit',{name:'Matti', age:50})
setTimeout(function(){eventEmitter.emit('submit',{name:'Minna', age:30});},1000);
setTimeout(function(){eventEmitter.emit('submit',{name:'John', age:20});},2000);
setTimeout(function(){eventEmitter.emit('submit',{name:'Anne', age:60});},3000);

console.log("end of the code !!")

for(var i = 0; i<10;i++)
{
	setTimeout(function(){console.log(i)},2000);
	console.log(i);
}
