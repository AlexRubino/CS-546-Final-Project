const express = require('express');
const router = express.Router();
const data = require("../data/items");



router.get("/", async (req, res) => {
  try {
  res.render('pages/newItems');
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post("/", async (req, res) => {
  
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
      
        if(!seller){
          return res.render("pages/newItems", {hasErrors: true, errorMessage: "Must input seller ID"})      }
          
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
          sellerId:"test",
          startDate: start,
          endDate: end, 
          
        }
      const newItems = await data.createItem(listedItem);

      // const updateUserItems = await userData.updateListedItems(req.session.user["username"], newItems["_id"]);
      res.render("pages/itemConfirmation");   
         }}catch(e){
          console.log(e);
        }
     
      }
    
 
);

module.exports = router;
