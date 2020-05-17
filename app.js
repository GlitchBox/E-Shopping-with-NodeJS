const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const defaultController = require('./controllers/defaultPage');
const sequelize = require('./util/database');
const expressFunction = express();


//this set function allows us to set any variable globally
//expressFunction.set('view engine', 'pug')
expressFunction.set('view engine', 'ejs')

//this tells the express and the template engine where to find the htmls and pugs and handlebars..
expressFunction.set('views', path.join(__dirname, 'views'));


//use allows us to add middleware functions

//a request body parser(mostly html requests)
//this will parse the request body section and call next
//so that control goes to my middleware functions
//extended field says if the body parser should be able to parse non-default features
expressFunction.use(bodyParser.urlencoded({extended: false}));

//this function serves some file statically, meaning
//the file isn't served by the express middleware, rather it is served 
//by the file system itself
//since it is served by the file system(not by url), the full path is required
expressFunction.use(express.static(path.join(__dirname, 'public')));

//routes that start with "/admin"
expressFunction.use('/admin', adminRoutes);
//routes that start with "/"
expressFunction.use(shopRoutes);
expressFunction.use("/", defaultController.notFound);

//create all the defined(in models folder) tables
//doesn't overwrite if the table already exists
sequelize.sync().then(result=>{
    
    // console.log(result);
    //expressFunction is called with every request
    const server = http.createServer(expressFunction);
    server.listen(port=6789, hostname="localhost");

}).catch(err=>{
    console.log(err);
});
