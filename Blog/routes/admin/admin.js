module.exports = (
    function () {
        const router = require("express").Router();
        const mongodb = require("mongodb");
        const client = mongodb.MongoClient;
        let dbinstance;
        client.connect("mongodb://localhost:27017/").then((database) => {
            dbinstance = database.db("Blog");
            console.log("db connected")
        }).catch("db connection err");

        router.get("/dashbord",(req,res)=>{
            res.render("./admin/dashbord")
        })


        return router;
    }
)();