const mongoose = require("mongoose");

//Schema definition for testimonial
const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  review: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
});
const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = Testimonial;
