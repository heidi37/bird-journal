const express = require("express")
const app = express()
const connectDB = require('./config/database')
const entryRoutes = require('./routes/entries')
const PORT = process.env.PORT || 3000

require('dotenv').config({ path: './config/.env' })

connectDB()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/", entryRoutes)
app.use("/addEntry", entryRoutes)
app.use("/deleteEntry", entryRoutes)
app.use("/likeEntry", entryRoutes)


app.listen(PORT, function () {
  console.log(`listening on ${PORT}`)
})
