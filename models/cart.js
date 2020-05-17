const path = require('path');
const fileSystem = require('fs');

const p = path.join('/media/navid/Movies & Animes/Node JS/',
                    'cart.json'
);

//I don't want a new Cart object for every product I add to or remove from 
//the cart. Rather there will be only one cart
module.exports = class Cart{ 

    static addProduct(id, price){

        //Fetch the previous cart
        fileSystem.readFile(p, (err, fileContent)=>{
            
            let cart = {products:[], totalPrice:0};
            if(!err){
               cart = JSON.parse(fileContent);
            }

            //Analyze the cart => Find existing product
            const existingProductIndex = cart.products.findIndex(eachProduct => eachProduct.id===id);
            const existingProduct = cart.products[existingProductIndex];

            //Product class doesn't have a quantity field
            //Therefore, I am going to create a new object that has a quatity field
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                //increase the number of existing product
                updatedProduct.quantity = updatedProduct.quantity + 1;
                // cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            }
            else{
                //Add new product
                updatedProduct = {id:id, quantity:1};
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(price);
            fileSystem.writeFile(p, JSON.stringify(cart), (err)=>{
                if(err){
                    console.log("Error writing to cart file");
                }
            });
        });
    }

    static deleteProduct(id, price, callback){

        fileSystem.readFile(p, (err, fileContent)=>{

            //the cart is empty
            if(err){
                return callback();
            }

            const cart = JSON.parse(fileContent);
            const updatedCart = {...cart};
            const product = updatedCart.products.find(eachProd=>eachProd.id===id);
            if(!product){
                return callback();
            }

            const productQuantity = product.quantity;
            updatedCart.products = updatedCart.products.filter(eachProd=>eachProd.id!==id);
            updatedCart.totalPrice = updatedCart.totalPrice - price*productQuantity;

            fileSystem.writeFile(p, JSON.stringify(updatedCart), (err)=>{
                if(err){
                    console.log("Error updating cart file");
                }
                callback();
            });

        });
    }

    static getCart(callback){
        
        fileSystem.readFile(p, (err, fileContent)=>{

            if(!err){
                return callback(JSON.parse(fileContent));
            }

            callback([]);
        })
    }
}; 