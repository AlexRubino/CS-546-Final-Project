const path = require('path')
const fs = require('fs')
const express = require('express')
const router = express.Router()
const data = require("../data/items")
const userData = require("../data/users")
const commentData = require("../data/comments")
const xss = require('xss');

//file upload settings
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.resolve("./public/items")
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
  if (typeof req.body["name"] != "string" || !isNaN(req.body["name"])) {
    return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Item name must be string" })
  }

  if (typeof req.body["short_description"] != "string" || !isNaN(req.body["short_description"]) || !req.body["short_description"]) {
    return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Short Description must be string" })
  }

  if (isNaN(req.body["starting_bid"]) || !req.body["starting_bid"]) {
    return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must input number for starting bid." })
  }

  if (typeof Date.parse(req.body["end"]) != "number" || !req.body["end"]) {
    return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must input valid date" })
  }

  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

if(!regex.test(req.body["endtime"])){
  if(req.body["endtime"] != "24:00"){
    return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Must input valid time" })
  }
}


  if (typeof req.body["tags"] != "string") {
    return res.render("pages/newItems", { loggedIn: req.session.user, hasErrors: true, errorMessage: "Tags must be strings" })
  }

  let name = xss(req.body["name"]);
  let short_description = xss(req.body["short_description"]);
  let item_image
  let starting_bid = parseInt(xss(req.body["starting_bid"], 10));
  let end = xss(req.body["end"]);
  let time = xss(req.body["endtime"]);
  let tags = xss(req.body["tags"].split(","));
  const today = new Date();
  const currentMonth = ('0' + (today.getMonth() + 1)).slice(-2)
  let date = today.getFullYear() + '-' + currentMonth + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes();

  let endDateandTime = xss(end + " " + time);


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
        startDate: date,
        endDate: endDateandTime,
        tags: tags,
        sold: false
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
  try {
    const myItem = await data.getItem(req.params.id);
    req.session.item = myItem._id;
    const mySeller = await userData.getUser(myItem.sellerId)
    let myComments = []
    for (commentId of myItem.commentIds) {
      let comment = await commentData.getComment(commentId)
      const commenter = await userData.getUser(comment.commenterId)
      comment.commenter = commenter.firstName + " " + commenter.lastName
      myComments.push(comment)
    }

    let available = !myItem.sold;
    res.render('pages/single', { loggedIn: req.session.user, item: myItem, seller: mySeller, comments: myComments, self: req.session.user == myItem.sellerId, available: available });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }


})


router.post("/newbid", async (req, res) => {
  
  try {
    let myItem = await data.getItem(req.session.item);
    let newBid = xss(req.body["new_bid"]);
    const mySeller = await userData.getUser(myItem.sellerId)
    let myComments = []
    let available = !myItem.sold;

    for (commentId of myItem.commentIds) {
      let comment = await commentData.getComment(commentId)
      const commenter = await userData.getUser(comment.commenterId)
      comment.commenter = commenter.firstName + " " + commenter.lastName
      myComments.push(comment)
    }

    if (newBid <= myItem.currentBid || newBid < myItem.askingPrice || isNaN(req.body["new_bid"])) {
      return res.render('pages/single', { loggedIn: req.session.user, item: myItem, seller: mySeller, comments: myComments, self: req.session.user == myItem.sellerId, available: available, bidErrorMessage: "You must bid higher than the current bid." });
    }

    else {
      myItem.currentBid = parseFloat(newBid);
      myItem.currentBidderId = req.session.user;

      let currentUser = await userData.getUser(req.session.user);
      currentUser.purchasedItems.push(myItem._id);
      const updatedUser = await userData.patchUser(req.session.user, currentUser);

      const newCurrentBidItem = await data.patchItem(req.session.item, myItem)
      return res.redirect("/items/view/" + req.session.item);
    }
  } catch (e) {
    console.log(e);
  }
})

router.post("/comments", async (req, res) => {
  try {
    if (!req.body.new_comment || typeof req.body.new_comment != "string") {
      return res.render('pages/single', { loggedIn: req.session.user, item: myItem, seller: mySeller, comments: myComments, commentErrorMessage: "You must have text to submit" });
    }

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const myItem = await data.getItem(req.session.item);
    const mySeller = await userData.getUser(myItem.sellerId)
    let myComments = []
    for (commentId of myItem.commentIds) {
      let comment = await commentData.getComment(commentId)
      const commenter = await userData.getUser(comment.commenterId)
      comment.commenter = commenter.firstName + " " + commenter.lastName
      myComments.push(comment)
    }
      const newComment = {
        commenterId: req.session.user,
        comment: xss(req.body.new_comment),
        dateCommented: date
      }

      const comment = await commentData.createComment(newComment);
      myItem.commentIds.push(comment._id);
      const updateItem = await data.patchItem(req.session.item, myItem);
      res.redirect("/items/view/" + req.session.item);

    
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }


})



module.exports = router;
