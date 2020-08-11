const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const cookieParser = require('cookie-parser');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  name: 'AuthCookie',
  secret: 'secret string!',
  user: undefined,
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
