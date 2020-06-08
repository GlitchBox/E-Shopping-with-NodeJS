const expressFunction = require('express');

//this is like a mini express app which is pluggable into another express app
const router = expressFunction.Router();
const path = require('path');
const rootDir = require('../util/path');
const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/admin');

//I'll have to use the router to register things

//route-handling middlewares
// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);
 
//the same path can be used if the methods differ(do two different things when
//the methods differ)
// /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:productID", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

router.get("/products", isAuth, adminController.getProductList);

//I'm exporting the router object for other js files to use
module.exports =router;
