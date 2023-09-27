require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express() 
const port = process.env.PORT || 3030
const configureDB = require('./config/db')
const routes = require('./config/routes')
const { authenticateUser } = require('./app/middlewares/authentication')
const usersCltr = require('./app/controllers/users-cltr')

configureDB()
app.use(express.json())
app.use(cors()) 
app.use('/',routes)

app.post('/api/signup', usersCltr.signup)
app.post('/api/login', usersCltr.login)
app.get('/api/users/profile', authenticateUser, usersCltr.getProfile)
app.get('/api/users/list', authenticateUser, usersCltr.list)

app.listen(port, () => {
    console.log('server running on port', port)
})