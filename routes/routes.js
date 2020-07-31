const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const err = false;

router.get("/", async (req,res) => {
    res.render("pages/home");
});

router.get("/login", async (req,res) => {
    if(req.session.user){
        err = false;
        res.redirect("/");
    } else{
        res.render("pages/login", {err: err});
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    for(user of users){
        if ((user.username).toUpperCase() == username.toUpperCase()){
        let compare = false;
        try{
            compare = await bcrypt.compare(password, user.hashedPassword);
        } catch(e){}

        if(compare){
            req.session.user = user;
        } 
        break;
        }
    }
    if(!req.session.user){
        err = true;
    }
    res.redirect("/login");
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.render('pages/home');
});