const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const db = require("../models");
const User = db.User;

exports.register = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const check_user = await User.findOne({ where: { email: req.body.email } });

  if (check_user) {
    return res.json({ errors: { error: "Email is already registered" } });
  }

  const hashPassword = await bcrypt.hash(req.body.password, 12);

  //creating the user
  const user = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashPassword,
    address: req.body.address,
    verified: 0,
  });

  //token valid for 1 day(24 hr)
  const token = jwt.sign({ user }, process.env.SECRET_CODE, {
    expiresIn: 60 * 60 * 24,
  });


  //Integrated with mailhog for development purposes. Run a mailhog server on 1025 port to get the register emails.
  const mailer = nodemailer.createTransport({
    port: 1025,
  });

  //sending mail
  await mailer.sendMail({
    from: "no-reply@gymapp.com",
    to: user.email,
    subject: "Register your email",
    html: `
    <h3>Click the link below to register yourself</h3>
    ${req.protocol}://${req.headers.host}/auth/verify/${token}
    `,
  });

  return res.json({
    success: 200,
    msg: "We have sent you a mail please register yourself",
  });
};

exports.verifyUser = async (req, res, next) => {
  try {
    var decoded = jwt.verify(req.params.token, process.env.SECRET_CODE);
    if (decoded) {
      const user = await User.findOne({ where: { id: decoded.user.id } });

      //verified field set to 1
      user.verified = 1;
      user.save();
      return res.json({
        success: 200,
        msg: "Successfully verified",
      });
    }
  } catch (err) {
    return res.status(400).json({ errors: { error: "Something went wrong!" } });
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //finding if user present and have verified status 1
  const user = await User.findOne({
    where: { email: req.body.email, verified: 1 },
  });
  if (!user) {
    return res.status(400).json({ errors: { error: "User not found" } });
  } else {
    const authenticate = await bcrypt.compare(req.body.password, user.password);

    if (authenticate) {
      //token valid for 1 week
      const token = jwt.sign({ user }, process.env.SECRET_CODE, {
        expiresIn: 60 * 60 * 24 * 7,
      });

      return res.json({
        token: token,
        success: 200,
        msg: "Login sucessfully",
      });
    } else {
      return res
        .status(400)
        .json({ errors: { error: "Authentication failed" } });
    }
  }
};
