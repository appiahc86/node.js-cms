const express = require('express');
const router = express.Router();
const Comment = require('../../../models/Comment');
const Post = require('../../../models/Post');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
})

//Get all comments
router.get('/', (req, res) => {
    Comment.find({}).populate('user').lean().then(comments => {

        res.render('admin/comments/index', {comments: comments})
    })

});

//Store Comment
router.post('/store', (req, res) => {
    const id = req.body.postId;
    Post.findById(id).then(post=>{

       const newComment = new Comment({
           user: req.user.id,
           body: req.body.content
       });

        post.comments.push(newComment);

        post.save().then(savedPost => {
           newComment.save().then(commentSaved => {
               req.flash('success_message', "Comment Added Successfully");
               res.redirect('/post/'+ id);
           });
        });

    });
});




//Delete comment
router.delete('/delete/:id', (req, res) => {
    //Find comment
    Comment.findByIdAndRemove(req.params.id).then(comment => {

        //Find comments in posts collection and remove them
        Post.findOneAndUpdate({comments: req.params.id}, {$pull: {comments: req.params.id}}, (err, data)=>{
            if (err) console.log(err);

            res.redirect('/admin/comments');
        });

    });
});









module.exports = router;