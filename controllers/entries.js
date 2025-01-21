const mongoose = require("mongoose")
const cloudinary = require("../middleware/cloudinary")
const Entry = require("../models/Entry")
const User = require("../models/User")

module.exports = {
  getAllUserEntries: async (req, res) => {
    try {
      const allUserEntries = await Entry.find({ userId: req.params.id }).populate("userId", "userName")
        .sort({ date: "desc" })
        .lean()
      const isAuthenticated = req.isAuthenticated()
      res.render("userEntries.ejs", {
        entries: allUserEntries,
        isAuthenticated: isAuthenticated,
        loggedInUser: req.user
      })
    } catch (err) {
      console.log(err)
    }
  },
  getEntry: async (req, res) => {
    try {
      const entry = await Entry.findById(req.params.id).populate("userId")
      const isAuthenticated = req.isAuthenticated()

      res.render("entry.ejs", {
        entry: entry,
        loggedInUser: req.user,
        isAuthenticated: isAuthenticated,
      })
    } catch (err) {
      console.log(err)
    }
  },
  getEntryForm: (req, res) => {
    console.log("inside function")
    const isAuthenticated = req.isAuthenticated()
    res.render("entryForm.ejs", {
      title: "Add New Entry",
      isAuthenticated: isAuthenticated,
      loggedInUser: req.user
    })
  },
  addEntry: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bird-app",
      })
      await Entry.create({
        date: req.body.date,
        commonName: req.body.commonName,
        latinName: req.body.latinName,
        observations: req.body.observations,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        reference: req.body.reference,
        userId: req.user.id,
      })
      console.log("Entry has been added")
      res.redirect("/entries")
    } catch (err) {
      console.log(err)
    }
  },
  getEditEntryForm: async (req, res) => {
    // Find Entry by id
    let entry = await Entry.findById(req.params.id)
    const isAuthenticated = req.isAuthenticated()

    if (!entry) {
      req.flash("errors", { msg: "Entry not found." })
      return res.redirect("/entries")
    }
    res.render("editEntry.ejs", {
      entry: entry,
      isAuthenticated: isAuthenticated,
      loggedInUser: req.user
    })
  },
  editEntry: async (req, res) => {
    try {
      // Find Entry by id
      let entry = await Entry.findById(req.params.id)

      if (!entry) {
        req.flash("errors", { msg: "Entry not found." })
        return res.redirect("/entries")
      }

      // Delete image from Cloudinary
      // await cloudinary.uploader.destroy(entry.cloudinaryId);

      await Entry.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })
      console.log("Updated Entry")
      res.redirect("/entries/" + req.params.id)
    } catch (err) {
      console.log(err)
    }
  },
  deleteEntry: async (req, res) => {
    try {
      // Find Entry by id
      let entry = await Entry.findById(req.params.id)
      if (!entry) {
        req.flash("errors", { msg: "Entry not found." })
        return res.redirect("/entries")
      }

      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(entry.cloudinaryId)

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
      res.redirect(req.get("referer"))
    } catch (err) {
      console.log(err)
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      const userEntries = await Entry.find({ userId: req.params.id })
        .sort({ date: "desc" })
        .lean()
      const isAuthenticated = req.isAuthenticated()
      res.render("user.ejs", {
        user: user,
        loggedInUser: req.user,
        entries: userEntries,
        isAuthenticated: isAuthenticated,
      })
    } catch (err) {
      console.log(err)
    }
  },
  getEditUserForm: async (req, res) => {
    // Find User by id
    let user = await User.findById(req.params.id)
    const isAuthenticated = req.isAuthenticated()
    console.log("user", user)

    if (!user) {
      req.flash("errors", { msg: "User not found." })
      return res.redirect("/entries")
    }
    res.render("editUser.ejs", { loggedInUser: user, isAuthenticated: isAuthenticated })
  },
  editUser: async (req, res) => {
    try {
      // Find User by id
      let user = await User.findById(req.params.id)

      if (!user) {
        req.flash("errors", { msg: "User not found." })
        return res.redirect("/entries")
      }

      let updateData = { ...req.body }

      if (req.file) {
        // Delete image from Cloudinary
        if(user.cloudinaryId) {
          await cloudinary.uploader.destroy(user.cloudinaryId)
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "bird-app/profile-photos",
        })
        updateData.cloudinaryId = result.public_id
        updateData.image = result.secure_url
      }

      await User.findOneAndUpdate({ _id: req.params.id }, updateData, {
        new: true,
        runValidators: true,
      })
      console.log("Updated User")
      res.redirect("/entries/user/" + req.params.id)
    } catch (err) {
      console.log(err)
      req.flash("errors", { msg: "An error occurred while updating the user." })
      res.redirect("/entries")
    }
  },
}
