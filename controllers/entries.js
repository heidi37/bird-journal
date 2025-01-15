const mongoose = require('mongoose')
const Entry = require("../models/Entry")

module.exports = {
  getEntries: async (req, res) => {
    try {
      const allEntries = await Entry.find({ userId: req.user._id }).populate(
        "userId",
        "userName"
      ).sort({ date: "desc"}).lean()
      //console.log("Fetched entries:", allEntries)
      res.render("entries.ejs", { entries: allEntries })
    } catch (err) {
      console.log(err)
    }
  },
  getEntry: async (req, res) => {
    try {
      const entry = await Entry.findById(req.params.id).populate("userId")

      res.render("entry.ejs", { entry: entry, user: req.user })
    } catch (err) {
      console.log(err)
    }
  },
  getEntryForm: (req, res) => {
    console.log("inside function")
    res.render("entryForm.ejs", {
      title: "Add New Entry"
    })
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
        userId: req.user.id,
      })
      console.log("Entry has been added")
      res.redirect("/entries")
    } catch (err) {
      console.log(err)
    }
  },
  deleteEntry: async (req, res) => {
    try {
      await Entry.findOneAndDelete({ _id: req.params.id })
      console.log("Deleted Entry")
      res.redirect("/entries")
    } catch (err) {
      console.log(err)
    }
  },
  likeEntry: async (req, res) => {
    try {
      await Entry.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { likes: 1 } }
      )
      console.log("Liked Entry")
      res.redirect(req.get('referer'));
    } catch (err) {
      console.log(err)
    }
  },
}
