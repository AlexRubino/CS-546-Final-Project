const userRoutes = require('./users');
const itemRoutes = require('./items')
const myRoutes = require('./myRoutes');
const constructorMethod = app => {
  app.use('/', myRoutes);
  app.use("/users", userRoutes);
  app.use("/items", itemRoutes)
  app.use('*', (req, res) => {
      res.status(404).render('pages/error');
  });
};
  module.exports = constructorMethod;
