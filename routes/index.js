const myRoutes = require('./myRoutes');

const constructorMethod = (app) => {
    app.use('/', myRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('pages/error');
    });
};

module.exports = constructorMethod;
