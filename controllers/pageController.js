const Item = require("../models/itemModel");
const Testimonial = require("../models/testimonialModel");
const app = require("../app");
exports.getHome = async (req, res) => {
  //calling the track function again so that changes made are reflected ont the homepage
  //track();
  const items = await Item.find();
  const testimonials = await Testimonial.find();
  res.status(200).render("index", {
    items,
    testimonials,
    adminOnline: req.session.isAuth,
  });
};
