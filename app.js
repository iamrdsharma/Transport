const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const Item = require("./models/itemModel");
const admin = require("./models/adminModel");
const user = require("./models/userModel");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pageRoutes = require("./routes/pageRoutes");
const testiRouter = require("./routes/testiRoutes");
const Testimonial = require("./models/testimonialModel");
const MongoDBSession = require("connect-mongodb-session")(session);
const ejs = require("ejs");
const app = express();
const PORT = 5000;

//MONGO-DB SCHEMA

// const onlyAdmin = new admin({
//   email: "rahulsharma@gmail.com",
//   password: "pass123",
// });
// onlyAdmin.save().then((doc) => {
//   console.log("Daocument saved.", doc);
// });

//STORE
const store = MongoDBSession({
  uri: "mongodb://localhost:27017/anyMovers",
  collection: "the_sessions",
});

//MIDDLEWARES
app.use(express.static("./views"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "Cookie assigning key!",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//isAuth function for authorizing admin
const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/admin");
  }
};

//userAuth function for authorizing user
const userAuth = (req, res, next) => {
  if (req.session.isAuth) next();
  else
    res.render("login", {
      credentials: true,
    });
};

//VIEW ENGINE
app.set("view engine", "ejs");

//Items Data
var items_data = [];

// Item.find({}, (err, data) => {
//   if (err) return console.log(err);
//   else {
//     data.forEach((el) => {
//       items_data.push({ name: el.name, icon: el.icon });
//     });
//   }
// });
const track = function () {
  Item.find({}, (err, data) => {
    items_data = data;
  });
};

//ROUTES
const home = "/" || "/index";

var created = false;

app.post("/delivery-form.html", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/delivery-form.html"));
});

//** User Setup **/

//Getting the signup page with a get request
app.get("/user-signup", (req, res) => {
  res.render("ragister", {
    registered: false,
  });
});

//Sending the new user's details with post method
app.post("/user-signup", (req, res) => {
  const { first, last, email, password, confirmPassword } = req.body;
  const newUser = new user({
    firstname: first,
    lastname: last,
    email,
    password,
    confirmPassword,
  })
    .save()
    .then((doc) => console.log("User added to database!"));
  res.render("ragister", {
    registered: true,
  });
});

//Getting the login page for an existing user
app.get("/user-login", (req, res) => {
  res.render("login", {
    credentials: true,
  });
});

//Sending and checking the details of a user and also checking whether to allow for using the protected routes
app.post("/user-login", async (req, res) => {
  const { email, password } = req.body;
  const checkuser = await user.findOne({ email });
  //rendering login page again if credentails not found in database
  if (!checkuser || password !== checkuser.password) {
    return res.render("login", {
      credentials: false,
    });
  }
  req.session.isAuth = true;
  res.redirect("/user-dash");
});

//Getting the user's dashboard only if he is authorized with the help of userAuth function
app.get("/user-dash", userAuth, (req, res) => {
  res.render("user");
});

//Logging out the user by destryoing the current session
app.get("/user-logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return console.log(err);
    res.redirect("/");
  });
});
app.post("/vendor-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/vendor-dashboard.html"));
});

//Get request for admin-login page
app.get("/admin", (req, res) => {
  res.render("admin");
});

//Getting admin dashboard if isAuth returns true
app.get("/admin-dash", isAuth, (req, res) => {
  res.render("admin-dash");
});

//Checking for details of admin login
app.post("/admin", async (req, res) => {
  const { email, password } = req.body;
  const checkadmin = await admin.findOne({ email });
  if (!checkadmin || password !== checkadmin.password) {
    return res.redirect("/admin");
  }
  req.session.isAuth = true;
  res.redirect("/admin-dash");
});

//Logging out the admin by destroying the current session
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return console.log(err);
    res.redirect("/");
  });
});

//Create an Item
//Get the page
app.get("/create", (req, res) => {
  res.render("create", { created });
});

//Send the details of new item
app.post("/create", (req, res) => {
  //const {item_name,icon} = req.body;
  const itemCreated = new Item({
    name: req.body.item_name,
    icon: req.body.icon,
  });
  itemCreated
    .save()
    .then((doc) => {
      created = true;
      track();
      res.render("create", {
        created: created,
      });
    })
    .catch((err) => console.log("Some error occured"));
});

//Get all the items with a get request
app.get("/read", (req, res) => {
  res.render("read", {
    data: items_data,
  });
});

//Getting the update page
app.get("/update", (req, res) => {
  res.render("update", {
    updated: false,
  });
});

//Sending the updating details for an existing item
app.post("/update", async (req, res) => {
  var { toBeUpdated, updatedName, updatedIcon } = req.body;
  await Item.updateOne(
    { name: toBeUpdated },
    {
      name: updatedName,
      icon: updatedIcon,
    }
  );
  track();
  res.render("update", {
    updated: true,
  });
});

//Getting the page to delete an item
app.get("/delete", (req, res) => {
  res.render("delete", {
    deleted: false,
  });
});

//Sending the details of item to be deleted
app.post("/delete", async (req, res) => {
  var { toBeDeleted } = req.body;
  await Item.deleteOne({ name: toBeDeleted });
  res.render("delete", {
    deleted: true,
  });
});

//Testimonial
app.use("/createReview", testiRouter);

//Getting the homepage

app.use(home, pageRoutes);
//Start server
module.exports = app;
// const port = 5000;
