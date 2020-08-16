const express = require('express');
const router = express.Router();
const path = require('path');
const Category = require('../../../models/Category');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});


router.get('/', (req, res) => {

        res.render('admin/categories');

});








module.exports = router;

