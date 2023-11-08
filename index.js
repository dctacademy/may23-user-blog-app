require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express() 
const port = process.env.PORT || 3030
const configureDB = require('./config/db')
const routes = require('./config/routes')
const { authenticateUser, authorizeUser } = require('./app/middlewares/authentication')
const usersCltr = require('./app/controllers/users-cltr')
const blogsCltr = require('./app/controllers/blogs-cltr')
const commentsCltr = require('./app/controllers/comments-cltr')

configureDB()
app.use(express.json())
app.use(cors()) 
app.use('/',routes)

app.post('/api/signup', usersCltr.signup)
app.post('/api/login', usersCltr.login)
app.delete('/api/users/:id', authenticateUser, authorizeUser(['admin']), usersCltr.remove)
app.get('/api/users/list', authenticateUser, authorizeUser(['admin']), usersCltr.list)
app.get('/api/users/profile', authenticateUser, usersCltr.getProfile)
app.get('/api/users/:id', authenticateUser, authorizeUser(['admin']), usersCltr.show)
app.put('/api/users/:id/change-role', authenticateUser, authorizeUser(['admin']), usersCltr.changeRole)

// create an api for adding a new blog by the user 
app.get('/api/blogs', blogsCltr.list)
app.post('/api/blogs', authenticateUser, authorizeUser(['author']), blogsCltr.create)
app.get('/api/blogs/my-blogs', authenticateUser, blogsCltr.myBlogs)
app.get('/api/blogs/unpublished', authenticateUser, authorizeUser(['moderator']), blogsCltr.unpublished)
app.put('/api/blogs/:id', authenticateUser, authorizeUser(['admin','author']), blogsCltr.update)
app.put('/api/blogs/:id/change-status', authenticateUser, authorizeUser(['moderator']), blogsCltr.changeStatus)
app.delete('/api/blogs/:id', authenticateUser, authorizeUser(['admin', 'author']), blogsCltr.destroy)

// create api for comments
app.get('/api/comments', authenticateUser, authorizeUser(['moderator']), commentsCltr.list)
app.put('/api/comments/:id/approve', authenticateUser, authorizeUser(['moderator']),commentsCltr.approve)

// nested route 
app.post('/api/blogs/:bId/comments', authenticateUser, commentsCltr.create)
app.put('/api/blogs/:bId/comments/:cId', authenticateUser, authorizeUser(['moderator', 'user']), commentsCltr.update)
app.delete('/api/blogs/:bId/comments/:cId', authenticateUser, authorizeUser(['moderator', 'user']), commentsCltr.remove)

app.listen(port, () => {
    console.log('server running on port', port)
})