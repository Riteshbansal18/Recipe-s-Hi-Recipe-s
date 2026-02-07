const express = require('express');
const router= express.Router();
const upload = require("../middlewares/upload.middleware"); 

const authController = require("../controllers/auth.controller");

router.post('/signup',upload.single('profileImage'), authController.addNewUser);

router.post('/login', authController.loginUser);

router.get('/logout', authController.logoutUser);


module.exports = router;