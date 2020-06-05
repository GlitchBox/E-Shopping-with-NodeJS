// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const User = sequelize.define('user', {

//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },

//     name: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },

//     email: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }
// });

//codes for mongodb implementation
const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

class User{

    constructor(name, email, id, cart){
        
        this.name = name;
        this.email = email;

        if(id){
            this._id = new mongodb.ObjectId(id);
        }
        this.cart = cart; //{items: []}
    }

    save(){

        const db = getDB();
        let dbOp;

        if(this._id){
            dbOp = db.collection('users').updateOne({_id: this._id}, {$set: this});
        }
        else{
            dbOp = db.collection('users').insertOne(this);
        }

        return dbOp
                .then(result=>{
                    console.log('User insertion complete!');
                })
                .catch(err=>{
                    console.log(err);
                });

    }

    addToCart(product){

        const cartProductIndex = this.cart.items.findIndex(cartProduct=>{

            return cartProduct.productId.toString() === product._id.toString();
        });

        let updatedQuantity = 1;
        const updatedCartItems = [...this.cart.items];

        if(cartProductIndex>-1){
            updatedQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = updatedQuantity;
        }
        else{

            updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity : updatedQuantity});
        }


        // this.cart = { items: [{ productId: new mongodb.ObjectId(product._id), quantity : updatedQuantity}] }
        // this.cart = {items:[]};

        const db = getDB();
        return db.collection('users')
                    .updateOne({_id: this._id}, {$set: {cart: {items: updatedCartItems}}} )
                    .then(result=>{
                        console.log('Cart update complete!');
                    })
                    .catch(err=>{
                        console.log(err);
                    });
    }

    getCart(){

        const db = getDB();
        //map method transforms a an array into another one
        const productIds = this.cart.items.map(everyItem=>{
            return everyItem.productId;
        });
        return db.collection('products')
                    .find({_id: {$in: productIds}}) //returns a cursor
                    .toArray() //transforms everything the cursor points to into array
                    .then(products=>{
                        
                        //removing the products from cart which has have been deleted 
                        //from the Products collections
                        const productIds2 = products.map(p=>{
                            return p._id.toString();
                        });
                        this.cart.items = this.cart.items.filter(i=>{
                            
                            if(productIds2.includes(i.productId.toString())){
                                return true;
                            }

                            return false;
                        })
                        // console.log(this.cart.items);
                        db.collection('users')
                            .updateOne({
                                _id: new mongodb.ObjectId(this._id)},
                                    {$set:
                                        {cart:
                                            {items: this.cart.items}
                                        }
                                    }
                                ).then(result=>{
                                    console.log("Cart cleaning complete!");
                                }).catch(err=>{
                                    console.log(err);
                                });
                        
                        //populating cart array
                        return products.map(everyProduct=>{

                            return {...everyProduct,
                                    quantity: this.cart.items.find(
                                        arrayItem=>{
                                            return arrayItem.productId.toString() === everyProduct._id.toString()   
                                        }
                                    ).quantity
                                };
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                    });
    }

    deleteCartItem(productId){

        
        const updatedCartItems = this.cart.items.filter(item=>{
            return item.productId.toString() !== productId.toString()
        });

        const db = getDB();
        return db.collection('users')
            .updateOne({_id: this._id}, {$set: {cart: {items: updatedCartItems}} } )
            .then(result=>{
                console.log("Deleted from Cart!");
            })
            .catch(err=>{
                console.log(err);
            });
    }

    addOrder(){

        const db = getDB();
        return this.getCart()
                        .then(products=>{
                                   const order = {
                                        items: products,
                                        user: {
                                            id: this._id,
                                            name: this.name,
                                            email: this.email
                                        }
                                    }
                                    return order;
                                }).then(order=>{
                                    return db.collection('orders')
                                        .insertOne(order)
                                        .then(result=>{
                            
                                            this.cart = [];
                                            return db.collection('users')
                                                .updateOne({_id: this._id}, {$set: {cart: {items: []}} } )
                                                .then(result=>{
                                                    console.log("Emptied Cart!");
                                                })
                                                .catch(err=>{
                                                    console.log(err);
                                                });
                            
                                        });
                                })
                                .catch(err=>{
                                    console.log(err);
                                });



    } 

    getOrder(){
        
        const db = getDB();
        return db.collection('orders')
                    .find({'user.id': new mongodb.ObjectId(this._id)})
                    .toArray();
    
    }

    static findById(userId){

        const db = getDB();

        return db.collection('users')
                    .find({_id: new mongodb.ObjectId(userId)}) //find returns a cursor
                    .next() //next gets to the last and the only object in the cursor
                    .then(user=>{
                        // console.log(user);
                        return user;
                    })
                    .catch(err=>{
                        console.log(err);
                    });
    }
}

module.exports = User;