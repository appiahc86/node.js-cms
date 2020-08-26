const express = require('express');
const router = express.Router();
const {userAuthenticated} = require('../../helpers/auth')

router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=>{

    res.render('admin');
});








module.exports = router;