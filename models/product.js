// const Cart = require('./cart');
// const db = require('../util/database');

// //this represents a single data
// module.exports = class Product{
//     constructor(id, title, imageUrl, description, price){
        
//         this.id = id; //this will be set to null when creating a new product
//         this.title = title;
//         this.imageUrl = imageUrl;
//         this.description = description;
//         this.price = price;
//     }

//     saveProduct(){
        
//         //by putting the question marks in place, we let the nodejs to 
//         //safely escape the data elements and rid the data of sql injections 
//         return db.execute('INSERT INTO products (title, price, description, imageUrl) '+
//         'VALUES (?, ?, ?, ?)', [this.title, this.price, this.description, this.imageUrl]);
//     }

//     static deleteByID(id){


//     }

//     //fetch all products
//     static fetchAll(){

//         return db.execute('SELECT * FROM products');
//     }

//     static findByID(id){

//         return db.execute('SELECT * FROM products WHERE products.id=?',[id]);
//     }
// };

const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Product = sequelize.define('product', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    title: {
        type: Sequelize.STRING,
        allowNull: false
    },

    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },

    description: {
        type: Sequelize.STRING,
        allowNull: false
    },

    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;