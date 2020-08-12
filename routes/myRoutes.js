const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userData = require('../data/users');
const itemData = require('../data/items');
let err = false;

router.get("/", async (req, res) => {
    const allItems = await itemData.getAllItems();
    res.render("pages/home", { loggedIn: req.session.user, items: allItems });
});

router.get("/login", async (req, res) => {
    if (req.session.user) {
        err = false;
        res.redirect("/profile");
    } else {
        res.render("pages/login", { loggedIn: req.session.user, err: err });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    users = await userData.getAllUsers();
    for (user of users) {

        if ((user.username).toUpperCase() == username.toUpperCase()) {
            let compare = false;
            try {
                compare = await bcrypt.compare(password, user.hashedPassword);
            } catch (e) { }

            if (compare) {
                req.session.user = user._id;
            }
            break;
        }
    }
    if (!req.session.user) {
        err = true;
    }
    res.redirect("/login");
});

router.post("/search", async (req,res) => {
    let myItems = [];
    const allItems = await itemData.getAllItems();
    const search = req.body.search.toUpperCase();

    for(item of allItems) {
        if(item.itemName.toUpperCase().includes(search)){
            myItems.push(item);
        } else{
            for(tag of item.tags) {
                if(tag.toUpperCase().includes(search)){
                    myItems.push(item);
                    break;
                }
            }
        }
    }

    res.render("pages/home", { loggedIn: req.session.user, items: myItems, message: req.body.search});
});

router.post("/sort", async(req, res) => {
    res.render("pages/itemConfirmation");
});

router.get('/profile', async (req, res) => {
    if (req.session.user) {
        const user = await userData.getUser(req.session.user);
        
        let myItems = user.listedItems;
        let newMyItems = [];
        for (item of myItems) {
            newMyItems.push(await itemData.getItem(item));
        }
        
        let myBids = user.purchasedItems;
        let newMyBids = [];
        for (item of myBids) {
            newMyBids.push(await itemData.getItem(item));;
        }

        res.render('pages/profile', { loggedIn: req.session.user, myItems: newMyItems, myBids: newMyBids });
    } else {
        res.render('pages/login', { loggedIn: req.session.user });
    }
});


router.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
