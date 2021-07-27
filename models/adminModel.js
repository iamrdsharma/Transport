const mongoose = require("mongoose");

// Schema definition for admin
var adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const admin = mongoose.model("Admin", adminSchema);
module.exports = admin;
