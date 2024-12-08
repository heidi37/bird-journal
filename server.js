const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
require('dotenv').config();

const PORT = 3000
const DB_STRING = process.env.DB_STRING
const dbName = "nature-journal"

MongoClient.connect(DB_STRING).then((client) => {
  console.log(`Connected to ${dbName} Database`)
  const db = client.db(dbName)
  const entriesCollection = db.collection('entries')

  app.set('view engine', 'ejs')

  app.use(express.static('public'))
  //for reading data from the form (middleware)
  //extract data from the form element and add thm to the body property in the request object
  app.use(express.urlencoded({ extended: true }))
  //Tell server to accept JSON data
  app.use(express.json())
  
  app.get('/', (req, res) => {
    entriesCollection.find().sort({date: 1}).toArray()
    .then(results => {
      res.render('index.ejs', {entries: results})
    })
    .catch(error => console.error(error))
  })
  
  app.post('/addEntry', (req, res) => {
    req.body.likes = 0;
    entriesCollection
      .insertOne(req.body)
      .then(result => {
        console.log(result)
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })

  app.put('/addOneLike', (req, res) => {
    entriesCollection.updateOne({commonName: req.body.commonNameS, date: req.body.dateS, likes: req.body.likesS},{
        $set: {
          likes:req.body.likesS + 1
        }
      },{
        sort: {_id: -1},
        upsert: false
      })
      .then(result => {
        console.log('Added One Like')
        res.json('Like Added')
      }).catch(error => console.log(error))
    })

  app.delete('/deleteEntry', (req, res) => {
    entriesCollection.deleteOne({commonName: req.body.commonNameS})
    .then(result => {
      console.log('Entry Deleted')
      res.json('Entry Deleted')
    }).catch(error => console.error(error))
  })
})

  app.listen(process.env.PORT || PORT, function() {
    console.log('listening on 3000')
  })
  
