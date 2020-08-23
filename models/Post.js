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
    }

});

const Post = mongoose.model('posts', PostSchema);
module.exports = Post;
