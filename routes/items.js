const express = require('express');
const router = express.Router();
const data = require("../data/items");
const userData = require("../data/users");


router.get("/new", async (req, res) => {
  try {
  res.render('pages/newItems');
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/new", async (req, res) => {
  
    let name = req.body["name"];
    let short_description = req.body["short_description"];
    let item_image = req.body["item_img"]
    let starting_bid = parseInt(req.body["starting_bid"], 10);
    let seller = req.body["seller_id"];
    let start = req.body["start"];
    let end = req.body["end"];
    
    try{
     
    if(!name){
        return res.render("pages/newItems", {hasErrors: true, errorMessage: "Must input item name"})
      }

      if(!short_description){
        return res.render("pages/newItems", {hasErrors: true, errorMessage: "Must input short description"})      }

      if(!item_image){
        return res.render("pages/newItems", {hasErrors: true, errorMessage: "Must input image of item"})      }
       
      if(!starting_bid){
        return res.render("pages/newItems", {hasErrors: true, errorMessage: "Must set starting bid"})      }
      
        // if(!seller){
        //   return res.render("pages/newItems", {hasErrors: true, errorMessage: "Must input seller ID"})      }
          
      if(!start){
          return res.render("pages/newItems", {hasErrors: true, errorMessage: "Must set starting date"})      }
        
      if(!end){
            return res.render("pages/newItems", {hasErrors: true, errorMessage: "Must set ending date"})      }
            
      else{
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
      res.render("pages/itemConfirmation");   
         }}catch(e){
          console.log(e);
        }
     
      }
    
 
);
router.get('/', async (req,res) => {
  res.redirect("/");
})

router.get('/view/:id', async (req,res) => {
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



module.exports = router;
