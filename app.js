const express = require('express');
const body_parser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.use(body_parser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-jrignell:test123@cluster0.gmzxx.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const items_schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter something to do!"]
  }
});

const Item = mongoose.model("Item", items_schema);

const info1 = new Item({
  name: "Welcome to your todolist!"
});

const info2 = new Item({
  name: "Hit the + button to add a new item."
});

const default_items = [info1, info2];

const list_schema = {
  name: String,
  items: [items_schema]
};

const List = mongoose.model("List", list_schema);

app.get('/', function(req, res) {
  Item.find({}, function(err, found_items) {
    if (found_items.length === 0) {
      Item.insertMany(default_items, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully updated the documents.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        list_title: "Today",
        new_list_items: found_items
      });
    }
  });
});

app.get("/:route_name", function(req, res) {
  const route = _.capitalize(req.params.route_name);
  List.findOne({
    name: route
  }, function(err, found_list) {
    if (!err) {
      if (!found_list) {
        // Create a new list
        const list = new List({
          name: route,
          items: default_items
        });
        list.save();
        res.redirect("/" + route);
      } else {
        // Show an existing list
        res.render("list", {
          list_title: found_list.name,
          new_list_items: found_list.items
        });
      }
    }
  });
});

app.post("/", function(req, res) {
  const item_name = req.body.new_item;
  const list_name = req.body.list;
  const item = new Item({
    name: item_name
  });
  if (list_name === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: list_name
    }, function(err, found_list) {
      found_list.items.push(item);
      found_list.save();
      res.redirect("/" + list_name);
    });
  }
});

app.post("/delete", function(req, res) {
  const checked_item_id = req.body.checkbox;
  const list_name = req.body.list_name;

  if (list_name === "Today"){
    Item.findByIdAndRemove(checked_item_id, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted checked item.");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: list_name}, {$pull: {items: {_id: checked_item_id}}}, function(err, found_list){
      if (!err){
        res.redirect("/" + list_name);
      }
    });
  }
});

app.post("/work", function(req, res) {
  const item = req.body.new_item;
  work_items.push(item);
  res.redirect("/work");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log('Server is running on port 3000.');
});
