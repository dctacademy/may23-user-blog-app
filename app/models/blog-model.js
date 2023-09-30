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
        enum: ['pending', 'approved', 'reject']
    },
    lastEditedBy: {
        type: Schema.Types.ObjectId,
        default: null 
    }
})

const Blog = model('Blog', blogSchema) 

module.exports = Blog 