const mongoose = require("mongoose");

// Schema definition for user
var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords did'nt match. Try again!",
    },
  },
});

//Initializing admin and user models with the predefined schemas
const user = mongoose.model("User", userSchema);
module.exports = user;
