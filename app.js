const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const cookieParser = require('cookie-parser');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const itemData = require("./data/items")
const userData = require("./data/users")

app.use('/public', static);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function emailNotify(recipient, subject, text) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'NerdBay546@gmail.com',
        pass: 'cs546squad'
      }
    })

    const email = {
      from: 'NerdBay546@gmail.com',
      to: recipient,
      subject: subject,
      text: text
    }

    transporter.sendMail(email, (error, info) => {
      if (error) {
        console.log("Encountered an error while attempting to send email: ")
        console.log(error)
        resolve(false)
      } else {
        console.log(`[` + new Date().toUTCString() + "] " + "email sent to: " + recipient)
        resolve(true)
      }
    })
  })
}

app.use(session({
  name: 'AuthCookie',
  secret: 'secret string!',
  user: undefined,
  item: undefined,
  resave: false,
  saveUninitialized: true
}));

app.use('/profile', async (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).redirect('/login');
  }
  next();
});

app.use('/items/new', async (req, res, next) => {
  if (!req.session.user) {
    return res.status(403).redirect('/login');
  }
  next();
});

app.use(async (req, res, next) => { // check if item was sold since last time
  const ItemList = await itemData.getAllItems();
  for(item of ItemList) {
    if(Date.now() > Date.parse(item.endDate) && !item.sold) {
      const seller = await userData.getUser(item.sellerId);
      let recipient, subject, text = "";

      if(item.currentBid) {
        // if someone bid, send email to seller and buyer
        const bidder = await userData.getUser(item.currentBidderId);
        
        recipient = seller.email;
        subject = "Your item was sold!";
        text = 
        `Hi ${seller.firstName},

        Great news! Someone purchased your item: ${item.itemName}. The buyer's name is ${bidder.firstName} ${bidder.lastName}, and their bid on your item is ${item.currentBid}. Reach out to them at ${bidder.email} to set up how you will complete the transaction.

        Sincerely,
        The NerdBay Team
        `
        await emailNotify(recipient, subject, text);

        recipient = bidder.email;
        subject = "You won the auction!";
        text = 
        `Hi ${bidder.firstName},

        Great news! You had the highest bid on the item: ${item.itemName}. The seller's name is ${seller.firstName} ${seller.lastName}; reach out to them at ${seller.email} to set up how you will complete the transaction.

        Sincerely,
        The NerdBay Team
        `
        await emailNotify(recipient, subject, text);
      } else {
        // if no one bid, send email to seller only
        recipient = seller.email;
        subject = "Your item was not sold.";
        text = 
        `Hi ${seller.firstName},

        We're sorry to inform you that no one has purchased your item: ${item.itemName}. We encourage you to try listing it again with a lower asking price.

        Sincerely,
        The NerdBay Team
        `
        await emailNotify(recipient, subject, text);
        console.log("sent");
      }

      await itemData.patchItem(item._id, {sold: true});
    }
  }

  next();
});

app.use(async (req, res, next) => {
  console.log(`[` + new Date().toUTCString() + "] " +
    req.method + " " + req.originalUrl +
    (req.session.user ? " (Authenticated User)" : " (Non-Authenticated User)"));
  next();
});

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
