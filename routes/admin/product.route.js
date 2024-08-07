const express = require("express");
const multer = require('multer');
const router = express.Router();



// const storageMulterHelper = require("../../helpers/storageMulter");
// const storage = storageMulterHelper();

// const upload = multer({
// storage: storage
// });

const upload = multer();

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const trimInput = require("../../middlewares/admin/stringInput.middleware");
// const uploadToCloudMiddleware = require("../../middlewares/admin/uploadToCloud.middleware");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.fields([
    { name: 'thumbnail', maxCount: 5},
    { name: 'audio', maxCount: 2 }
  ]),
  uploadCloud.uploadFields,
  // uploadToCloudMiddleware.uploadImage,
  validate.createPost,
  controller.createPost
);

// router.post(
//   "/create",
//   // upload.array("thumbnail", 5),
//   upload.fields([{ name: "thumbnail", maxCount: 8}]),
//   uploadCloud.uploadFields,
//   // uploadToCloudMiddleware.uploadImage,
//   // validate.createPost,
//   controller.createPost
// );

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.fields([
    { name: 'thumbnail', maxCount: 5},
    { name: 'audio', maxCount: 2 }
  ]),
  uploadCloud.uploadFields,
  // uploadToCloudMiddleware.uploadImage,
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail);

module.exports = router;