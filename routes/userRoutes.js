const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();
// authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// add protect middleware to coming stacks (to make sure user is logged in)
router.use(authController.protect);

// get current user information
router.get('/me', userController.me);

router.patch('/update-me', userController.updateMe);

router.delete('/delete-me', userController.deleteMe);

module.exports = router;
