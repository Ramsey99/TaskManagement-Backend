const userModel = require("../model/user.model");
const multer = require("multer");
const base_url = require("../baseUrl");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const uploadStorage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: uploadStorage });

exports.signUp = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      const user = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        pass: req.body.pass,
        profile_pic: req.file ? base_url + "/" + req.file.filename : null,
      });

      if (!user) {
        res.status(500).json({ message: "Error while sign up" });
      } else {
        res.status(200).json({ message: "User signup successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

exports.signIn = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email }).exec();
    if (!user) {
      res.status(404).json({ message: "No such email found" });
    } else {
      let db_pass = user.pass;
      let isMatch = bcrypt.compareSync(req.body.pass, db_pass);
      if (isMatch) {
        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const { pass, ...userData } = user.toObject();
        res
          .status(200)
          .json({ message: "Login successfull", user: userData, token: token });
      } else {
        res.status(401).json({ message: "Wrong credentials" });
      }
    }
  } catch (error) {
    res.status(403).json({ error });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email is not joined with us!" });
    }
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const resetLink = `https://taskmanagement-frontend-smoky.vercel.app/resetPass/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailBody = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Link",
      html: `<h3>Hello ${user.name},</h3>
      <p>Click below link to reset your password. It is valid for only 15 minutes.</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>`,
    };
    await transporter.sendMail(mailBody);
    res.status(200).json({ message: "Reset passeork link sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending reset link" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPass } = req.body;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.pass = newPass;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Password reset successfull!" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expires token" });
  }
};

console.log("User controller is working");
