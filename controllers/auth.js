const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/entries");
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    req.flash("errors", validationErrors);
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Success! You are logged in." });
      res.redirect(req.session.returnTo || "/entries");
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return next(err); // Pass the error to the error-handling middleware
    }
    console.log("User has logged out.");
    req.session.destroy((err) => {
      if (err) {
        console.error("Error : Failed to destroy the session during logout.", err);
        return next(err); // Pass the error to the error-handling middleware
      }
      req.user = null; // Clear the user from the request object
      res.redirect("/"); // Redirect to the homepage or login page
    });
  });
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/entries");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

// The `createUser` function should be placed here, outside of `postSignup` to make it accessible.
async function createUser(req, res, next) {
  try {
    // Check if a user exists with the given email or username
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { userName: req.body.userName }],
    });

    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that email address or username already exists.",
      });
      return res.redirect("../signup");
    }

    // If no existing user, save the new user
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    // Log the user in after saving
    req.logIn(user, (err) => {
      if (err) {
        console.log("Login error:", err);
        return next(err);
      }
      res.redirect("/entries");
    });
  } catch (err) {
    console.error("Error during signup:", err);
    return next(err); // Handle errors (database connection or other issues)
  }
}

exports.createUser = createUser; // Export the createUser function
