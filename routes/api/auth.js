const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { body, validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//route GET api/auth
//@description test route
//access public/auth req

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

//route POST api/auth
//@description login auth route
//access public/auth req

router.post(
  "/",
  [
    check("email", "please enter valid email").isEmail(),
    check("password", "password is required").exists(),
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      ///see if user exists
      let user = await User.findOne({ email });

      if (!user) {
        res.status(400).json([{ msg: "invalid credentials" }]);
      }

      //compare password with email got from user using bcrypt.compare

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      ///js webtoken

      const payload = {
        user: {
          id: user.id
        }
      };
      var token = jwt.sign(payload, config.get("tokenSecret"), { expiresIn: 36000 });
      res.json({token});

    } catch (err) {
      res.status(400).send({ msg: "server error" });
    }
  }
);

module.exports = router;
