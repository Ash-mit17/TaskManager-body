require('dotenv').config()
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const app=express()
const mongoose=require("mongoose")

mongoose.connect(process.env.id,{useNewUrlParser:true})

const Schema=new mongoose.Schema({
    body:{
        type:String,
        required:[],
        maxlength:[20,'should not be more than 20 words']
    }
})

const Items=new mongoose.model("item",Schema);

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

app.set("view engine","ejs")

app.get("/",function(req,res){
    Items.find({},{body:1,_id:1})
                    .sort({body:1})
                    .then((foundItems)=>{
                        // console.log(foundItems)
                        res.render("home",{dataArray:foundItems})})
                    .catch((err)=>{{
                        console.log(err)
                    }})
})

app.post("/",async function(req,res){
    let b=req.body.newentry;
    const item=new Items({
        body:b
    })
    var arr=await Items.find({},{body:1,_id:1})
    .then((foundItems)=>{
        // console.log(foundItems)
        return foundItems;
    })
    .catch((err)=>{{
        console.log(err)
    }})
    var flag=0;
    arr.forEach(element => {
        if(element.body===b)
        {
            flag=1;
        }
    });
    if(flag===0)
    {
        item.save();
        arr=arr.concat([{body:b}])
    }
    // res.render("home",{dataArray:arr});
    res.redirect("/");
})

app.post("/edit",(req,res)=>{
    var id=req.body.edit;
    Items.findOne({_id:id})
    .then((foundItems)=>{
        res.render("task",{id1:foundItems._id,name:foundItems.body})
    })
    .catch((err)=>{{
        console.log(err)
    }})
})

app.post("/update",async (req,res)=>{
    var name1=req.body.newname;
    var idnew=req.body.btnid;
    await Items.updateOne({_id:idnew},{$set:{body:name1}})
    res.redirect("/");
    
})

app.post("/delete",async (req,res)=>{
    var id=req.body.delete;
    console.log(id);
    await Items.deleteOne({_id:id})
    res.redirect("/");
})

app.listen(3000,function(req){
    console.log("Server running on port 3000")
})