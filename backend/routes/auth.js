const { Router } = require("express");
const jwt = require("jsonwebtoken");
const Member = require("../model/memberSchema");
const bcrypt = require("bcrypt");
const router = Router();

router.post("/login", async ({ body: { email, password } }, res) => {
  try {
    if (!email | !password)
      return res.status(400).json({ message: "Incorrect Email or Password" });

    const member = await Member.findOne({ email });

    if (!member || !(await bcrypt.compare(password, member.password)))
      return res.status(400).json({ message: "Incorrect Email or Password" });

    const token = jwt.sign({ _id: member?._id }, "qwertyuiop", {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      member,
    });
  } catch (ex) {
    res.status(400).json({
      message: ex,
    });
  }
});

module.exports = router;
