const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const users = require('../data/users')
const session = require('express-session');
const data = require("../data/users");
const xss = require('xss');

router.get("/signup", async (req, res) => {
  try {
    res.render('pages/signup', { loggedIn: req.session.user });
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/signup", async (req, res) => {
  const symbolregex = /[!$%_^&*()+|~=`{}\[\]:";'<>?\/]/

  if (typeof req.body.username != "string" || !req.body.username || !isNaN(req.body["username"])) {
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not be empty or just numbers for username" })
  }

  

  if (typeof req.body.password != "string"|| !req.body.password|| !isNaN(req.body["password"])) {
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not be empty or just numbers for password" })
  }

  if(typeof req.body.email != "string" || !req.body.email|| !isNaN(req.body["email"])){
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not be empty or just numbers for valid email" })

  }

  if (typeof req.body.confirm != "string"|| !req.body.confirm|| !isNaN(req.body["confirm"])) {
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not be empty or just numbers for confirming password"})
  }

  if (typeof req.body.fname != "string"|| !req.body.fname|| !isNaN(req.body["fname"])) {
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not be empty or just numbers for first name" })
  }
  if(symbolregex.test(req.body.fname)){
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not have symbols in first name." })
  }

  if (typeof req.body.lname != "string"|| !req.body.lname|| !isNaN(req.body["lname"])) {
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not be empty or just numbers for last name" })
  }

  if(symbolregex.test(req.body.lname)){
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not have symbols in last name." })
  }

  if (typeof req.body.city != "string"|| !req.body.city|| !isNaN(req.body["city"])) {
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not be empty or just numbers for city" })
  }

  if(symbolregex.test(req.body.city)){
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not have symbols in city." })
  }

  if (typeof req.body.state != "string" || !req.body.state|| !isNaN(req.body["state"])) {
    return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must not be empty or just numbers for state" })
  }

  let user = xss(req.body.username.toLowerCase());
  let password = xss(req.body.password);
  let email = xss(req.body.email.toLowerCase());
  let confirm = xss(req.body.confirm);
  let firstName = xss(req.body.fname);
  let lastName = xss(req.body.lname);
  let city = xss(req.body.city);
  let state = xss(req.body.state);
  // console.log(req.body);
  // console.log(user);
  // console.log(password);
  // console.log(email);


  try {
    const checkEmail = await data.checkEmail(email);
    const checkUser = await data.checkUserName(user);
    const hashedPW = await bcrypt.hash(password, 5);

    if (!checkEmail) {
      return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "This email is already in use" })
    }

    if (!checkUser) {
      return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "This username is already in use" })
    }
    if (!password || !confirm) {
      return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "You must enter a password" })
    }
    if (password !== confirm) {
      return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Passwords do not match" })
    }

    else {
      let userObject = {
        username: user,
        email: email,
        firstName: firstName,
        lastName: lastName,
        city: city,
        state: state,
        hashedPassword: xss(hashedPW),
        listedItems: [],
        purchasedItems: []
      }
      const newUser = await data.createUser(userObject);
      req.session.user = newUser._id;
      console.log(req.session.user);
      res.redirect("/profile");
    }
  } catch (e) {
    console.log(e);
  }

}
);






module.exports = router;
