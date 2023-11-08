const Blog = require('../models/blog-model')
const User = require('../models/user-model')
const _ = require('lodash')
const { validationResult } = require('express-validator')
const blogsCltr = {} 


blogsCltr.list = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'approved'})
        res.json(blogs) 
    } catch(e) {
        res.json(e) 
    }
}

blogsCltr.create = async (req, res) => {
    const body = _.pick(req.body, ['title' ,'content'])
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const blog = new Blog(body) 
        blog.author = req.user.id 
        await blog.save()
        // adding blogId to user
        // const user = await User.findById(blog.author)
        // user.createdBlogs.push(blog._id)
        // await user.save()
        await User.findByIdAndUpdate(blog.author, { $push: { createdBlogs: blog._id }})
        res.json(blog) 
    } catch(e) {
        res.json(e) 
    }
}

blogsCltr.update = async (req, res) => {
    const id = req.params.id 
    const body = req.body 
    const obj = {...body, lastEditedBy: req.user.id }
    try { 
        if (req.user.role == 'author') {
            const blog = await Blog.findOneAndUpdate({ _id: id, author: req.user.id }, obj, { new: true })
            res.json(blog)
        } else if(req.user.role == 'admin') {
            const blog = await Blog.findByIdAndUpdate(id, obj, { new: true })
            res.json(blog)
        }
    } catch(e) {
        res.json(e) 
    }
}

blogsCltr.destroy = async (req, res) => {
    const id = req.params.id 
    try {
        if(req.user.role == 'author') {
            const blog = await Blog.findOneAndDelete({ _id: id, author: req.user.id })
            await User.findByIdAndUpdate(blog.author, { $pull: { createdBlogs: blog._id }})
            res.json(blog)
            // const user = await User.findById(blog.author) 
            // const index = user.createdBlogs.findIndex(ele => String(ele) == String(blog._id))
            // if(index >= 0) {
            //     user.createdBlogs.splice(index, 1)
            //     await user.save()
            // }
            // res.json(blog) 
        } else if(req.user.role == 'admin') {
            const blog = await Blog.findByIdAndDelete(id) 
            res.json(blog)
        }
    } catch(e) {
        res.json(e) 
    }
}

blogsCltr.myBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user.id })
        res.json(blogs)
    } catch(e) {
        res.json(e) 
    }
}

blogsCltr.unpublished = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'pending'})
        res.json(blogs) 
    } catch(e) {
        res.json(e) 
    }
}

blogsCltr.changeStatus = async (req, res) => {
    const id = req.params.id 
    const body = _.pick(req.body, ['status'])
    try { 
        const blog = await Blog.findByIdAndUpdate(id, body, { new: true })
        res.json(blog)
    } catch(e) {
        res.json(e) 
    }
}

module.exports = blogsCltr 