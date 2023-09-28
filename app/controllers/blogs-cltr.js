const Blog = require('../models/blog-model')
const _ = require('lodash')
const blogsCltr = {} 

blogsCltr.create = async (req, res) => {
    const body = _.pick(req.body, ['title' ,'content'])
    try {
        const blog = new Blog(body) 
        blog.author = req.user.id 
        await blog.save()
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
            res.json(blog) 
        } else if(req.user.role == 'admin') {
            const blog = await Blog.findByIdAndDelete(id) 
            res.json(blog)
        }
    } catch(e) {
        res.json(e) 
    }
}

module.exports = blogsCltr 