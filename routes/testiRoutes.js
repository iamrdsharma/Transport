const express = require("express");
const testiController = require("../controllers/testiController");
//app.use(express.urlencoded({ extended: true }));

const router = express.Router();
router
  .route("/")
  .get(testiController.showPage)
  .post(testiController.submitReview);

module.exports = router;
