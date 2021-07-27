const app = require("./app");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//SETTING UP THE DATABASE
const DB = "mongodb://localhost:27017/anyMovers";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DataBase connected successfully!!!"));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Server running at ${port}`));
