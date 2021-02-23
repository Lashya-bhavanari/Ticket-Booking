const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");



const app=express();


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));


mongoose.connect("mongodb://localhost:27017/passengerDB",{useNewUrlParser:true});


const passengerSchema = new mongoose.Schema({
    email:String,
    password:String
});

const secret = "ThisArePassengersDetails.";
passengerSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });


const Passenger = new mongoose.model("Passenger", passengerSchema);


app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newPassenger = new Passenger({
        email:req.body.username,
        password:req.body.password
    });
    newPassenger.save(function(err){
        if(err){
            console.log(err);
        } else{
            res.render("booking");
        }
    });
});


app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    Passenger.findOne({email:username},function(err,foundPassenger){
        if(err){
            console.log(err);
        } else{
            if(foundPassenger){
                if(foundPassenger.password === password){
                    res.render("booking");
                }
            }
        }
    });
});








app.listen(3000,function(){
    console.log("Server started on port 3000.");
});