const path = require('path')
const fs = require('fs')
const express = require('express')
const router = express.Router()
const data = require("../data/items")
const userData = require("../data/users")
const commentData = require("../data/comments")

//file upload settings
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.resolve("./public/img")
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest)
    }
    console.log(dest)
    cb(null, dest)
  },
  filename: (req, file, cb) => {
    cb(null, path.parse(file.originalname).name + "-" + req.session.user + "-" + Date.now() + path.parse(file.originalname).ext)
  }
})
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      cb(null, true)
    } else {
      req.extError = "Image Only!"
      return cb(null, false, req.extError)
    }
  }
})


router.get('/', async (req, res) => {
  res.redirect("/");
})

router.get("/new", async (req, res) => {
  try {
    res.render('pages/newItems', { loggedIn: req.session.user });
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/new", upload.single("item_img"), async (req, res) => {
  let name = req.body["name"];
  let short_description = req.body["short_description"];
  let item_image
  let starting_bid = parseInt(req.body["starting_bid"], 10);
  let seller = req.body["seller_id"];
  let start = req.body["start"];
  let end = req.body["end"];

  //console.log(req.file)

  try {

    if (!name) {
      return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must input item name" })
    }

    if (!short_description) {
      return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must input short description" })
    }

    // if (!item_image) {
    //   return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must input image of item" })
    // }
    if (req.extError) {
      return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, fileErrors: true, errorMessage: req.extError })
    } else if (!req.file) {
      return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, fileErrors: true, errorMessage: "Must upload an image!" })
    } else {
      item_image = path.parse(req.file.path).base
    }

    if (!starting_bid) {
      return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must set starting bid" })
    }

    // if(!seller){
    //   return res.render("pages/newItems", {hasErrors: true, errorMessage: "Must input seller ID"})      }

    if (!start) {
      return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must set starting date" })
    }

    if (!end) {
      return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must set ending date" })
    }

    else {
      let listedItem = {
        itemName: name,
        itemDescription: short_description,
        itemImage: item_image,
        askingPrice: starting_bid,
        sellerId: req.session.user,
        startDate: start,
        endDate: end,

      }
      const newItems = await data.createItem(listedItem);
      let getUser = await userData.getUser(req.session.user);

      getUser.listedItems.push(newItems._id);
      const updatedUser = await userData.patchUser(req.session.user, getUser);
      // const updateUserItems = await userData.updateListedItems(req.session.user["username"], newItems["_id"]);
      res.render("pages/itemConfirmation", { loggedIn: req.session.user });
    }
  } catch (e) {
    console.log(e);
  }

}
);

router.get('/view/:id', async (req, res) => {
  // let myItem = {
  //   'itemId': '7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310',
  //   'itemDescription': 'Whoever buys this will have way too much power',
  //   'itemName': 'The Infinity Gauntlet',
  //   'itemImage': 'gauntlet.jpeg',
  //   'askingPrice': 3,
  //   'sellerId': "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
  //   'startDate': '7/10/2020',
  //   'endDate': '7/17/2020',
  //   'currentBid': 75,
  //   'currentBidderId': "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
  //   'tags': ['power', 'space', 'reality', 'soul', 'time', 'mind'],
  //   'commentIds': ['7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310']
  // }
  const myItem = await data.getItem(req.params.id)
  // my item will be the result of a get call to the database
  // based on the ID in the url

  // let mySeller = {
  //   "firstName": "John",
  //   "lastName": "Doe",
  //   "Email": "JDoe@gmail.com",
  //   "City": "Hoboken",
  //   "State": "NJ",
  //   "_id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
  //   "hashedPassword": "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
  //   "usersItems": ["7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310", "7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710"],
  //   "usersPurchases": ["7b972c3-a0e2-4y9g-h67d-7a1d4b6b6710"]
  // }
  const mySeller = await userData.getUser(myItem.sellerId)
  // my seller will be the result of a get call to the database
  // based on Seller ID in myItem

  // let myComments = [
  //   {
  //     "commenter": "Loki",
  //     "comment": "Is this infinity stone compatible with my scepter?",
  //     "date": "7/10/2019"
  //   },
  //   {
  //     "commenter": "Hela",
  //     "comment": "Fake!",
  //     "date": "7/12/2019"
  //   }
  // ];
  let myComments = []
  for (commentId of myItem.commentIds) {
    let comment = await commentData.getComment(commentId)
    const commenter = await userData.getUser(comment.commenterId)
    comment.commenter = commenter.firstName + " " + commenter.lastName
    myComments.push(comment)
  }
  // my comments will be a list of comments as a result of get calls
  // to the database based on Comment IDs

  res.render('pages/single', { loggedIn: req.session.user, item: myItem, seller: mySeller, comments: myComments });
})



module.exports = router;
