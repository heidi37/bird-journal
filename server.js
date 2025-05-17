const express = require("express")
const app = express()
const cors = require('cors');
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('express-flash')
const logger = require('morgan')
const methodOverride = require('method-override')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main');
const entryRoutes = require('./routes/entries')
const PORT = process.env.PORT || 3000
const API_BASE_URL = process.env.NODE_ENV === "production"
  ? "https://https://bird-journal.onrender.com/"
  : "http://localhost:3000";

console.log(`Running in ${process.env.NODE_ENV} mode`);
console.log(`API Base URL: ${API_BASE_URL}`);

require('dotenv').config({ path: './config/.env' })

// Passport config
require('./config/passport')(passport)

connectDB()

app.set("view engine", "ejs")
app.use(express.static("public"))
// Look at parts of requests, form data
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// Morgan logs
app.use(logger('dev'))
// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.DB_STRING,
      ttl: 60 * 60 * 24 * 30 // 30 days in seconds
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,                 // Helps mitigate XSS
      sameSite: 'lax',                // Balances CSRF protection and usability
      secure: false                  // Set to true if using HTTPS in production
    }
  })
)

// Enables Cross-Origin Resource Sharing (CORS) for the application.
app.use(cors());

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// form validation messages
app.use(flash())
// method-override
app.use(methodOverride("_method"));

app.use('/', mainRoutes);
app.use('/entries', entryRoutes)

// 404 Handler (MUST be the last middleware)
app.use((req, res) => {
  const isAuthenticated = req.isAuthenticated()
  res.status(404).render("404", { isAuthenticated: isAuthenticated, loggedInUser: req.user, view: 404 });
});

// 500 Handler
app.use((err, req, res, next) => {
  const isAuthenticated = req.isAuthenticated()
  console.error("Server Error:", err); // Logs full error to console
  res.status(500).render("500", { isAuthenticated: isAuthenticated, loggedInUser: req.user, view: 500 });
});



app.listen(PORT, function () {
  console.log(`listening on ${PORT}`)
})
