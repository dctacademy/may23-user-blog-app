const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers['authorization']
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = tokenData
        next() 
    } catch(e) {
        res.status(401).json(e)
    }
}

const authorizeUser = (roles) => {
    return function(req, res, next){
        if (roles.includes(req.user.role)) {
            next()
        } else {
            res.status(403).json({ error: 'you are not permitted to access this route' })
        }
    }
}


// const authorizeUser = (req, res, next) => {
//     if(req.permittedRoles.includes(req.user.role)) {
//         next()
//     } else {
//         res.status(403).json({ error: 'you are not permitted to access this route'})
//     }
// }

// const permitUser = (roles) => {
//     return function(req, res, next){
//         if (roles.includes(req.user.role)) {
//             next()
//         } else {
//             res.status(403).json({ error: 'you are not permitted to access this route' })
//         }
//     }
// }

module.exports = {
    authenticateUser,
    authorizeUser
}