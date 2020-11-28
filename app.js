const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const moongoose = require("mongoose");
const _ = require("lodash");
const mongoose = require("mongoose");


const app = express();

moongoose.connect("mongodb://localhost:27017/myblogDB", { useNewUrlParser: true ,  useUnifiedTopology: true });



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/publi"));
app.set('view engine', 'ejs');



// const posts = [];

const PostSchema = {
    postName: String,
    postMassege: String
};


const Post = new mongoose.model("Post", PostSchema);

const startingContents = new Post({
    postName: "Welcome",
    postMassege: `Here is practising webpage you can compose your massage by typing on Search box " locahost:3000/compose "`,
});





app.get("/", function (req, res) {



    Post.find({}, function (err, foundData) {
        if (err) {
            console.log(err);
        } else {
            // console.log("Successfully Finded");
        }

        // console.log(foundData);

        if (foundData.length === 0) {
           startingContents.save();
        }

        res.render("index", {
            startingContent: startingContents,
            posts: foundData,
        });

    })


})



app.get("/about", function (req, res) {
    // res.sendFile(__dirname + "/Pages/about.html");
    res.render("about");
})


app.get("/contact", function (req, res) {
    res.render("contact");
})


app.get("/compose", function (req, res) {
    res.render("compose");



})

//Publish code
app.post("/", function (req, res) {


    const item = new Post({
        postName: req.body.titleName,
        postMassege: req.body.postMassege,
    });

    // console.log(item);

    Post.insertMany(item, function (err) {
        if (err) {
            console.log(err);
        } else {
            // console.log("Successfully added post to the data base");
        }
    })
    res.redirect("/");

})

app.get("/posts/:postId", function (req, res) {
    const requestedId = (req.params.postId);
    // lodash module _.lowerCase(string)
    //req.params for :postName

    // console.log(requestedId);

    Post.findById(requestedId , function (err, foundData) {
        if (err) {
            console.log(err);
        } else {
            // console.log("Finded Id Of post");
        }
        // console.log(foundData);
        res.render("posts", {
            postTitle: foundData.postName,
            postMassage: foundData.postMassege,
        });

    });


});



app.listen("3000", function () {
    console.log("Search localhost:3000 on browser");
});