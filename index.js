const express = require("express");
const cors = require("cors")
const app = express();
const port = 3000;
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config()
const URL = process.env.URL
const DB = "node-mongo-connect";


const users = []
//middleware
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3001"
}))

app.get('/home', function (req, res) {
    
    res.json({ message: "Success...." });
});

app.get('/about', function (req, res) {
    res.json({ message: "About...." })
})

app.post("/user", async function (req, res) {

   try{
    const connection = await mongoClient.connect(URL)
    const db = connection.db(DB)
    await db.collection("users").insertOne(req.body)
    await connection.close()
    res.status(200).json({message:"Data Inserted"})
   }
   catch(error){
    console.log(error)
    res.status(500).json({message:"Something went wrong"})
   }
    
})

app.get('/users', async function (req, res) {
    
    try{
        const connection = await mongoClient.connect(URL)
        const db = connection.db(DB)
      let user = await db.collection("users").find().toArray()
        await connection.close()
        // res.status(200).json({message:"Got data "})
        res.json(user)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
       }

    res.json(users)
})

app.get("/user/:id", async function (req, res) {
    try{
        const connection = await mongoClient.connect(URL)
        const db = connection.db(DB)
      let resUser = await db.collection("users").findOne({_id: new mongodb.ObjectId(req.params.id)})
        await connection.close()
        
        res.json(resUser)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
       }
})

app.put("/user/:id",async function (req, res) {
    try{
        const connection = await mongoClient.connect(URL)
        const db = connection.db(DB)
      let resUser = await db.collection("users").findOneAndUpdate({_id: new mongodb.ObjectId(req.params.id)},{$set:req.body})
        await connection.close()
        res.json(resUser)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
       }
})
app.delete('/user/:id',async function (req, res) {
    try{
        const connection = await mongoClient.connect(URL)
        const db = connection.db(DB)
      let resUser = await db.collection("users").findOneAndDelete({_id: new mongodb.ObjectId(req.params.id)})
        await connection.close()
        res.json(resUser)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
       }
})

app.listen(port,() => {
    console.log(`Server running at ${port}`);
  });