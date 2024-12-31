const Entry = require("../models/Entry")

module.exports = {
  getIndex: async (req, res) => {
    try {
      const allEntries = await Entry.find()
      res.render("index.ejs", { entries: allEntries })
    } catch (err) {
      console.log(err)
    }
  },
  addEntry: async (req, res) => {
    try {
      await Entry.create({
        date: req.body.date,
        commonName: req.body.commonName,
        latinName: req.body.latinName,
        observations: req.body.observations,
        image: req.body.image,
        reference: req.body.reference,
      })
      console.log("Entry has been added")
      res.redirect("/")
    } catch (err) {
      console.log(err)
    }
  },
  deleteEntry: async (req, res) => {
    try {
      await Entry.findOneAndDelete({_id: req.body.idFromClientJs})
      console.log('Deleted Entry')
      res.json('Deleted It')
    } catch (err) {
      console.log(err)
    }
  },
  likeEntry: async (req, res) => {
    try {
      await Entry.findOneAndUpdate({_id: req.body.idFromClientJs}, { $inc: { likes: 1 } } )
      console.log('Liked Entry')
      res.json('Liked It')
    } catch (err) {
      console.log(err)
    }
  },
}
