const Product = require('../models/product');
const path = require('path');

exports.getAddProduct = (request, response, next)=>{
    //console.log("In add products GET");
    //response.sendFile(path.join(rootDir, 'views','add-product.html'));
    response.render(path.join('admin','edit-product'), {
        pageTitle:"Add Product", 
        path:"/admin/add-product",
        editing: "false"
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
    //const newProduct = new Product(null, title, imageUrl, description, price);
    
    Product.create({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl
    }).then(result=>{
        console.log(result);
        //I can still set "statusCode" to 302 and set setHeader location to the url
        //I'm redirecting to 
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
    Product.findByPk(productID).then(product=>{

        if(!product){
            response.redirect("/admin/products");
        }

        response.render(path.join('admin','edit-product'),{
            pageTitle: 'Edit Product',
            path: 'admin/edit-product',
            editing: editMode,
            product: product 
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

    Product.findByPk(id).then(product=>{
       
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;

        return product.save();
    }).then(result=>{
        response.redirect("/admin/products");
    }).catch(err=>{
        
        console.log(err);
    });


};

exports.postDeleteProduct = (request, response, next)=>{

    const productID = request.body.id;
    Product.findByPk(productID).then(product=>{
        return product.destroy();
    }).then(result=>{
        response.redirect('/admin/products');
    }).catch(err=>{
        console.log(err);
    });
  
};

exports.getProductList = (request, response, next)=>{
    
    Product.findAll().then(products=>{
        
        response.render(path.join('admin', 'product-list'), {
            pageTitle:'Admin Products', 
            prodList:products, 
            path: "/admin/product-list", 
        });
    }).catch(err=>{
        console.log(err);
    })
    
    // Product.fetchAll(products=>{

    //     //console.log('shop.js: ',products);
    //     //using pug template engine
    //     //response.render('shop', {pageTitle: 'Shop', prodList:  products, path:"/"}); //it knows to look for pug files
    //     response.render(path.join('admin', 'product-list'), {
    //         pageTitle:'Admin Products', 
    //         prodList:products, 
    //         path: "/admin/product-list", 
    //     });
    // });
};
