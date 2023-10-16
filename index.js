const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');
require('dotenv').config()


const app = express()
const port=process.env.PORT||5000

// middlawer


app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t0d4q7e.mongodb.net/?retryWrites=true&w=majority`;




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {




  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollaction=client.db("coffeetDB").collection("coffee")
    const userCollection=client.db("userDB").collection("users")



    // Coffee CURD start
    app.get('/coffees',async(req,res)=>{
        const cursor=coffeeCollaction.find()
        const result = await cursor.toArray()
        res.send(result)
    })




    app.get('/coffees/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result=await coffeeCollaction.findOne(query)
        res.send(result)
    })



    app.post('/coffees',async(req,res)=>{
        const coffeeinfo=req.body
        const result=await coffeeCollaction.insertOne(coffeeinfo)
        res.send(result)
    })



    app.put(`/coffees/:id`,async(req,res)=>{
      const id=req.params.id
      const updateCoffee=req.body
      const updatedoc={
          
          $set:{
            name:updateCoffee.name,
            chef:updateCoffee.chef,
            supplir:updateCoffee.supplir,
            taste:updateCoffee.taste,
            category:updateCoffee.category,
            details:updateCoffee.details,
            photo:updateCoffee.photo
          }
        }
        const filter={_id: new ObjectId(id)}
        const options = { upsert: true };
        const result=await coffeeCollaction.updateOne(filter,updatedoc,options)
        res.send(result)
    })



    app.delete('/coffees/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result=await coffeeCollaction.deleteOne(query)
        res.send(result)
    })
    // Coffee CURD End......





    // User CURD Start.......
    app.get('/users',async(req,res)=>{
        const cursor=userCollection.find()
        const result=await cursor.toArray()
        res.send(result)
    })




    app.get('/users/:id',async(req,res)=>{
        const id=req.params.id
        const query= {_id: new ObjectId(id)}
        const resullt=await userCollection.findOne(query)
        res.send(resullt)
    })


    
    app.post('/users',async(req,res)=>{
       const user=req.body
       const result=await userCollection.insertOne(user)
       res.send(result)

    })

    app.put('/users/:id',async(req,res)=>{
        const id=req.params.id
        const filter={_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateUser=req.body
        const updateDoc={
          $set:{
            fristName:updateUser.fristName,
            lastName:updateUser.lastName,
            phone:updateUser.phone,
            email:updateUser.email,
            photo:updateUser.photo,
            password:updateUser.password,
            country:updateUser.country,
            confPassword:updateUser.confPassword
          }
        }
        const resullt=await userCollection.updateOne(filter,updateDoc,options)
        res.send(resullt)
    })



    app.delete('/users/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result=await userCollection.deleteOne(query)
        res.send(result)


    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("surver comming data")
})

app.listen(port,()=>{
    console.log("server running",port);
})