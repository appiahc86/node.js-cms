const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    title:{
        type: String,
        require: true,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: "categories"
    },

    status: {
    type: String,
    default: 'public'
    },

    allowComments:{
    type: Boolean,
    default: 0
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    },

    body:{
        type: String,
        require: true
    },

    image:{
       type: String
    },

    date: {
        type: Date,
        default: Date.now()
    },

    comments: [{

            type: Schema.Types.ObjectId,
            ref: 'comments'

         }]

}, {usePushEach: true});

const Post = mongoose.model('posts', PostSchema);
module.exports = Post;
