const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const cookie = require("cookie-parser");
const mongodb = require("mongodb");
const client = mongodb.MongoClient;
app.use(cookie());
app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: "Ankan",
    cookie: {
        maxAge: 60 * 60 * 24 * 1000
    }
}))
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");

let dbinstance;
client.connect("mongodb+srv://ankan108:Ankan2004@cluster0.ypzdcal.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then((database)=>{
    dbinstance=database.db("Blog");
    console.log("db connected")
}).catch("db connection err");


const authRoute=require("./routes/auth/login.js");
const adminRoute=require("./routes/admin/admin.js")
const autherRoute=require("./routes/auther/auther.js")

app.get("/",(req,res)=>{
    res.render("home");
})

function userAuth(req,res,next){
    if(req.session && req.session.user)
        next()
    else
        res.redirect("/auth/login")
}
function autherAuth(req,res,next){
    if(req.session.user.role=="auther")
        next()
    else
        res.redirect("/")
}
function adminAuth(req,res,next){
    if(req.session.user.role=="admin")
        next()
    else
        res.redirect("/")
}
app.use("/auth",authRoute);
app.use("/admin",userAuth,adminAuth,adminRoute);
app.use("/auther",userAuth,autherAuth,autherRoute);

app.listen(3000, () => {
    console.log("server st at 3000");
})