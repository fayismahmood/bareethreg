 var jwt = require('jsonwebtoken');
var token = jwt.sign({ name: 'ks' }, 'shhhhh');



console.log(token);