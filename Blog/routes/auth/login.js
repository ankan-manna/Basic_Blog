const express=require("express");
const router=express.Router();
const mongodb = require("mongodb");
const client = mongodb.MongoClient;
let dbinstance;
client.connect("mongodb://localhost:27017/").then((database)=>{
    dbinstance=database.db("Blog");
    console.log("db connected")
}).catch("db connection err");

router.get("/login",(req,res)=>{
    res.render("login");
})
router.post("/login",(req,res)=>{
    dbinstance.collection("user").find({$and:[{username:req.body.username},{password:req.body.password}]}).toArray().then((user)=>{
        console.log(user)
        if(user.length){
            req.session.user=user[0];
            if(user[0].role=="admin")
                res.redirect("/admin/dashbord")
                //res.render("./admin/dashbord")
            else if(user[0].role=="auther")
                res.redirect("/auther/dashbord")
                //res.render("./auther/dashbord")
            else
                res.redirect("/")
        }
        else
            res.redirect("/auth/login")
    })
})
module.exports=router