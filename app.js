var express               = require("express"),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
require('dotenv').config()

app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost/Vikas",{useNewUrlParser: true,useUnifiedTopology: true});
mongoose.set('useCreateIndex', true);

//Authentication Setup
app.use(require("express-session")({
    secret:"Beauty",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function isLoggedIN(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//!--Database setup--!//
var surveySchema = mongoose.Schema({
    name : String,
    reward : {type:Number,default:0},
    aadhar : Number,
    address : String,
    water : { type:[String], default :undefined },
    electricity : { type:[String], default :undefined },    
    clealiness : { type: [String], default :undefined },
    perCapitaIncome : { type : Number, default :undefined }     
})

var Survey = mongoose.model("Survey", surveySchema);
var seeds = [
    {
        name : "Gaurav Sharma",
        aadhar : 733315786480,
        ans : ['a','b','c','d']
    },
    {
        name : "Upanshu Kumar",
        aadhar : 3546515473546,
        ans : ['g','h','i','j']
    },
    {
        name : "Neeraj Singh",
        aadhar : 54357463546841,
        ans : ['p','q','r','s','t','y']
    }
];

Survey.deleteMany({},function(err){
    if(err){
        console.log(err);
    }
})

/*seeds.forEach(function(seed){    
    Survey.create(seed,function(err,result){
        if(err){
            console.log(err);
        }
        else{
            console.log("1 survey result added in database");
        }
    })
})*/
//=======================================

var categories = ["Water Availability", "Electricity", "Cleanliness", "Per-Capita Income"];

app.get("/",function(req,res){
    res.render("landing")
});

app.get("/landing",function(req,res){
    res.render("landing")
});

app.get("/index",function(req,res){
    res.render("index",{categories:categories});
});

app.get("/account",function(req,res){
    if(req.isAuthenticated()){
        res.render("account")
    }
    else{
        res.redirect("login") 
    }   
});

//Render Register Page
app.get("/register",function(req,res){
    res.render("register")
});

//New User Creation
app.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/login");
       });
    });
});

//Render Login Page
app.get("/login",function(req,res){
    res.render("login");
});

//Login logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/account",
    failureRedirect:"/login"
}),function(req,res){

});


// Create Survey nodes 
app.post("/water/survey",function(req,res){
    var count = Object.keys(req.body).length;
    var name = req.body.name;
    var aadhar = req.body.aadhar;   
    var water = [req.body.one, req.body.two, req.body.three, req.body.four];
    obj = {name : name, aadhar : aadhar, water : water};
    Survey.create(obj,function(err,newobj){
        if(err){
            console.log(err)
        }        
        else{
            console.log(newobj);
        }        
    })
    res.redirect("/account");
})

//Logout Logic
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/login");
})

app.get("/analysis",function(req,res){
    res.render("analysis");
});

app.get("*",function(req,res){
    res.send("EROR 404!!")
});

const port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Server Started");
});