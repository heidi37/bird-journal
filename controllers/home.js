const Entry = require("../models/Entry")

module.exports = {
  getIndex: async (req, res) => {
    try {
      const allEntries = await Entry.find().populate('userId', 'userName').sort({ date: "desc"}).lean();
      const isAuthenticated = req.isAuthenticated()
      res.render("index.ejs", { entries: allEntries, isAuthenticated: isAuthenticated })
    } catch (err) {
      console.log(err)
    }
  }
}