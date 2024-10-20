const express = require("express");
const ctrl = require("../../controllers/user");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");

const router = express.Router();

router.post("/register", validateBody(schemas.addUserSchema), ctrl.register);

router.post(
  "/forgotPassword",
  validateBody(schemas.requestForChangingPassword),
  ctrl.forgotPassword
);

router.post(
  "/renewpassword/:renewPasswordToken",
  validateBody(schemas.changePasswordSchema),
  ctrl.renewPassword
);

router.post("/login", validateBody(schemas.loginUserSchema), ctrl.login);

router.put(
  "/:userId",
  authenticate,
  validateBody(schemas.updateUserSchema),
  ctrl.updateUser
);

router.post("/:userId", authenticate, ctrl.logout);

router.delete("/", authenticate, ctrl.deleteAcc);

module.exports = router;
