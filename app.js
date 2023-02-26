require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const bcrypt = require("bcrypt");
const saltRound = 10;


const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

// Users' Schema:
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRound, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash,
        });

        newUser.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.render("secrets")
            }
        })
    })
});

app.post("/login", function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({ email: userName }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else if (foundUser) {
            // compared hashed passwords with the typed password
            bcrypt.compare(password, foundUser.password, function(err, results){
                if (results === true){
                    res.render("secrets");
                } else {
                    res.send("Login credentials not found!")
                }
            })
        }
    });
});



app.listen(3000, function () {

    console.log("server is running on port 3000...")

});

