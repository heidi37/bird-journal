const Entry = require("../models/Entry")

module.exports = {
  getIndex: async (req, res) => {
    try {
      const allEntries = await Entry.find().sort({ date: "desc"}).lean();
      const isAuthenticated = req.isAuthenticated()
      res.render("index.ejs", { entries: allEntries, isAuthenticated: isAuthenticated, user: req.user })
    } catch (err) {
      console.log(err)
    }
  }
}