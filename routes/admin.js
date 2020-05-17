const expressFunction = require('express');

//this is like a mini express app which is pluggable into another express app
const router = expressFunction.Router();
const path = require('path');
const rootDir = require('../util/path');

const adminController = require('../controllers/admin');

//I'll have to use the router to register things

//route-handling middlewares
// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);
 
//the same path can be used if the methods differ(do two different things when
//the methods differ)
// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

router.get("/edit-product/:productID", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

router.post("/delete-product", adminController.postDeleteProduct);

router.get("/products", adminController.getProductList);

//I'm exporting the router object for other js files to use
module.exports =router;
