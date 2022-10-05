const User = require('../Models/user').userModel;


async function uniqueEmail(req, res, next) {
    // check the unique email
    try {
        const user = await User.findOne({email: req.body.email})
        if (user) {
            res.status(400).json({message: 'Email already exists'})
        } else {
            next()
        } 
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

async function uniqueUsername (req, res, next) {
    // check the unique username
    try {
        const user = await User.findOne({username: req.body.username})
        if (user) {
            res.status(400).json({message: 'Username already exists'})
        } else {
            next()
        } 
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

module.exports = {uniqueEmail, uniqueUsername}
