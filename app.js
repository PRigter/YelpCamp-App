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
    image: String,
    description: String
})

const Campground = mongoose.model("Campground", campgroundSchema)

// Manual DATA
// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350",
//         description: "This is a huge granite hill, no bathrooms. No water. Beatifull granite!"
//     },
//     function(err, campground) {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log("Newly created campground")
//             console.log(campground)
//         }
//  })





// --- ROUTES

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
            res.render("index", { campgrounds: allCampgrounds })
        }
    })

})

// CREATE - Add new campground to DB
app.post("/campgrounds", function(req, res) {
    let newCampName = req.body.newCampName
    let newCampImage = req.body.newCampImage
    let newCampDescription = req.body.newCampDescription
    let newCampground = { name: newCampName, image: newCampImage, description: newCampDescription }
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

// SHOW - Shows more info about one item ***** ATENÇÃO *** -> Esta route tem que ser colocada ABAIXO da route "/campgrounds/new"
    // Caso contrário a route "/campgrounds/new" será considerada como parametro que estamos a definir na route abaixo --> /campgrounds/:id"
app.get("/campgrounds/:id", function(req, res) {
    const campgroundId = req.params.id
    Campground.findById(campgroundId, function(err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            res.render("show", { campground: foundCampground })
        }
    })

    
})





app.listen("3000", function(req, res) {
    console.log("Server Up and Running at PORT 3000")
})