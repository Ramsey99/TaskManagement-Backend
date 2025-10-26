const express = require("express");
const userRouter = express.Router();
const {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
} = require("../controllers/user.controller");

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);
userRouter.post("/forgotPass", forgotPassword);
userRouter.post("/resetPass/:token", resetPassword);

module.exports = userRouter;
console.log("User router is working");
