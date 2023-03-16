const express = require("express");
const authController = require("../controllers/auth");
const { body } = require("express-validator");

const router = express.Router();

router.post(
  "/register",
  body("firstName").isString(),
  body("lastName").isString(),
  body("email").isEmail(),
  body("address").isString(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than or equal to 8"),
  authController.register
);

router.post(
  "/login",
  body("email").isString(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password length must be greater than equal to 8"),
  authController.login
);

router.get('/verify/:token',authController.verifyUser);

module.exports = router;
