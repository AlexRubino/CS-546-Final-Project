const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const users = require('../data/users')
const session = require('express-session');
const data = require("../data/users");
const { default: xss } = require('xss');


router.get("/signup", async (req, res) => {
  try {
    res.render('pages/signup', { loggedIn: req.session.user });
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/signup", async (req, res) => {

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
        hashedPassword: hashedPW,
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
