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
        app.get('/order', async(req,res) =>{
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order)
        });
        //GET single Service
        app.get('/services/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('right id',id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        });

        // POST API
        app.post('/services', async(req, res)=>{
            const service = req.body;
            console.log('hit the api', service);
            const result = await serviceCollection.insertOne(service)
            res.json(result)
        });
        app.post('/order', async(req, res)=>{
            const order = req.body;
            console.log('hit the order', order);
            const result = await orderCollection.insertOne(order)
            res.json(result)
        });
        
        //DELETE API
        app.delete('/services/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result)
        })
        app.delete('/order/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result)
        })

        app.get("/myEvents/:email", async (req, res) => {
            const result = await EventsCollection.find({
              email: req.params.email,
            }).toArray();
            res.send(result);
          });

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