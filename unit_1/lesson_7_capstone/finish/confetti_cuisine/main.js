"use strict";

const express = require("express"),
  app = express(),
  homeController = require("./controllers/homeController"),
  errorController = require("./controllers/errorController"),
  layouts = require("express-ejs-layouts");

  const Subscriber = require("./models/subscriber")
  const mongoose = require("mongoose");
  mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  {useNewUrlParser: true}
  );
  const db = mongoose.connection;
  db.once("open", () => {
console.log("Successfully connected to MongoDB using Mongoose!");
});
db.collection("contacts")
.insert({
name: "Freddie Mercury",
email: "fred@queen.com"
}, (error, db) => {
if (error) throw error;
console.log(db);
});

//first way to instant insert model
var subscriber1 = new Subscriber({
name: "Bel Bee",
email: "bel@bee.com"
});
subscriber1.save((error, savedDocument) => {
if (error) console.log(error);
console.log(savedDocument);
});
//second way to insert
Subscriber.create(
{
name: "Don Bel",
email: "don@bel.com"
},
function (error, savedDocument) {
if (error) console.log(error);
console.log(savedDocument);
}
);
var myQuery = Subscriber.findOne({
name: "Jon Wexler"
})
.where("email", /wexler/);
myQuery.exec((error, data) => {
if (data) console.log(data.name);
});
app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
app.use(layouts);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpForm);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
