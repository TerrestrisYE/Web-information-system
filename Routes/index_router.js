const path = require("path")
const express = require("express");
const router = express.Router();


router.get('/login', function (req, res) {
	res.sendFile(path.join(__dirname, '../public/html/login.html'));
})

router.get('/profile', function (req, res) {
	res.sendFile(path.join(__dirname, '../public/html/profile.html'));
})

router.get('/ask', function (req, res) {
	res.sendFile(path.join(__dirname, '../public/html/ask.html'));
})

router.get('/home', function (req, res) {
	res.sendFile(path.join(__dirname, '../public/html/home.html'));
})

router.get('/reset', function (req, res) {
	res.sendFile(path.join(__dirname, '../public/html/reset.html'));
})

router.get('/resetPassword', function (req, res) {
	res.sendFile(path.join(__dirname, '../public/html/resetPassword.html'));
})


module.exports = router;