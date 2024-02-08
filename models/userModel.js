const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required for an user"],
  },
  email: {
    type: String,
    required: [true, "Email is required for an user"],
    lowercase: true,
    unique: [true, "Use a different email. This one is already in use"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false,
  },
  confirmedPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passoerd does not match",
    },
  },
});

//encrypt psssword while signup
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmedPassword = undefined;
  next();
});

//compare password function for login
userSchema.methods.checkPassword = async function (reqPassword, userPassword){
  return await bcrypt.compare(reqPassword, userPassword);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
