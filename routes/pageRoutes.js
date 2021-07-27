const express = require("express");
const pageController = require("../controllers/pageController");

const router = express.Router();

//Routes for page rendering
router.route("/").get(pageController.getHome);
module.exports = router;
