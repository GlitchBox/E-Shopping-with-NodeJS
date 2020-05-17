const path = require('path');

//process is a global variable
//mainModule is the module that started the application
//here the mainModule is app.js
module.exports = path.dirname(process.mainModule.filename);