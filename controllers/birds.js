const Bird = require("../models/Bird")

module.exports = {
  getIndex: async (req, res) => {
    try {
      const birds = await Bird.find()
      res.render("index.ejs", { entries: birds })
    } catch (err) {
      console.log(err)
    }
  },
  addBird: async (req, res) => {
    try {
      await Bird.create({
        date: req.body.date,
        commonName: req.body.commonName,
        latinName: req.body.latinName,
        observations: req.body.observations,
        image: req.body.image,
        reference: req.body.reference,
      })
      console.log("Bird has been added")
      res.redirect("/")
    } catch (err) {
      console.log(err)
    }
  },
  deleteBird: async (req, res) => {
    try {
      await Bird.findOneAndDelete({_id: req.body.idFromClientJs})
      console.log('Deleted Bird')
      res.json('Deleted It')
    } catch (err) {
      console.log(err)
    }
  },
  likeBird: async (req, res) => {
    try {
      await Bird.findOneAndUpdate({_id: req.body.idFromClientJs}, { $inc: { likes: 1 } } )
      console.log('Liked Bird')
      res.json('Liked It')
    } catch (err) {
      console.log(err)
    }
  },
}
