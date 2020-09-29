const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express()

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))


mongoose.connect("mongodb://127.0.0.1/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


// DB SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
})

const Campground = mongoose.model("Campground", campgroundSchema)



// ROUTES

app.get("/", function(req, res) {
    res.render("landing")
})

// INDEX - Show all campgrounds
app.get("/campgrounds", function(req, res) {
    // Get all campground from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds", { campgrounds: allCampgrounds })
        }
    })

})

// CREATE - Add new campground to DB
app.post("/campgrounds", function(req, res) {
    let newCampName = req.body.newCampName
    let newCampImage = req.body.newCampImage
    let newCampground = { name: newCampName, image: newCampImage }
    console.log(newCampground)
    // campgrounds.push(newCampground)
    // Create a New Campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/campgrounds")
        }
    })
})

// NEW - show form to create a new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("newCampground")
})

// SHOW - Shows info about one item ***** ATENÇÃO *** -> Esta route tem que ser colocada ABAIXO da route "/campgrounds/new"
    // Caso contrário a route "/campgrounds/new" será considerada como parametro que estamos a definir na route abaixo --> /campgrounds/:id"
app.get("/campgrounds/:id", function(req, res) {
    res.send("This will be the Show page one day")
})





app.listen("3000", function(req, res) {
    console.log("Server Up and Running at PORT 3000")
})