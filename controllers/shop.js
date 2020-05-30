const Product = require('../models/product');
const path = require('path');
const rootDir = require('../util/path');

exports.getProducts = (request, response, next)=>{
    
    Product.fetchAll().then(products=>{
    // Product.findAll().then(products=>{
        
        response.render(path.join('shop', 'product-list'), {
            pageTitle:'All Products', 
            prodList: products, 
            path: "/products", 
        });    
    }).catch(err=>{
        console.log(err);
    });

    // Product.fetchAll().then(([rows, fieldData])=>{

    //     //console.log('shop.js: ',products);
    //     response.render(path.join('shop', 'product-list'), {
    //         pageTitle:'All Products', 
    //         prodList: rows, 
    //         path: "/products", 
    //     });
    // }).catch(err=>{
    //     console.log(err);
    // });

};

exports.getDetails = (request, response, next)=>{
    
    const productID = request.params.productID;

    // Product.findByPk(productID).then(product=>{
    Product.findById(productID).then(product=>{
    
        response.render(path.join('shop', 'product-details'),{
            pageTitle: product.title,
            //path: "/products",
            path:"/details",
            product: product
        });   
    }).catch(err=>{
        console.log(err);
    });
    // Product.findAll({where: {id:productID}}).then().catch();

    // Product.findByID(productID).then(([row])=>{

    //     console.log(row);
    //     response.render(path.join('shop', 'product-details'),{
    //         pageTitle: row[0].title,
    //         //path: "/products",
    //         path:"/details",
    //         product: row[0]
    //     });
    // }).catch(err=>{

    //     console.log(err);
    // });
};

exports.getIndex = (request, response, next)=>{
    
    Product.fetchAll().then(products=>{
    // Product.findAll().then(products=>{
        
        response.render(path.join('shop', 'index'), {
            pageTitle: 'Shop', 
            prodList: products, 
            path: "/", 
        });
    }).catch(err=>{
        console.log(err);
    })

    // Product.fetchAll().then(([rows, fieldData])=>{
                
    //     //console.log('shop.js: ',products);
    //     //using pug template engine
    //     response.render(path.join('shop', 'index'), {
    //         pageTitle: 'Shop', 
    //         prodList: rows, 
    //         path: "/", 
    //     });
    // }).catch(err=>{
    //     console.log(err);
    // });
};

exports.getCart = (request, response, next)=>{

    request.user.getCart().then(cart=>{

        return cart.getProducts().then(products=>{
                
            response.render(path.join('shop', 'cart'),{
                path:'/cart',
                pageTitle:'Your Cart',
                products: products
            
            });

        }).catch(err=>{
            console.log(err);
        })
    }).catch(err=>{
        console.log(err);
    });


};

exports.postCart = (request, response, next)=>{
    
    const productID = request.body.productID;
    let fetchedCart;
    let newQuantity = 1;

    request.user.getCart().then(cart=>{

        fetchedCart = cart;
        return cart.getProducts({where: {id:productID}});
    
    }).then(products=>{

        let product;
        //getProducts will always return an array, even if there is a single product in the cart
        if(products.length>0){
            product = products[0];
        }

        if(product){
            
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return Promise.resolve(product);
        }

        return Product.findByPk(productID);
    }).then(product=>{
            
        return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
    }).then(updatedCart=>{
        
        response.redirect("/cart");
    }).catch(err=>{
        console.log(err);
    });
};

exports.postDeleteCart = (request, response, next)=>{
    
    const productID = request.body.id;
    request.user.getCart().then(cart=>{

        //not only I get all the info related to products
        //but also I get info related to the cart item associated 
        //with that product
        return cart.getProducts({where: {id: productID}});
    }).then(products=>{
        let product = products[0];

        return product.cartItem.destroy();
    }).then(result=>{
        
        response.redirect('/cart');
    }).catch(err=>{
        console.log(err);
    })
};

exports.postDownload = (request, response, next)=>{
    
    const productID = request.body.productID;
    //console.log(productID);

    Product.findByPk(productID).then(product=>{
        response.download("/"+"A Thousand Splendid Suns"+".pdf", product.title+".pdf", {root: path.join(rootDir, 'downloads')});
    });
}

exports.getCheckout = (request, response, next)=>{

    response.render(path.join('shop', 'checkout'),{
                        path:'/checkout',
                        pageTitle:'Checkout'

    });
};

exports.getOrders = (request, response, next)=>{
    
    request.user.getOrders({include: ['products']}).then(orders=>{
        
        //can't call orders.getProducts because orders is a list of orders
        //we can call getProducts on each order
        //just like we called getProducts on cart, beacause 
        //there was just one cart

        //hence we resort to 'eager loading'
        //when we fetch a list of orders, we also fetch a list of 
        //all related products
        response.render(path.join('shop', 'orders'), {
            path:'/orders',
            pageTitle:'Your Orders',
            orders: orders
        });
        
    }).catch(err=>{
        console.log(err);
    });

};

exports.postOrder = (request, response, next)=>{

    let cartProducts;
    let fetchedCart;

    request.user.getCart().then(cart=>{

        fetchedCart = cart;
        return cart.getProducts();
    }).then(products=>{

        cartProducts = products;
        return request.user.createOrder();
    }).then(order=>{

        return order.addProducts(cartProducts.map(product=>{
            
            product.orderItem = {quantity: product.cartItem.quantity}; 
            return product;
        }));
    }).then(result=>{

        fetchedCart.setProducts(null);
        response.redirect("/orders");
    }).catch(err=>{
        console.log(err);
    })
}; 