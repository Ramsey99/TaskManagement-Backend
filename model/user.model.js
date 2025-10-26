const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      validate: {
        validator: (nameValue) => /^[A-Za-z\s]{3,20}$/.test(nameValue),
        message: (props) =>
          `${props.value} is invalid. Must contain minimum 3 and maximum 20 characters`,
      },
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: (emailValue) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue),
        message: (props) => `${props.value} is invalid email`,
      },
    },

    profile_pic: {
      type: String,
    },

    pass: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: (passValue) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/.test(
            passValue
          ),
        message: (props) =>
          `${props.value} is invalid. Password Should contains atleast one upperCase, one lowerCase, one digit, one special character and minimum 6 to maximum 16 characters`,
      },
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", function (next) {
  if (this.isModified("pass")) {
    const salt = bcrypt.genSaltSync(10);
    this.pass = bcrypt.hashSync(this.pass, salt);
  }
  next();
});

module.exports = mongoose.model("userModel", userSchema, "users");
console.log("User model is working");
