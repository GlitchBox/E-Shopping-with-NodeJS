const Product = require('../models/product');
const path = require('path');
const Cart = require('../models/cart');
const rootDir = require('../util/path');

exports.getProducts = (request, response, next)=>{
    
    Product.findAll().then(products=>{
        
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

    Product.findByPk(productID).then(product=>{
        
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
    
    Product.findAll().then(products=>{
        
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

    Cart.getCart(cart=>{
        
        const cartProducts = [];
        Product.fetchAll(products=>{

            for(product of products){

                const foundInCart = cart.products.find(prod=>prod.id===product.id);
                if(foundInCart){
                    cartProducts.push({productData: product, quantity: foundInCart.quantity});
                }
            }
            console.log(cartProducts);
            response.render(path.join('shop', 'cart'),{
                path:'/cart',
                pageTitle:'Your Cart',
                products: cartProducts
            
            });
        });
    });

};

exports.postCart = (request, response, next)=>{
    const productID = request.body.productID;
    //console.log(productID);

    Product.findByID(productID, product=>{
        Cart.addProduct(product.id, product.price);
    });
    response.redirect("/cart");
};

exports.postDeleteCart = (request, response, next)=>{
    
    const productID = request.body.id;
    Product.findByID(productID, (product)=>{
        Cart.deleteProduct(productID, product.id, ()=>{

            response.redirect("/cart");
        });
    })
};

exports.postDownload = (request, response, next)=>{
    
    const productID = request.body.productID;
    //console.log(productID);

    Product.findByID(productID, product=>{
        response.download("/"+product.title+".pdf", product.title+".pdf", {root: path.join(rootDir, 'downloads')});
    });
}

exports.getCheckout = (request, response, next)=>{

    response.render(path.join('shop', 'checkout'),{
                        path:'/checkout',
                        pageTitle:'Checkout'

    });
};

exports.getOrders = (request, response, next)=>{
    
    response.render(path.join('shop', 'orders'), {
        path:'/orders',
        pageTitle:'Your Orders'
    })
};