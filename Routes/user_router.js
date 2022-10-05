const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user_controller");
const authorization = require("../Middleware/authorization");

const multer = require("multer");

const upload = multer({
    dest: "./public/uploads/",
})

router.post('/upload', [authorization.authorization, upload.single("profilePhoto")], userController.uploadProfilePhoto);
router.get('/profilePhoto', [authorization.authorization], userController.getProfilePhoto);

router.post("/update", [authorization.authorization], userController.updateUser);
router.get("/getProfile", [authorization.authorization], userController.getProfile);

router.post("/uploadTest", [upload.single("profilePhoto")], userController.uploadProfilePhotoTest);
module.exports = router;