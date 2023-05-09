const express = require("express");
const cors = require("cors")
const app = express();
const port = 3000;
const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config()
const URL = process.env.URL
const DB = "node-mongo-connect";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")


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

// app.post("/product", async function (req, res) {

//    try{
//     const connection = await mongoClient.connect(URL)
//     const db = connection.db(DB)
//     await db.collection("products").insertOne(req.body)
//     await connection.close()
//     res.status(200).json({message:"Data Inserted"})
//    }
//    catch(error){
//     console.log(error)
//     res.status(500).json({message:"Something went wrong"})
//    }
    
// })

// app.get('/products', async function (req, res) {
    
//     try{
//         const connection = await mongoClient.connect(URL)
//         const db = connection.db(DB)
//       let user = await db.collection("products").find().toArray()
//         await connection.close()
//         // res.status(200).json({message:"Got data "})
//         res.json(user)
//     }
//     catch(error){
//         console.log(error)
//         res.status(500).json({message:"Something went wrong"})
//        }

//     res.json(users)
// })

// app.get("/product/:id", async function (req, res) {
//     try{
//         const connection = await mongoClient.connect(URL)
//         const db = connection.db(DB)
//       let resUser = await db.collection("products").findOne({_id: new mongodb.ObjectId(req.params.id)})
//         await connection.close()
        
//         res.json(resUser)
//     }
//     catch(error){
//         console.log(error)
//         res.status(500).json({message:"Something went wrong"})
//        }
// })

// app.put("/product/:id",async function (req, res) {
//     try{
//         const connection = await mongoClient.connect(URL)
//         const db = connection.db(DB)
//       let resUser = await db.collection("products").findOneAndUpdate({_id: new mongodb.ObjectId(req.params.id)},{$set:req.body})
//         await connection.close()
//         res.json(resUser)
//     }
//     catch(error){
//         console.log(error)
//         res.status(500).json({message:"Something went wrong"})
//        }
// })
// app.delete('/product/:id',async function (req, res) {
//     try{
//         const connection = await mongoClient.connect(URL)
//         const db = connection.db(DB)
//       let resUser = await db.collection("products").findOneAndDelete({_id: new mongodb.ObjectId(req.params.id)})
//         await connection.close()
//         res.json(resUser)
//     }
//     catch(error){
//         console.log(error)
//         res.status(500).json({message:"Something went wrong"})
//        }
// })

app.post("/user", async function (req, res) {

       try{
        const connection = await mongoClient.connect(URL)
        const db = connection.db(DB)
        await db.collection("users-info").insertOne(req.body)
        await connection.close()
        res.status(200).json({message:"Data Inserted"})
       }
       catch(error){
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
       }
        
    })

    
    let authenticate = function(req,res,next){
        console.log(req.headers)
        if(req.headers.authorization){
            try{
                const decode = jwt.verify(req.headers.authorization,process.env.SECRET)
                if(decode){
                    next()
                }
            }
            catch(error){
                res.status(401).json({message:"Unauthorized"})
            }
        }else{
            res.status(401).json({message:"Unauthorized"})
        }
        
    }
    app.get('/users',authenticate, async function (req, res) {
    
            try{
                const connection = await mongoClient.connect(URL)
                const db = connection.db(DB)
              let user = await db.collection("users-info").find().toArray()
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
      let resUser = await db.collection("users-info").findOne({_id: new mongodb.ObjectId(req.params.id)})
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
      let resUser = await db.collection("users-info").findOneAndUpdate({_id: new mongodb.ObjectId(req.params.id)},{$set:req.body})
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
      let resUser = await db.collection("users-info").findOneAndDelete({_id: new mongodb.ObjectId(req.params.id)})
        await connection.close()
        res.json(resUser)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
       }
})


app.post("/register", async function(req,res){
    try{
        const connection = await mongoClient.connect(URL)
        const db = connection.db(DB)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password,salt)
        console.log(hash)
        req.body.password = hash
        await db.collection("users-info").insertOne(req.body);
        await connection.close()
        res.json({message:"user registered successfully"})
    }
    catch(error){

    }
})

app.post('/login',async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const user = await db.collection('users-info').findOne({email:req.body.email});
        if (user) {
            const compare = await bcrypt.compare(req.body.password,user.password);
            if (compare) {
                const token = jwt.sign({_id:user._id},process.env.SECRET,{expiresIn:"10m"})
                console.log(token)
                res.json({token})

            } else {
                res.json({message:"Enter correct Email/Password"})
            }
        } else {
            res.status(401).json({message:"Email/password not found"})
        }
        await connection.close();
    } catch (error) {
        res.status(500).json({message:"Something Went Wrong"})
    }
})

app.listen(port,() => {
    console.log(`Server running at ${port}`);
  });