const mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({ name: String, icon: String });
const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
