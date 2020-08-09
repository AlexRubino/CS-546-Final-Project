const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const users = require('../data/users')
const session = require('express-session');
const data = require("../data/users");


router.get("/signup", async (req, res) => {
  try {
  res.render('pages/signup', {loggedIn: req.session.user});
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/signup", async (req, res) => {
  
    let user = req.body.username.toLowerCase();
    let password = req.body.password;
    let email = req.body.email.toLowerCase();
    let confirm = req.body.confirm;
    let firstName = req.body.fname;
    let lastName = req.body.lname;
    let city = req.body.city;
    let state = req.body.state;
    // console.log(req.body);
    // console.log(user);
    // console.log(password);
    // console.log(email);


    try{
      const checkEmail = await data.checkEmail(email);
      const checkUser = await data.checkUserName(user);
      const hashedPW = await bcrypt.hash(password, 5);

      if(!checkEmail){
        return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "This email is already in use"})
      }

      if(!checkUser){
       return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "This username is already in use"})
      }
       if(password !== confirm){
       return res.render("pages/signup", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Passwords do not match"})
      }
        
      else{
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
         }}catch(e){
          console.log(e);
        }
     
      }
);






module.exports = router;
