const Product = require('../models/product');
const path = require('path');

exports.getAddProduct = (request, response, next)=>{
    //console.log("In add products GET");
    //response.sendFile(path.join(rootDir, 'views','add-product.html'));
    response.render(path.join('admin','edit-product'), {
        pageTitle:"Add Product", 
        path:"/admin/add-product",
        editing: "false",
        isAuthenticated: request.session.isLoggedIn
        // If I want to disable the layout, the following field has to be set
        // layout: false
    }); //it knows to look for pug files
};

exports.postAddProduct = (request, response, next)=>{
    
    //request.body gives the body of the request
    const title = request.body.title;
    const imageUrl = request.body.imageUrl;
    const price = request.body.price;
    const description = request.body.description;
    
    // const newProduct = new Product(title,
    //                                 price,
    //                                 description,
    //                                 imageUrl, 
    //                                 null, 
    //                                 request.user._id //this is just a string, not mongodb.ObjectId
    //                             );

    //mongoose code
    const newProduct = new Product({

        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: request.session.user._id,
    });
    
    //if associactions are created like hasMany-belongsTo
    //sequelize object provides us with different methods like the following
    // request.user.createProduct( {title: title,
    //     price: price,
    //     description: description,
    //     imageUrl: imageUrl,
    //     userId: request.user.id
    // }).then(result=>{
    newProduct.save().then(result=>{
        // console.log(result);
        //I can still set "statusCode" to 302 and set setHeader location to the url
        //I'm redirecting to
        console.log("INSERTION complete!"); 
        response.redirect("/admin/products");
    
    }).catch(err=>{
        console.log(err);
    });
    
    // newProduct.saveProduct().then(()=>{
        
    //     //I can still set "statusCode" to 302 and set setHeader location to the url
    //     //I'm redirecting to 
    //     // response.redirect("/admin/products");
    //     response.redirect("/");
    // }).catch(err=>{
    //     console.log(err);
    // });
}; 

exports.getEditProduct = (request, response, next)=>{

    const editMode = request.query.edit;
    if(editMode !== "true"){
        return response.redirect("/admin/products");
    }
    //now that I'm sure I'm in edit mode
    const productID = request.params.productID;
    Product.findById(productID)
    .then(product=>{
    //request.user.getProducts({where: {id:productID} })

    // .then(products=>{
        // const product = products[0];

        if(!product){
            response.redirect("/admin/products");
        }

        response.render(path.join('admin','edit-product'),{
            pageTitle: 'Edit Product',
            path: 'admin/edit-product',
            editing: editMode,
            product: product,
            isAuthenticated: request.session.isLoggedIn 
        });
    }).catch(err=>{
        console.log(err);
    });
};

exports.postEditProduct = (request, response, next)=>{

    const updatedTitle = request.body.title;
    const updatedImageUrl = request.body.imageUrl;
    const updatedPrice = request.body.price;
    const updatedDesc = request.body.description;
    const id = request.body.id;

    //mongoose code
    Product.findById(id)
            .then(product=>{

                product.title = updatedTitle;
                product.price = updatedPrice;
                product.imageUrl = updatedImageUrl;
                product.description = updatedDesc;
                return product.save();
            })
            .then(result=>{

                console.log('Product Update complete!');
                response.redirect("/admin/products");
            }) 
            .catch(err=>{
                console.log(err);
            })

    //mongodb code
    //const UpdatedProduct = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, id);
    
    //Sequqlize code
    // Product.findByPk(id).then(product=>{
       
    //     product.title = updatedTitle;
    //     product.price = updatedPrice;
    //     product.description = updatedDesc;
    //     product.imageUrl = updatedImageUrl;

    //     return product.save();
    // })

    //mongodb code
    // UpdatedProduct.save()
    // .then(()=>{
    //     console.log("UPDATE complete!");
    //     response.redirect("/admin/products");
    // }).catch(err=>{
        
    //     console.log(err);
    // });


};

exports.postDeleteProduct = (request, response, next)=>{

    const productID = request.body.id;
    // Product.findByPk(productID).then(product=>{
    //     return product.destroy();
    // })
    
    //mongoose code
    Product.findByIdAndRemove(productID)
            .then(result=>{

                console.log('Product Deleted!');
                response.redirect('/admin/products');
            })
            .catch(err=>{
                console.log(err);
            })

    //mongodb code
    // Product.deleteById(productID)
    // .then(()=>{
    //     response.redirect('/admin/products');
    // }).catch(err=>{
    //     console.log(err);
    // });
  
};

exports.getProductList = (request, response, next)=>{
    
    // Product.findAll()
    //request.user.getProducts()
    //mongoose code
    // Product.find().cursor().next()
    Product.find()
            // .select('title price -_id') //only title and price have been fetched, id and imageUrl have been excluded
            // .populate('userId')//this fetches all the user info for that userId
            .then(products=>{

                // console.log(products);
                response.render(path.join('admin', 'product-list'), {
                    pageTitle:'Admin Products', 
                    prodList:products, 
                    path: "/admin/product-list",
                    isAuthenticated: request.session.isLoggedIn 
                });

            })
            .catch(err=>{
                console.log(err);
            })

    //mongodb code
    // Product.fetchAll()
    // .then(products=>{
        
    //     response.render(path.join('admin', 'product-list'), {
    //         pageTitle:'Admin Products', 
    //         prodList:products, 
    //         path: "/admin/product-list", 
    //     });
    // }).catch(err=>{
    //     console.log(err);
    // })
    

};
