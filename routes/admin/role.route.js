const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", controller.createPost);

router.get('/detail/:id', controller.detail);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editPatch);

router.get("/permissions", controller.permissions);

router.patch("/permissions", controller.permissionsPatch);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router;