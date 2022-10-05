const User = require('../Models/user').userModel;
const fs = require("fs")
const path = require("path")
const jimp = require("jimp");


async function uploadProfilePhoto (req, res) {

    const user = await User.findOne({_id: req.user._id})
    
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../public/uploads/" + req.user._id + ".png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        fs.rename(tempPath, targetPath, function (err) {

        if (err) {
            return res.status(500).send({message: err.message})
        }
        user.profilePhoto = true;
        user.save();

        jimp.read(targetPath).then(function (image) {
            newImage = image;
            return jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        }).then(function (font) {
            newImage.print(font, 40, 40, "wowwow");
            newImage.write(targetPath);
            return res.redirect("/profile");
            //return res.status(200).send({message: "Profile photo was uploaded successfully"})
        }).catch(function (err) {
            console.error(err);
            return res.status(400).send({message: "Error"});
        })
        })

    } else {
        fs.unlink(tempPath, function (err) {

        if (err) {
            return res.status(500).send({message: err.message});
        }
        return res.status(400).send({message: "Only .png files are allowed!"});
        })
    }
}


async function uploadProfilePhotoTest (req, res) {

    
    
    const tempPath = req.file.path;
    console.log(tempPath)
    const targetPath = path.join(__dirname, "../public/uploads/" + "1" + ".png");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        fs.rename(tempPath, targetPath, function (err) {

        if (err) {
            return res.status(500).send({message: err.message})
        }

        let newImage;

        // add watermark to the image
        jimp.read(targetPath).then(function (image) {
            newImage = image;
            return jimp.loadFont(jimp.FONT_SANS_32_BLACK);
        }).then(function (font) {
            newImage.print(font, 40, 40, "wowwow");
            newImage.write(targetPath);

            // redirect to profile page
            return res.redirect("/profile");
        }).catch(function (err) {
            console.error(err);
            return res.status(400).send({message: "Error"});
        })
        })
    } else {
        fs.unlink(tempPath, function (err) {

        if (err) {
            return res.status(500).send({message: err.message});
        }
        return res.status(400).send({message: "Only .png files are allowed!"});
        })
    }
}


async function getProfilePhoto (req, res) {
    const user = await User.findOne({_id: req.user._id});
    if (user.profilePhoto) {
        // send png file url to the client
        return res.status(200).send({
            url: "/uploads/" + req.user._id + ".png"
        })

        // res.setHeader('Content-Type', 'image/png');
        // res.sendFile(path.join(__dirname, "../public/uploads/" + req.user._id + ".png"));
    } else {
        return res.status(200).send({
            url: "/uploads/default.png"
        })
    }
}


async function updateUser (req, res) {

    // retrieve the email from the body
    const email = req.body.email;
    // check whether the email is unique
    const user = await User.findOne({email: email});
    if (user) {
        // find the current user email 
        const currentUser = await User.findOne({_id: req.user._id});
        // if the email is not the same as the current user email
        if (currentUser.email == email) {
            return res.status(400).send({message: "Email has no change"});
        }

        return res.status(400).send({message: "Email is already in use"});
    } else {
        // update the user
        const user = await User.findOneAndUpdate({_id: req.user._id}, {}, {new: true});
        user.email = req.body.email;
        user.save();
        return res.status(200).send({message: "User was updated successfully"});
    }
}

async function getProfile (req, res) {

    // retrieve the user
    const user = await User.findOne({_id: req.user._id});
    // return the user
    return res.status(200).send({
        username: user.username,
        email: user.email
    });

}


module.exports={getProfilePhoto, uploadProfilePhoto, updateUser, getProfile, uploadProfilePhotoTest}