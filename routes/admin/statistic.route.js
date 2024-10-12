const express = require("express");
// const multer = require('multer');
const router = express.Router();



// const storageMulterHelper = require("../../helpers/storageMulter");
// const storage = storageMulterHelper();

// const upload = multer({
// storage: storage
// });

// const upload = multer();

const controller = require("../../controllers/admin/statistic.controller");
// const validate = require("../../validates/admin/product.validate");
// const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
// const uploadToCloudMiddleware = require("../../middlewares/admin/uploadToCloud.middleware");

router.get("/", controller.index);

// router.get("/edit/:id", controller.edit);

// router.get("/detail/:id", controller.detail);

module.exports = router;