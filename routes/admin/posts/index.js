const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Post = require('../../../models/Post');
const {isEmpty} = require('../../../helpers/upload-helper')



const uploadDir = path.join(__dirname, '../../../public/images/');


router.all('/posts/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
});

//Get all posts
router.get('/', (req, res)=>{
     Post.find({}).lean().then(posts => {
        res.render('admin/posts', {posts: posts});
    });
});

// Show form for Creating post
router.get('/create', (req, res)=>{
   res.render('admin/posts/create');
});

//Store Post
router.post('/store', (req, res)=>{

    let errors = [];
    //Validate request
    if (!req.body.title.trim()){
        errors.push({message: 'Title field is required'});
        errors.push({message: 'try agian'});
    }

    if (errors.length > 0){
        res.render('admin/posts/create', {errors: errors});
    }else {



    let imageName = '';

    if (!isEmpty(req.files)) {

       let image = req.files.image;
       imageName = Date.now() + '-' + image.name;

       image.mv(uploadDir + imageName, (err)=>{
         if(err) console.log(err);
         });

    }


   let allowComments = !!req.body.allowComments;
   let title = req.body.title;
   let status = req.body.status;
   let body = req.body.body;

   const newPost = new Post({
       title: title,
       status: status,
       allowComments: allowComments,
       body: body,
       image: imageName
   });

   newPost.save().then(saved => {
       req.flash('success_message', 'Post saved successfully');
       res.redirect('/admin/posts');
   }).catch(validator => {
       console.log(validator.errors)
   });

    }

});

//Show form for editing posts
router.get('/edit/:id', (req, res)=>{
    const id = req.params.id;
    Post.findById(id).lean().then(post => {
       res.render('admin/posts/edit', {post: post});
    }).catch(err => res.send('Could not find post' ));
});

// Update Post
router.put('/update/:id', (req, res) => {

    const id = req.params.id;
    let allowComments = !!req.body.allowComments;

    let title = req.body.title;
    let status = req.body.status;
    let body = req.body.body;


    Post.findOne({_id: id}).then(post =>{
        let imageName = '';
         // If user uploads new file, delete the old one and insert the new one
        if (!isEmpty(req.files)){
            let image = req.files.image;


                fs.unlink(uploadDir + post.image, (err)=>{
                    if (err) console.log(err);
                });


            imageName = Date.now() + '-' + image.name;
            image.mv(uploadDir + imageName); //Done with image upload


            post.title = title;
            post.status = status;
            post.allowComments = allowComments;
            post.image = imageName;
            post.body = body;

            //Save post now
            post.save().then(saved =>{
                res.redirect('/admin/posts/');
            }).catch(err => res.send('could not edit post'))

            }else
            {


                post.title = title;
                post.status =status;
                post.allowComments = allowComments;
                post.body = body;

                //Save post now
                post.save().then(saved =>{
                    res.redirect('/admin/posts/');
                }).catch(err => res.send('could not edit post'))


            }




    }).catch(err => res.send(err));


});

//Show a single post
router.get('/show/:id', (req, res) => {



});

//Delete Post
router.delete('/delete/:id', (req, res) => {

    const id = req.params.id;

    Post.findOne({_id: id}).then(post =>{
        //delete image
        fs.unlink(uploadDir + post.image, (err)=>{
            if (err) console.log(err);
        });
        post.remove();
        res.redirect('/admin/posts');
    }).catch(error => {
        res.send('Error Occurred');
    });
});

module.exports = router;