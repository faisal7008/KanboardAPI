const express = require('express');
const router = express.Router(); // Create a new router instance
const { getUserProfile, googleLogin, handleGoogleCallback, googleLogout } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Routes related to user authentication

// Route to initiate Google Sign-In flow
// Method: GET
// URL: /auth/google
router.get('/google', googleLogin);

// Callback route after successful Google authentication
// Method: GET
// URL: /auth/google/callback
router.get('/google/callback', handleGoogleCallback);

// Route to get user profile.
// Method: GET
// URL: /auth/profile
// Middleware: verifyToken (to verify authentication)
router.get('/profile', verifyToken, getUserProfile);

// Route to handle user sign-out.
// Method: GET
// URL: /auth/logout
// Middleware: verifyToken (to verify authentication)
router.get('/logout', verifyToken, googleLogout);

module.exports = router;
