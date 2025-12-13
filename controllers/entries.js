const mongoose = require("mongoose")
const cloudinary = require("../middleware/cloudinary")
const nodeFetch = require("node-fetch")
const fetch = nodeFetch.default || nodeFetch

const Entry = require("../models/Entry")
const User = require("../models/User")
const { Buffer } = require("buffer")

const { GoogleGenerativeAI } = require("@google/generative-ai")

console.log(
  "DIAGNOSTIC: GEMINI_API_KEY value:",
  process.env.GEMINI_API_KEY ? "Loaded" : "UNDEFINED/EMPTY"
)

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const MAX_RETRIES = 2

// ---------------- CONTROLLER FUNCTIONS ---------------- //

async function getAllUserEntries(req, res, next) {
  try {
    const allUserEntries = await Entry.find({ userId: req.params.id })
      .populate("userId", "userName")
      .sort({ date: "desc" })
      .lean()

    res.render("userEntries.ejs", {
      entries: allUserEntries,
      isAuthenticated: req.isAuthenticated(),
      loggedInUser: req.user,
      requestedUser: req.params.id,
      view: "allUserEntries",
    })
  } catch (err) {
    next(err)
  }
}

async function getEntry(req, res, next) {
  try {
    const entry = await Entry.findById(req.params.id).populate("userId")
    res.render("entry.ejs", {
      entry,
      loggedInUser: req.user,
      isAuthenticated: req.isAuthenticated(),
      view: "getEntry",
    })
  } catch (err) {
    next(err)
  }
}

function getEntryForm(req, res) {
  res.render("entryForm.ejs", {
    title: "Add New Entry",
    isAuthenticated: req.isAuthenticated(),
    loggedInUser: req.user,
    view: "getEntryForm",
  })
}

async function analyze(req, res) {
  try {
    const { imageUrl } = req.body
    if (!imageUrl) return res.status(400).json({ error: "Missing imageUrl" })

    let newImageUrl = imageUrl
    const uploadIndex = imageUrl.indexOf("/upload/")
    if (uploadIndex !== -1) {
      newImageUrl =
        imageUrl.substring(0, uploadIndex + 8) +
        "c_limit,w_500/" +
        imageUrl.substring(uploadIndex + 8)
    }

    const response = await fetch(newImageUrl)
    if (!response.ok) return res.status(400).json({ error: "Image fetch failed" })

    const contentType = response.headers.get("Content-Type")
    const buffer = Buffer.from(await response.arrayBuffer()).toString("base64")

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    let aiResponse
    for (let i = 0; i < MAX_RETRIES; i++) {
      aiResponse = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Identify the bird in the image. Respond ONLY with a JSON object containing commonName, latinName, and funFact.",
              },
              {
                inlineData: {
                  mimeType: contentType,
                  data: buffer,
                },
              },
            ],
          },
        ],
      })
      const text = aiResponse?.response?.text?.()
      if (text) break
      await delay(1000)
    }

    const text = aiResponse?.response?.text?.()
    if (!text) return res.status(500).json({ error: "No AI response" })

    const cleaned = text.replace(/```json|```/g, "").trim()
    res.json(JSON.parse(cleaned))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Analyze failed" })
  }
}

async function addEntry(req, res, next) {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "bird-app",
      transformation: [{ width: 800, crop: "limit" }],
    })

    const formattedName = req.body.commonName ? req.body.commonName.replace(/\s+/g, "_") : ""
    const defaultGuideUrl = formattedName
      ? `https://www.allaboutbirds.org/guide/${formattedName}`
      : "https://www.allaboutbirds.org/guide/"
    const reference = req.body.reference?.trim() || defaultGuideUrl

    await Entry.create({
      date: req.body.date,
      commonName: req.body.commonName,
      image: result.secure_url,
      cloudinaryId: result.public_id,
      userId: req.user.id,
      reference,
      funFact: req.body.funFact,
      ...(req.body.latinName && { latinName: req.body.latinName }),
      ...(req.body.observations && { observations: req.body.observations }),
    })

    res.redirect("/entries/allUser/" + req.user.id)
  } catch (err) {
    console.error("Error adding entry:", err)
    next(err)
  }
}

async function getEditEntryForm(req, res) {
  const entry = await Entry.findById(req.params.id)
  if (!entry) return res.redirect("/entries")

  res.render("editEntry.ejs", {
    entry,
    isAuthenticated: req.isAuthenticated(),
    loggedInUser: req.user,
    view: "getEditEntryForm",
  })
}

async function editEntry(req, res) {
  await Entry.findByIdAndUpdate(req.params.id, req.body)
  res.redirect("/entries/" + req.params.id)
}

async function deleteEntry(req, res) {
  const entry = await Entry.findById(req.params.id)
  if (entry?.cloudinaryId) await cloudinary.uploader.destroy(entry.cloudinaryId)
  await Entry.findByIdAndDelete(req.params.id)
  res.redirect("/entries/allUser/" + req.user._id)
}

async function likeEntry(req, res) {
  const entry = await Entry.findById(req.params.id)
  const userId = req.user._id
  const index = entry.likes.findIndex((id) => id.equals(userId))
  if (index === -1) entry.likes.push(userId)
  else entry.likes.splice(index, 1)
  await entry.save()
  res.redirect("back")
}

async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
    const userEntries = await Entry.find({ userId: req.params.id }).sort({ date: "desc" }).lean()

    res.render("user.ejs", {
      user,
      entries: userEntries,
      isAuthenticated: req.isAuthenticated(),
      loggedInUser: req.user,
      view: "getUser",
    })
  } catch (err) {
    console.error("Error in getUser:", err)
    next(err)
  }
}

async function getEditUserForm(req, res) {
  try {
    const user = await User.findById(req.params.id) // profile being viewed
    if (!user) {
      req.flash("errors", { msg: "User not found." })
      return res.redirect("/entries")
    }

    res.render("editUser.ejs", {
      user,                   // profile being viewed
      loggedInUser: req.user, // the actual logged-in user
      isAuthenticated: req.isAuthenticated(),
      view: "getEditUserForm",
    })
  } catch (err) {
    console.error("Error in getEditUserForm:", err)
    res.redirect("/entries")
  }
}


async function editUser(req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.redirect("/entries") // fallback if user not found

    let updateData = { ...req.body }

    // Handle new profile image if uploaded
    if (req.file) {
      // Delete previous image if exists
      if (user.cloudinaryId) {
        await cloudinary.uploader.destroy(user.cloudinaryId)
      }

      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "bird-app/profile-photos",
        transformation: [{ width: 500, crop: "limit" }],
      })

      // Update image fields
      updateData.cloudinaryId = result.public_id
      updateData.image = result.secure_url
    }

    // Save updates
    await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })

    res.redirect("/entries/user/" + req.params.id)
  } catch (err) {
    console.error("Error updating user:", err)
    res.status(500).send("Failed to update user")
  }
}

module.exports = {
  getAllUserEntries,
  getEntry,
  getEntryForm,
  analyze,
  addEntry,
  getEditEntryForm,
  editEntry,
  deleteEntry,
  likeEntry,
  getUser,
  getEditUserForm,
  editUser,
}
