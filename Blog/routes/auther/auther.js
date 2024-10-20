module.exports = (
    function () {
        const router = require("express").Router();
        const mongodb = require("mongodb");
        const client = mongodb.MongoClient;
        const objid=mongodb.ObjectId;
        let dbinstance;
        client.connect("mongodb://localhost:27017/").then((database) => {
            dbinstance = database.db("Blog");
            console.log("db connected")
        }).catch("db connection err");
        const multer=require("multer");
        const mstore=multer.diskStorage({
            destination:function (req,file,cb){
                cb(null,"./public");
            },
            filename:function (req,file,cb){
                cb(null,Date.now()+"-"+file.originalname);
            }
        })
        const filter=(req,file,cb)=>{
            let ext=file.mimetype.split("/")[1];
            if(ext=="jpg"||ext=="png"||ext=="jpeg")
                cb(null,true);
            else
                cb(new Error("ext does not match"),false)
        }
        const maxSize=1024*1024*10;
        const upload=multer({
            storage:mstore,
            filefilter:filter,
            limits:{
                size:maxSize
            }
        })

        router.get("/dashbord",(req,res)=>{
            dbinstance.collection("post").find({}).toArray().then((allpost)=>{
                res.render("./auther/dashbord",{data:allpost})
            })
           
        })
        router.get("/create",(req,res)=>{
            res.render("./auther/create")
        })
        router.post("/create",upload.single("pic"),(req,res)=>{
            console.log(req.file);
            let obj={
                title:req.body.title,
                pic:req.file.filename,
                desc:req.body.desc
            }
            dbinstance.collection("post").insertOne(obj).then((ack)=>{
                console.log(ack);
                res.redirect("/auther/dashbord")
            })
        })
        router.get("/read/:id",(req,res)=>{
            dbinstance.collection("post").findOne({_id:new objid(req.params.id)}).then((data)=>{
                console.log(data)
                res.render("./auther/read",{ele:data})
            })
        })
        router.get("/update/:id",(req,res)=>{
            dbinstance.collection("post").findOne({_id:new objid(req.params.id)}).then((data)=>{
                console.log(data)
                res.render("./auther/update",{ele:data})
            })
        })
        router.post("/update",upload.single("pic"),(req,res)=>{
            let updateObj={
                title:req.body.title,
                desc:req.body.desc
            }
            if(req.file){
                updateObj.pic=req.file.filename
            }else{
                updateObj.pic=req.body.oldpic
            }
            dbinstance.collection("post").updateOne({_id:new objid(req.body.id)},{$set:updateObj}).then((ack)=>{
                res.redirect("/auther/dashbord")
            })
        })
        router.get("/delete/:id",(req,res)=>{
            dbinstance.collection("post").findOne({_id:new objid(req.params.id)}).then((data)=>{
                res.render('./auther/delete',{ele:data})
            })
        })
        router.post("/delete/:id",(req,res)=>{
            dbinstance.collection("post").deleteOne({_id:new objid(req.params.id)}).then((ack)=>{
                console.log(ack)
                res.redirect("/auther/dashbord")
            })
        })

        return router;
    }
)();