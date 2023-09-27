const mongoose = require('mongoose')
const { Schema, model } = mongoose 

const blogSchema = new Schema({
    title: String,
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'published']
    }
})

const Blog = model('Blog', blogSchema) 

module.exports = Blog 