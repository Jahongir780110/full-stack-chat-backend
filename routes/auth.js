const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Your password must contain at least 6 characters"),
    body("name")
      .trim()
      .isLength({ min: 2, max: 12 })
      .withMessage(
        "Your name must contain at least 2 characters and maximum 12 characters"
      )
      .not()
      .isEmpty(),
  ],
  authController.putSignup
);

router.post("/signin", authController.postSignin);

module.exports = router;
