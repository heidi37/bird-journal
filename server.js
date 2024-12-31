const express = require("express")
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main');
const entryRoutes = require('./routes/entries')
const PORT = process.env.PORT || 3000

require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.DB_STRING, // Replace with your MongoDB connection string
    }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', mainRoutes);

app.use('/entries', entryRoutes)

app.listen(PORT, function () {
  console.log(`listening on ${PORT}`)
})
