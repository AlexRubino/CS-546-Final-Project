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
  let name = req.body["name"];
  let short_description = req.body["short_description"];
  let item_image
  let starting_bid = parseInt(req.body["starting_bid"], 10);
  let end = req.body["end"];
  let tags = req.body["tags"].split(",");
  var today = new Date();
  var date = (today.getMonth()+1)+'-'+today.getDate() + '-' + today.getFullYear();

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
        startDate: date,
        endDate: end,
        tags: tags
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
  try{
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
    res.render('pages/single', { loggedIn: req.session.user, item: myItem, seller: mySeller, comments: myComments });
  } catch(e) {
    console.log("oops");
    res.redirect("/");
  }

  
})


router.post("/bid", async(req, res)  => {
  try{
    const myItem = await data.getItem(req.session.item);
    const newBid = req.body.new_bid.parseInt();
    if(newBid <= myItem.currentBid || newBid < myItem.askingPrice){
      return res.render('pages/single', { loggedIn: req.session.user, item: myItem, seller: mySeller, comments: myComments, bidErrorMessage: "You must bid higher than the current bid." });
    }
    else{
      const updateItem = {
        currentBid: newBid, 
        currentbidderId: req.session.user
    }

    const newItem = await data.patchItem(req.session.item, updateItem)
    return res.render('pages/single', { loggedIn: req.session.user, item: myItem, seller: mySeller, comments: myComments});
  }
  } catch(e) {
    console.log("oops");
    res.redirect("/");
  }

  
})

router.post("/comments", async(req, res)  => {
  try{
    var today = new Date();
    var date = (today.getMonth()+1)+'-'+today.getDate() + '-' + today.getFullYear();
    if(!req.body.new_comment){
      return res.render('pages/single', { loggedIn: req.session.user, item: myItem, seller: mySeller, comments: myComments, commentErrorMessage: "You must have text to submit" });
    }

    const newComment = {
      commenterId: req.session.user, 
      comment: req.body.new_comment, 
      dateCommented: date
    }

    const comment = await commentData.createComment(newComment);
    let getItem = await itemData.getItem(req.session.item);
    getItem.commentIds.push(comment._id);
    const updateItem = await itemData.patchItem(req.session.item, getItem);  
  } catch(e) {
    console.log("oops");
    res.redirect("/");
  }

  
})



module.exports = router;
