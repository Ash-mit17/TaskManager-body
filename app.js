// Import required modules
require('dotenv').config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const app = express()
const mongoose = require("mongoose")

// Connect to MongoDB using environment variable
mongoose.connect(process.env.id, { useNewUrlParser: true })

// Define the schema for items in the to-do list
const Schema = new mongoose.Schema({
    body: {
        type: String,
        required: [],
        maxlength: [50, 'should not be more than 50 words']
    }
})

// Create a model based on the schema
const Items = new mongoose.model("item", Schema);

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

// Set the view engine to EJS
app.set("view engine", "ejs")

// Handle GET request for the home page
app.get("/", function (req, res) {
    // Find all items in the database
    Items.find({}, { body: 1, _id: 1 })
        .sort({ body: 1 })
        .then((foundItems) => {
            // Render the home page with the found items
            res.render("home", { dataArray: foundItems })
        })
        .catch((err) => {
            console.log(err)
        })
})

// Handle POST request for adding a new item
app.post("/", async function (req, res) {
    let b = req.body.newentry;
    const item = new Items({
        body: b
    })

    // Find all items in the database
    var arr = await Items.find({}, { body: 1, _id: 1 })
        .then((foundItems) => {
            return foundItems;
        })
        .catch((err) => {
            console.log(err)
        })

    var flag = 0;
    arr.forEach(element => {
        if (element.body === b) {
            flag = 1;
        }
    });

    // Add the new item to the database if it doesn't already exist
    if (flag === 0) {
        item.save();
        arr = arr.concat([{ body: b }])
    }

    // Redirect to the home page
    res.redirect("/");
})

// Handle POST request for editing an item
app.post("/edit", (req, res) => {
    var id = req.body.edit;
    // Find the item by its ID
    Items.findOne({ _id: id })
        .then((foundItems) => {
            // Render the task page with the item's ID and name
            res.render("task", { id1: foundItems._id, name: foundItems.body })
        })
        .catch((err) => {
            console.log(err)
        })
})

// Handle POST request for updating an item
app.post("/update", async (req, res) => {
    var name1 = req.body.newname;
    var idnew = req.body.btnid;
    // Update the item with the new name
    await Items.updateOne({ _id: idnew }, { $set: { body: name1 } })
    // Redirect to the home page
    res.redirect("/");
})

// Handle POST request for deleting an item
app.post("/delete", async (req, res) => {
    var id = req.body.delete;
    // Delete the item from the database
    await Items.deleteOne({ _id: id })
    // Redirect to the home page
    res.redirect("/");
})

// Start the server
app.listen(3000, function (req) {
    console.log("Server running on port 3000")
})
