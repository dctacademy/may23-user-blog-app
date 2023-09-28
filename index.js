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
app.post('/api/blogs', authenticateUser, authorizeUser(['author']), blogsCltr.create)
app.put('/api/blogs/:id', authenticateUser, authorizeUser(['admin','author']), blogsCltr.update)
app.delete('/api/blogs/:id', authenticateUser, authorizeUser(['admin', 'author']), blogsCltr.destroy)

// create an api for editing a blog by the user

app.listen(port, () => {
    console.log('server running on port', port)
})