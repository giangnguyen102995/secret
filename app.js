require("dotenv").config();
const express = require("express");	
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const encrypt = require("mongoose-encryption")

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));  
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// Users' Schema:
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//using the convenient way to use 1 key to encrypt instead of 2
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});


const User = new mongoose.model("User", userSchema);



app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });

    newUser.save(function(err){
        if (err){
            console.log(err);
        } else {
            res.render("secrets")
        }
    })
});

app.post("/login", function(req, res){
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName}, function(err, foundUser){
        if (err){
            console.log(err);
        } else if(foundUser){
            // we have to use .password to encrypt the search to match the encrypted one
            if (foundUser.password === password){
                res.render("secrets");
            }
        }
    });
});


app.listen(3000, function(){

    console.log("server is running on port 3000...")

});