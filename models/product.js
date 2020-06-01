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


//following is the code for Sequelize
// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {

//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },

//     title: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },

//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false
//     },

//     description: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },

//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

//following is the code for MongoDB
const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class Product{

    constructor(title, price, description, imageUrl, id, userId){

        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;

        if(id){
            this._id = new mongodb.ObjectId(id);
        }
        this.userId = new mongodb.ObjectId(userId);

    }

    save(){

        const db = getDB();
        let dbOp;

        if(!this._id){
            dbOp = db.collection('products').insertOne(this);
        }
        else{
            dbOp = db.collection('products').updateOne({_id: this._id}, {$set: this});
        }

        return dbOp
                    .then(result=>{
                        console.log(result);
                    })
                    .catch(err=>{
                        console.log(err);
                    });
    }

    static fetchAll(){

        const db = getDB();
        //find method returns a cursor object, which allows us to go through 
        //all the documents found by find
        return db.collection('products')
                .find()
                .toArray()
                .then(products=>{
                     
                    // console.log(products);
                    return products;
                })
                .catch(err=>{
                    console.log(err);
                });
    }

    static findById(productID){

        const db = getDB();
        return db.collection('products')
                .find({_id: new mongodb.ObjectId(productID)})
                .next() //this gets me the next document, which is also the last and only document in this cursor
                .then(product=>{

                    return product;
                })
                .catch(err=>{
                    console.log(err);
                })
    }

    static deleteById(productID){

        const db = getDB();
        return db.collection('products')
                .deleteOne({_id: new mongodb.ObjectId(productID)})
                .then(result=>{
                    console.log('DELETED!');
                })
                .catch(err=>{
                    console.log(err);
                });
    }
};

module.exports = Product;