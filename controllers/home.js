const Entry = require("../models/Entry")
const User = require("../models/User")


module.exports = {
  getIndex: async (req, res, next) => {
    try {
      const viewFunction ="getIndex"
      const allEntries = await Entry.find().sort({ date: "desc"}).populate("userId", "userName image").lean();
      const isAuthenticated = req.isAuthenticated()
      res.render("index.ejs", { entries: allEntries, isAuthenticated: isAuthenticated, loggedInUser: req.user, view: viewFunction })
    } catch (error) {
      next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const viewFunction = "getUsers"
      const allUsers = await User.find().sort({ date: "desc"}).lean();
      const isAuthenticated = req.isAuthenticated()
      res.render("users.ejs", { users: allUsers, isAuthenticated: isAuthenticated, loggedInUser: req.user, view: viewFunction })
    } catch (error) {
      next(error)
    }
  }
}