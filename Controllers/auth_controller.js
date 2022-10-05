const jsonwebtoken = require('jsonwebtoken');
var bcrypt = require("bcryptjs");
require('dotenv').config();
const key = process.env.Secret_Key;
const User = require('../Models/user').userModel;
const Token = require('../Models/resetToken').tokenModel;
const crypto = require("crypto");
const {sendEmail, sendResetPassword} = require('./mail_service')


async function signup(req, res) {

    const randomToken = jsonwebtoken.sign({email: req.body.email}, key)

    // create the user using the User model
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        verificationToken: randomToken
    })

    // try to save the new user
    try {
        const savedUser = await newUser.save();
        sendEmail(req.body.username, req.body.email, randomToken, res);
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

async function signin(req, res) {

    // check the user
    try {
        const user1 = await User.findOne({email: req.body.username})
        const user2 = await User.findOne({username: req.body.username})
        if (!user1 && !user2) {
            res.status(404).send({message: "Email or username doesn't exist"})
        } else {
            let user = null
            if (user1) {
                user = user1
            } else {
                user = user2
            }
            
            if (bcrypt.compareSync(req.body.password, user.password)) {
                // if the user is not in active status, send some messages
                if (user.status !== 'Active') {
                    return res.status(401).send({message: "Your need to activate your account, please check you email"})
                }

                const token = jsonwebtoken.sign({_id: user._id}, key, {expiresIn: "1h"})
                // after authorization, send the token to the client as cookies
                res.cookie('access_token', token, {sameSite: 'none', secure: true}).status(200).json({message: "Signin successfully"})
            } else {
                res.status(401).send({message: "Password is incorrect"})
            }
        }
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

async function logout (req, res) {
    res.clearCookie('access_token').status(200).json({message: "Logout successfully"})
}

async function activate(req, res) {
    try {
        const user = await User.findOne({
            verificationToken: req.params.verificationToken
        })
        if (!user) {
            return res.status(404).send({message: "No such user"})
        } 

        user.status = "Active";
        await user.save()

        res.status(200).send({message: "Activate your account successfully"})
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

async function resetPasswordRequest (req, res) {

    const email = req.body.email;

    try {

        const user = await User.findOne({email: email})
        if (!user) {
            return res.status(404).send({message: "User not exist"});
        }
        // check token existence 
        const token = await Token.findOne({userId: user._id})

        if (token) {
            await token.deleteOne();
        }
        
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, 10);

        await new Token({
            userId: user._id,
            token: hash,
            createdAt: Date.now(),
        }).save();

        sendResetPassword(user.email, user._id, resetToken, res);
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}


async function resetPassword (req, res) {

    const userId = req.body.userId;
    const password = req.body.password;
    const resetToken = req.body.resetToken;
    
    try {
        // get the reset token
        const token = await Token.findOne({userId: userId});
        if (!token) {
            return res.status(404).send({message: "reset token not exist, please request again"});
        }

        // check the token is valid
        const isValid = await bcrypt.compare(resetToken, token.token);

        if (!isValid) {
            return res.status(401).send({message: "reset token is invalid"});
        }

        // hash the password
        const hashPassword = bcrypt.hashSync(password);

        // update the password
        const user = await User.findOneAndUpdate({_id: userId}, {password: hashPassword});
        if (!user) {
            return res.status(404).send({message: "User not exist"});
        } else {
            await token.deleteOne();
            res.status(200).send({message: "Password was reset successfully, please login"});
        }
    } catch (err) {
        return res.status(500).send({message: err.message});
    }
}

module.exports = {
    signup,
    signin,
    activate,
    logout,
    resetPasswordRequest,
    resetPassword
}


