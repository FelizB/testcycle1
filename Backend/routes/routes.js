const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = Router();

// Register user--------------------------------------

router.post("/register", async (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    Name: name,
    Email: email,
    Password: hashedPassword,
  });

  try {
    const record = await User.findOne({ Email: email });
    if (!record) {
      const result = await user.save();

      const { _id } = await result.toJSON();
      const token = jwt.sign({ _id: _id }, "secret");
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 10000,
      });
      res.json({
        user: result,
      });
    } else {
      return res.status(400).send({
        message: "Email already exists",
      });
    }
  } catch (error) {
    res.send(error);
  }
});

// Log in user--------------------------------------
router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  const user = await User.findOne({ Email: email });
  try {
    if (!user) {
      return res.status(404).send({
        message: "user not found",
      });
    } else {
      if (!(await bcrypt.compare(password, user.Password))) {
        return res.status(400).send({
          message: "Incorrect Credentials",
        });
      } else {
        const token = jwt.sign({ _id: user._id }, "secret");
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.send({
          message: "Success",
        });
      }
    }
  } catch (error) {
    return res.send(error);
  }
});

router.post("/logOut", async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.send({ message: "logged out" });
});

router.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, "secret");
    if (!claims) {
      return res.status(401).send({
        message: "try to log in ",
      });
    }
    const user = await User.findOne({ _id: claims._id });
    const { password, ...data } = await user.toJSON();
    res.send(data);
  } catch (error) {
    return res.status(401).send({
      message: "Unable to verify the user",
    });
  }
});

module.exports = router;
