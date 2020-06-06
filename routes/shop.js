const expressFunction = require('express');
const router = expressFunction.Router();

const shopController = require('../controllers/shop');

//the '/' character means that this middleware would be called for any url that
//starts with '/'
router.get("/products", shopController.getProducts);

//the following route will have to be positioned before /products/:productID
//otherwise then Node will treat 'delete' as a variable content
//router.get("/products/delete");

router.get("/products/:productID", shopController.getDetails);

router.get("/cart", shopController.getCart);

router.post("/add-to-cart", shopController.postCart);

router.post("/delete-cart-item", shopController.postDeleteCart);

router.get("/orders", shopController.getOrders);

// router.get("/checkout", shopController.getCheckout);

// router.post("/download", shopController.postDownload);

router.get("/home", shopController.getIndex);

router.post("/create-order", shopController.postOrder);

router.get("/", shopController.getIndex);

//I'm exporting the router object for other modules(js files) to use.
//module.exports = router;
module.exports = router;