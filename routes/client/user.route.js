const express = require("express");
const router = express.Router();

const controller = require('../../controllers/client/user.controller');
const authMiddleware = require('../../middlewares/client/auth.middleware')
const validate = require('../../validates/client/user.validate');

router.get("/register", controller.register);
router.get("/login", controller.login);
router.get("/logout", controller.logout);
router.get("/password/forgot", controller.forgotPassword);
router.get("/password/otp", controller.otpPassword);
router.get("/password/reset", controller.resetPassword);
router.get("/info",
  authMiddleware.authRequire,
  controller.userInfo
)

router.get("/edit", controller.edit);

router.patch(
  '/edit',
//   validate.updatePatch,
  controller.editPatch
);


router.post("/register",
  validate.registerPost,
  controller.registerPost
);

router.post("/login",
  validate.loginPost,
  controller.loginPost
);

router.post("/password/forgot",
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.post("/password/otp", controller.otpPasswordPost);

router.post("/password/reset",
  validate.resetPasswordPost,
  controller.resetPasswordPost
);

module.exports = router;