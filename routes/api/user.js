const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User.js");

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "please enter valid email").isEmail(),
    check("password", "please provide a strong password ").isStrongPassword(),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exists" }] });
      }

      //get gravatar

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //bcrypt password
      const salt = await bcrypt.genSaltSync(10);
      user.password = await bcrypt.hashSync(password, salt);

      await user.save();

      //return jswebtoken

      const payload = {
        user: {
          id: user.id,
        },
      };

     var token =  jwt.sign(
        payload,
        config.get("tokenSecret"),
        { expiresIn: 360000 }
      );
      res.json({token});

    } catch (err) {
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
