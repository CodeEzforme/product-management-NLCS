const express  = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller");
const authMiddleware = require('../../middlewares/client/auth.middleware');

router.get("/", controller.index);

router.get('/:slugCategory', controller.category);

router.get("/detail/:slugProduct", authMiddleware.authRequire, controller.detail);


module.exports = router;