const mongoose = require('mongoose');
const schema = mongoose.Schema;

const categorySchema = new schema({
   name: {
       type: String,
       required: true,
       unique: true
   }
});

const Category = mongoose.model('categories', categorySchema);
module.exports = Category;