const express = require('express');
const router = express.Router();
const path = require('path');
const Category = require('../../../models/Category');
const {userAuthenticated} = require('../../../helpers/auth')

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

//Get all categories
router.get('/', (req, res) => {

     Category.find({}).lean().then(categories => {
        res.render('admin/categories', {categories: categories});
    });


});

//Store new category
router.post('/store', (req, res) => {
   const name = req.body.name;
   const newCategory = new Category({
       name: name
   });

   newCategory.save().then(saved => {
       res.redirect('/admin/categories/')
   }).catch(err => res.send('Could not save category'))

});

//Show form for editing category
router.get('/edit/:id', (req, res) => {
    Category.findById(req.params.id).lean().then(category => {
       res.render('admin/categories/edit', {category: category});
    });
});

//Update Category
router.patch('/update/:id', (req, res) => {
     Category.findById(req.params.id).then(category => {
        category.name = req.body.name;

         category.save().then(saved => {
             res.redirect('/admin/categories');
         }).catch(err => res.send('could not update record'));

    });


});


//Delete Category
router.delete('/delete/:id', (req, res) => {
   Category.findByIdAndDelete(req.params.id).then(deleted => {
      res.redirect('/admin/categories/') ;
   });
});
module.exports = router;

