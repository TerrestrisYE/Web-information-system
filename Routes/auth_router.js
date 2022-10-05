
const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const authController = require("../Controllers/auth_controller");
const { authorization } = require("../Middleware/authorization");
const { uniqueEmail, uniqueUsername } = require("../Middleware/signupMiddle");

router.post('/signup',[uniqueEmail, uniqueUsername], authController.signup );
router.get('/activate/:verificationToken', authController.activate)
router.post('/resetPassword', authController.resetPasswordRequest)
router.post('/reset', authController.resetPassword)

router.post('/login', authController.signin );
router.get('/logout', authorization, authController.logout);

module.exports = router;