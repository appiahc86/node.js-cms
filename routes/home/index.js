const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next();
});

//Home Page
router.get('/', (req, res)=>{
    Post.find({}).lean().then(posts => {
        Category.find({}).lean().then(categories => {
            res.render('home', {posts: posts, categories: categories});
        });

    }).catch(err => res.send('could not find posts'));

});

router.get('/about', (req, res)=>{
res.render('home/about');
});

router.get('/login', (req, res)=>{
res.render('home/login');
});

router.get('/register', (req, res)=>{
res.render('home/register');
});

// Register
router.post('/register', (req, res) => {

    if (req.body.password !== req.body.passwordConfirm){
        res.render('home/register',
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            }
            );
    }else
    {

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
    });

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
          newUser.password = hash;
            newUser.save().then(saved => {
                res.redirect('/');
            })
        });
    });

    }
});

//Get single post
router.get('/post/:id', (req, res) => {
    const id = req.params.id;
    Post.findById(id).lean().then(post => {
        Category.find({}).lean().then(categories => {
            res.render('home/single_post', {post: post, categories: categories});
        })
    }).catch(err => res.send('could not find post'));
});

module.exports = router;