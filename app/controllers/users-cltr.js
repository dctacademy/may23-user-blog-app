const User = require('../models/user-model')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const usersCltr = {}

usersCltr.signup = async (req, res) => {
    const body = req.body 
    // sanitize input 
    if(body.role == 'admin') {
        body.role = 'user'
    }
    try {
        const user = new User(body) 
        const salt = await bcryptjs.genSalt() 
        user.password = await bcryptjs.hash(user.password, salt)
        // assign first user in the app as admin 
        const totalUsers = await User.countDocuments()
        if(totalUsers == 0) {
            user.role = 'admin'
        }
        await user.save()
        res.json(user) 
    } catch(e) {
        res.json(e) 
    }
}

usersCltr.login = async (req, res) => {
    const body = req.body 
    try {
        const user = await User.findOne({ email: body.email })
        if(!user) {
            res.status(404).json({ errors: 'invalid email / password'})
        } else {
            const result = await bcryptjs.compare(body.password, user.password)
            if(!result) {
                res.status(404).json({ errors: 'invalid email / password' })
            } else {
                const tokenData = { id: user._id, role: user.role }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d'})
                res.json({ token: token})
            }
        }
    } catch(e){
        res.json(e)
    }
}

usersCltr.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user)
    } catch(e) {
        res.json(e) 
    }
}

usersCltr.list = async (req, res) => {
    try {   
        const users = await User.find()
        res.json(users) 
    } catch(e){
        res.json(e)
    }
}

module.exports = usersCltr 