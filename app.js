const express = require('express');
const body_parser = require('body-parser');
const app = express();
const date = require(__dirname + "/date.js");
const items = [];
const work_items = [];

app.use(body_parser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  const day = date.get_date();
  res.render("list", {
    list_title: day,
    new_list_items: items
  });
});

app.post("/", function(req, res) {
  const item = req.body.new_item;
  if (req.body.list === "Work") {
    work_items.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("list", {
    list_title: "Work List",
    new_list_items: work_items
  });
});

app.post("/work", function(req, res) {
  const item = req.body.new_item;
  work_items.push(item);
  res.redirect("/work");
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log('Server is running on port 3000.');
});
