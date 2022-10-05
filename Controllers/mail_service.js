const nodemailer = require('nodemailer')
require('dotenv').config();
const email = process.env.email;
const password = process.env.password;
const publicURI = process.env.publicURI;

const mailService = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: email,
        pass: password
    }
})


function sendEmail (username, useremail, verificationToken, res) {
    mailService.sendMail({
        from: email,
        to: useremail,
        subject: "Activate your account",
        html:  
            `<h1>Account activation</h1>
             <h2>Hello ${username}</h2>
             <p>Please activate your account by clicking on the following link</p>
             <a href=${publicURI}/api/auth/activate/${verificationToken}> Click here</a>
             </div>`
    }).then(() => {
        res.status(200).send({message: "User was registered successfully and email has been sent, please activate your account"})
    })
    .catch(err => console.log(err))
}



function sendResetPassword (useremail, userId, resetToken, res) {
    mailService.sendMail({
        from: email,
        to: useremail,
        subject: "Reset your password",
        html:
        `<h1>Reset your password</h1>
        <p>You can reset your password by clicking on the following link</p>
        <a href=${publicURI}/resetPassword?resetToken=${resetToken}&userId=${userId}>Click here</a>
        </div>`
    }).then(() => {
        res.status(200).send({message: "Reset password link was sent to your email, the link is valid for 1h "})
    }).catch(() => {
        res.status(500).send({message: "Something went wrong"})
    })
}

module.exports = {sendEmail, sendResetPassword}