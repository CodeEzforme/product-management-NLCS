const express = require("express");
const multer = require("multer");
const router = express.Router();

const storageMulterHelper = require("../../helpers/storageMulter");
const storage = storageMulterHelper();

const upload = multer()

const controller = require("../../controllers/admin/product-category.controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", upload.single("thumbnail"), uploadCloud.upload, controller.createPost);
// router.post("/create", upload.single("thumbnail"), controller.createPost);


router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single("thumbnail"), uploadCloud.upload, controller.editPatch);
// router.patch("/edit/:id", upload.single("thumbnail"), controller.editPatch);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router;