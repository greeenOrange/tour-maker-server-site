const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yoxzf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run (){
    try{
        await client.connect();
        const database = client.db('amazing_tour')
        const serviceCollection = database.collection('services');
        const orderCollection = database.collection('order')
        
        //GET Services
        app.get('/services', async(req,res) =>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });


// POST  API 
app.post('/order', async(req, res) =>{
    console.log(req.body);
    const order = req.body
    const result = await orderCollection.insertOne(order)
    console.log(result);
    res.send(result)
  })

  //GET Order APi
  app.get('/order', async(req, res)=>{
    let query = {};
    console.log(query);
    const email = req.query.email;
    if(email){
        query={email:email};
    }
    const cursor = orderCollection.find(query)
    const order = await cursor.toArray()
    res.send(order)
  })

        //GET single Service
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('right id',id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });

        app.get('/order/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('right id',id);
            const query = {_id: ObjectId(id)};
            const package = {
                $set:{
                    status: 'confirm'
                }
            }
        });

        // POST API
        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log('hit the api', service);
            const result = await serviceCollection.insertOne(service)
            res.json(result)
        });

        
        // //DELETE API
        // app.delete('/order/:id', async(req, res)=>{
        //     const id = req.params.id;
        //     const query = {_id:ObjectId(id)};
        //     const result = await serviceCollection.deleteOne(query);
        //     res.json(result)
        // });

        //delete order api
    // app.delete('/order/:id', async(req, res)=>{
    //     const id = req.params.id;
    //     console.log("Delete user With", id);
    //     const query = {_id: ObjectId(id)}
    //     const result = await orderCollection.deleteOne(query)
    //     console.log(result);
    //     res.send(result);
    //   })
    // DELETE API
    app.delete('/order/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await orderCollection.deleteOne(query);

        console.log('deleting user with id ', result);

        res.json(result);
    })


    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('tour maker server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})