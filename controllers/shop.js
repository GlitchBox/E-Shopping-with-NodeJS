const Product = require('../models/product');
const path = require('path');
const rootDir = require('../util/path');
const Order = require('../models/order');

const ITEM_PER_PAGE = 2;

exports.getProducts = (request, response, next)=>{
    
    //mongoose code
    // if(!request.session.user){

    //     return response.redirect('/login');
    // }

    let pageNo=1;
    if(request.query.page)
        pageNo = parseInt(request.query.page);
    let totalProducts;
    // Product.find().cursor().next()
    Product.find().countDocuments()
            .then(productCount=>{

                totalProducts = productCount;
                return Product.find()
                                .skip((pageNo-1)*ITEM_PER_PAGE)
                                .limit(ITEM_PER_PAGE);
            })
            .then(products=>{
                response.render(path.join('shop', 'product-list'), {
                        pageTitle:'All Products', 
                        prodList: products, 
                        path: "/products", 
                        currentPage: pageNo,
                        hasNextPage: pageNo*ITEM_PER_PAGE < totalProducts,
                        hasPrevPage: pageNo>1,
                        nextPage: pageNo+1,
                        prevPage: pageNo-1,
                        lastPage: Math.ceil(totalProducts/ITEM_PER_PAGE)
                    });
            })
    .catch(err=>{
        console.log(err);
    });
    //mongodb code
    // Product.fetchAll().then(products=>{
    // // Product.findAll().then(products=>{
        
    //     response.render(path.join('shop', 'product-list'), {
    //         pageTitle:'All Products', 
    //         prodList: products, 
    //         path: "/products", 
    //     });    
    // }).catch(err=>{
    //     console.log(err);
    // });

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
    //mongoose code
    Product.findById(productID)
            .then(product=>{
                response.render(path.join('shop', 'product-details'),{
                    pageTitle: product.title,
                    path:"/details",
                    product: product,
                    isAuthenticated: request.session.isLoggedIn
                });   

            })
            .catch(err=>{
                console.log(err);
            })

    //mongodb code
    // Product.findById(productID).then(product=>{
    
    //     response.render(path.join('shop', 'product-details'),{
    //         pageTitle: product.title,
    //         //path: "/products",
    //         path:"/details",
    //         product: product
    //     });   
    // }).catch(err=>{
    //     console.log(err);
    // });
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
    
    //mongoose code
    // if(!request.session.user){

    //     return response.redirect('/login');
    // }
    let pageNo=1;
    if(request.query.page)
        pageNo = parseInt(request.query.page);
    let totalProducts;
    // Product.find().cursor().next()
    Product.find().countDocuments()
            .then(productCount=>{

                totalProducts = productCount;
                return Product.find()
                                .skip((pageNo-1)*ITEM_PER_PAGE)
                                .limit(ITEM_PER_PAGE);
            })
            .then(products=>{
                response.render(path.join('shop', 'index'), {
                        pageTitle:'Shop', 
                        prodList: products, 
                        path: "/", 
                        currentPage: pageNo,
                        hasNextPage: pageNo*ITEM_PER_PAGE < totalProducts,
                        hasPrevPage: pageNo>1,
                        nextPage: pageNo+1,
                        prevPage: pageNo-1,
                        lastPage: Math.ceil(totalProducts/ITEM_PER_PAGE)
                    });
            })
    .catch(err=>{
        console.log(err);
    });

    //mongodb code
    // Product.fetchAll().then(products=>{
    // // Product.findAll().then(products=>{
        
    //     response.render(path.join('shop', 'index'), {
    //         pageTitle: 'Shop', 
    //         prodList: products, 
    //         path: "/", 
    //     });
    // }).catch(err=>{
    //     console.log(err);
    // })

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

    //Sequelize codes
    // request.user.getCart().then(cart=>{

    //     return cart.getProducts().then(products=>{
                
    //         response.render(path.join('shop', 'cart'),{
    //             path:'/cart',
    //             pageTitle:'Your Cart',
    //             products: products
            
    //         });

    //     }).catch(err=>{
    //         console.log(err);
    //     })
    // }).catch(err=>{
    //     console.log(err);
    // });

    //mongodb codes
    // request.user.getCart()
    //             .then(products=>{
    //                 response.render(path.join('shop', 'cart'),{
    //                     path:'/cart',
    //                     pageTitle:'Your Cart',
    //                     products: products
                    
    //                 });                    
    //             })
    //             .catch(err=>{
    //                 console.log(err);
    //             });

    //mongoose code
    request.user.getCart()
                .then(user=>{
                    // console.log(user.cart.items);
                    //removing products from cart which have been deleted from products
                    user.cart.items = user.cart.items.filter(item=>{

                        return item.productId;
                    });
                    user.save();
                    // console.log(user.cart.items);

                    response.render(path.join('shop', 'cart'),{
                        path:'/cart',
                        pageTitle:'Your Cart',
                        products: user.cart.items,
                        isAuthenticated: request.session.isLoggedIn
                    
                    });                    
                })
                .catch(err=>{
                    console.log(err);
                });

};

exports.postCart = (request, response, next)=>{
    
    const productID = request.body.productID;
    //mongodb code
    Product.findById(productID)
            .then(product=>{

                return request.user.addToCart(product);
            })
            .then(result=>{

                response.redirect("/cart");
            })
            .catch(err=>{
                console.log(err);
            });

    //Sequelize code
    // let fetchedCart;
    // let newQuantity = 1;

    // request.user.getCart().then(cart=>{

    //     fetchedCart = cart;
    //     return cart.getProducts({where: {id:productID}});
    
    // }).then(products=>{

    //     let product;
    //     //getProducts will always return an array, even if there is a single product in the cart
    //     if(products.length>0){
    //         product = products[0];
    //     }

    //     if(product){
            
    //         const oldQuantity = product.cartItem.quantity;
    //         newQuantity = oldQuantity + 1;
    //         return Promise.resolve(product);
    //     }

    //     return Product.findByPk(productID);
    // }).then(product=>{
            
    //     return fetchedCart.addProduct(product, {through: {quantity: newQuantity}});
    // }).then(updatedCart=>{
        
    //     response.redirect("/cart");
    // }).catch(err=>{
    //     console.log(err);
    // });
};

exports.postDeleteCart = (request, response, next)=>{
    
    const productID = request.body.id;
    //mongodb code
    request.user.deleteCartItem(productID)
                .then(()=>{
                    response.redirect('/cart');
                })
                .catch(err=>{
                    console.log(err);
                });

    //Sequelize code
    // request.user.getCart().then(cart=>{

    //     //not only I get all the info related to products
    //     //but also I get info related to the cart item associated 
    //     //with that product
    //     return cart.getProducts({where: {id: productID}});
    // }).then(products=>{
    //     let product = products[0];

    //     return product.cartItem.destroy();
    // }).then(result=>{
        
    //     response.redirect('/cart');
    // }).catch(err=>{
    //     console.log(err);
    // })
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
                        pageTitle:'Checkout',
                        isAuthenticated: request.session.isLoggedIn

    });
};

exports.getOrders = (request, response, next)=>{
    
    //mongoose code
    Order.find({'user.id': request.session.user._id})
            .then(orders=>{
                console.log(orders);
                response.render(path.join('shop', 'orders'), {
                    path:'/orders',
                    pageTitle:'Your Orders',
                    orders: orders,
                    isAuthenticated: request.session.isLoggedIn
                });   
            })
            .catch(err=>{
                console.log(err);
            });

    //mongodb code
    // request.user.getOrder()
    //             .then(orders=>{
    //                 response.render(path.join('shop', 'orders'), {
    //                         path:'/orders',
    //                         pageTitle:'Your Orders',
    //                         orders: orders
    //                     });
    //             });

    //Sequelize code
    // request.user.getOrders({include: ['products']}).then(orders=>{
        
    //     //can't call orders.getProducts because orders is a list of orders
    //     //we can call getProducts on each order
    //     //just like we called getProducts on cart, beacause 
    //     //there was just one cart

    //     //hence we resort to 'eager loading'
    //     //when we fetch a list of orders, we also fetch a list of 
    //     //all related products
    //     response.render(path.join('shop', 'orders'), {
    //         path:'/orders',
    //         pageTitle:'Your Orders',
    //         orders: orders
    //     });
        
    // }).catch(err=>{
    //     console.log(err);
    // });

};

exports.postOrder = (request, response, next)=>{

    //mongoose code
    request.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user=>{
            
            const items = user.cart.items.map(item=>{
                // console.log(item);
                return {product: {...item.productId._doc}, quantity: item.quantity};
            });
            const newOrder = new Order({

                items: items,
                user: {
                    email: request.session.user.email,
                    id: request.session.user._id
                }
            });
            return newOrder.save();

        }).then(result=>{

            request.user.cart.items = [];
            return request.user.save();
        }).then(result=>{

            response.redirect('/orders');
        }).catch(err=>{
            console.log(err);
        })

    //mongodb code
    // request.user.addOrder()
    //             .then(()=>{
    //                 response.redirect("/orders");
    //             })
    //             .catch(err=>{
    //                 console.log(err);
    //             })
    
    //Sequelize code
    // let cartProducts;
    // let fetchedCart;

    // request.user.getCart().then(cart=>{

    //     fetchedCart = cart;
    //     return cart.getProducts();
    // }).then(products=>{

    //     cartProducts = products;
    //     return request.user.createOrder();
    // }).then(order=>{

    //     return order.addProducts(cartProducts.map(product=>{
            
    //         product.orderItem = {quantity: product.cartItem.quantity}; 
    //         return product;
    //     }));
    // }).then(result=>{

    //     fetchedCart.setProducts(null);
    //     response.redirect("/orders");
    // }).catch(err=>{
    //     console.log(err);
    // })
}; 