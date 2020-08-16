const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next();
});

router.get('/', (req, res)=>{
    Post.find({}).lean().then(posts => {
        res.render('home', {posts: posts});
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

//Get single post
router.get('/post/:id', (req, res) => {
    const id = req.params.id;
    Post.findById(id).lean().then(post => {
        res.render('home/single_post', {post: post});
    }).catch(err => res.send('could not find post'));
})

module.exports = router;