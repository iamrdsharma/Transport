const Testimonial = require("../models/testimonialModel");
exports.showPage = (req, res, next) => {
  res.render("createReview", {
    created: false,
  });
  next();
};
exports.submitReview = async (req, res, next) => {
  const testimonial = await Testimonial.create({
    name: req.body.item_name,
    photo: "To be included",
    review: req.body.review,
    stars: req.body.stars,
  });
  res.send(req.body);
};
