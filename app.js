const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const defaultController = require('./controllers/defaultPage');
// const sequelize = require('./util/database');
// const Product = require('./models/product');
// const User = require('./models/user');
// const Cart = require('./models/cart');
// const CartItem = require('./models/cart-item');
// const Order = require('./models/order');
// const OrderItem = require('./models/oder-item');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

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

//this middleware accesses database and retrieves the dummy user with 
//each request, since authentication hasn't been done yet
//I'll assume every request has been made from the dummy user's accountexp
expressFunction.use((request, response, next)=>{

    User.findById("5ed4ed834099f974cda47273")
        .then(user=>{
        //I can simply add a field to request object
        //the user returned from mongodb is just an object with fields in the database
        //it doesn't have the User model's methods
        //hence I'll transform the user into an object of User model

        request.user = new User(user.name, user.email, user._id, user.cart);
        next();
    }).catch(err=>{
        console.log(err);
    });
    // next();
});

//routes that start with "/admin"
expressFunction.use('/admin', adminRoutes);
// //routes that start with "/"
expressFunction.use(shopRoutes);
expressFunction.use("/", defaultController.notFound);

//before I create and update tables(by using sync method), I'll establish relationships
//the following line simply means a user creates an instance of Product
//optional argument denotes that on the deletion of a User, the deletion
//will be applied to any connected Product
// Product.belongsTo(User, {constraints: true, onDelete:'CASCADE'});
// User.hasMany(Product);

// User.hasOne(Cart);
// Cart.belongsTo(User);

// Cart.belongsToMany(Product, {through: CartItem});
// Product.belongsToMany(Cart, {through: CartItem});

// Order.belongsTo(User);
// User.hasMany(Order);

// Order.belongsToMany(Product, {through: OrderItem});
// Product.belongsToMany(Order, {through: OrderItem});

// //npm start runs this whenever app.js is restarted
// //create all the defined(in models folder) tables
// //doesn't overwrite if the table already exists

// // {force: true} options forces all the updates
// // sequelize.sync({force:true}).then(result=>{
// sequelize.sync().then(result=>{
    
//     return User.findByPk(1);

// }).then(user=>{
    
//     if(!user){
//        return User.create({
//            name: 'Navid',
//            email: 'glitchbox29@gmail.com'
//        }); 
//     }

//     return Promise.resolve(user);

// })
// .then(user=>{
    
//    return user.createCart();

// })
// .then(cart=>{

//     //expressFunction is called with every request
//     const server = http.createServer(expressFunction);
//     server.listen(port=6789, hostname="localhost");

// }).catch(err=>{
//     console.log(err);
// });

mongoConnect(()=>{
    

    //expressFunction is called with every request
    const server = http.createServer(expressFunction);
    server.listen(port=6789, hostname="localhost");
});

