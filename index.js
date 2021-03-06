const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfpqs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  if(err){
    console.log(err)
  }
  const collection = client.db("volunteer-network").collection("events")
  app.post("/addEventDatabase", (req, res) => {
    const newEvents = req.body;
    collection.insertOne(newEvents)
    .then(result => {
      console.log('insertedCount ',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.get("/events", (req, res) => {
    collection.find({})
    .toArray((err, items) => {
      
      res.send(items)
    })
  })

});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || 5000)