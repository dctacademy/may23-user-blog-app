// create a comment schema + model 
// body, userId, blogId, status - pending 
const mongoose = require('mongoose')
const { Schema, model } = mongoose 
const commentSchema = new Schema({
    body: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }, 
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true }) 

const Comment = model('Comment', commentSchema)
module.exports = Comment 