const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// const data = require('../data');
const err = false;

router.get("/", async (req,res) => {
    res.render("pages/home");
});

router.get("/login", async (req,res) => {
    if(req.session.user){
        err = false;
        res.redirect("/profile");
    } else{
        res.render("pages/login", {err: err});
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // users = call to DB function that returns list of all user objects

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

router.get('/profile', async (req, res) => {
    if(req.session.user){
        res.render('pages/profile');
    } else {
        res.render('pages/login');
    }
});

router.get('/items', async (req,res) => {
    res.redirect("/");
})

router.get('/items/:id', async (req,res) => {
    let myItem = {
        'itemId': '7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310',
        'itemDescription': 'Whoever buys this will have way too much power',
        'itemName': 'The Infinity Gauntlet',
        'itemImage': 'gauntlet.jpeg',
        'askingPrice': 3,
        'sellerId': "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        'startDate': '7/10/2020',
        'endDate': '7/17/2020',
        'currentBid': 75,
        'currentBidderId': "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        'tags': ['power', 'space', 'reality', 'soul', 'time', 'mind'],
        'commentIds': ['7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310']
    }
    // my item will be the result of a get call to the database
    // based on the ID in the url

    let mySeller = {
        "firstName": "John",
        "lastName": "Doe",
        "Email": "JDoe@gmail.com",
        "City": "Hoboken",
        "State": "NJ",
        "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
        "hashedPassword":"$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
        "usersItems": ["7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310", "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"], 
        "usersPurchases": ["7b972c3-a0e2-4y9g-h67d-7a1d4b6b6710"]
    }
    // my seller will be the result of a get call to the database
    // based on Seller ID in myItem
    
    let myComments = [
        {
            "commenter": "Loki",
            "comment": "Is this infinity stone compatible with my scepter?",
            "date": "7/10/2019"
        },
        {
            "commenter": "Hela",
            "comment": "Fake!",
            "date": "7/12/2019"
        }
    ];
    // my comments will be a list of comments as a result of get calls
    // to the database based on Comment IDs

    res.render('pages/single', {item: myItem, seller: mySeller, comments: myComments});
})

router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.render('pages/home');
});

module.exports = router;
