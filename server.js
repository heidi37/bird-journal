const express = require("express")
const app = express()
const connectDB = require('./config/database')
const birdRoutes = require('./routes/birds')
const PORT = process.env.PORT || 3000

require('dotenv').config({ path: './config/.env' })

connectDB()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use("/", birdRoutes)
app.use("/addBird", birdRoutes)
app.use("/deleteBird", birdRoutes)
app.use("/likeBird", birdRoutes)


app.listen(PORT, function () {
  console.log(`listening on ${PORT}`)
})
