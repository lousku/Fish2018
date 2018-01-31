var validator = require('xsd-schema-validator');

var xml_valid = '<?xml version="1.0"?>'+
'<comment>'+
	'<author>author</author>'+
	'<content>nothing</content>'+
	'<content>nothing</content>'+
'</comment>';
var xml_invalid = '<?xml version="1.0"?><comment>A comment</comment>'

console.log( process.env.PATH );


validator.validateXML(xml_valid, 'schema.xsd', function(err, result) {


  if (err) {
    throw err;
  }

	console.log("this xml is valid : "+result.valid); // true
});
