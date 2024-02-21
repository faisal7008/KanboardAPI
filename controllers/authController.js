require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SECRET;

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = 'http://localhost:9000/auth/google/callback';

// Create OAuth2Client instance with Google credentials
const client = new OAuth2Client({
  clientId: googleClientId,
  clientSecret: googleClientSecret,
  redirectUri: redirectUri,
});

// To initiate Google Sign-In flow
const googleLogin = (req, res) => {
  // Generate authentication URL
  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  });
  // Redirect to Google Sign-In
  res.redirect(authUrl);
}

const generateAvatar = () => {
  const seed = ["Fluffy","Bella","Leo","Annie","Whiskers","Willow","Oliver","Midnight","Bandit","Pepper","Zoey","George","Sassy","Pumpkin","Zoe","Simon"]
  // Generate a random index
  const index = Math.floor(Math.random() * seed.length);
  return `https://api.dicebear.com/7.x/bottts/png?seed=${seed[index]}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf`
}

// To handle Google Sign-In callback
const handleGoogleCallback = async (req, res) => {
  try {
    const code = req.query.code;  // Extract authorization code from request query
    const { tokens } = await client.getToken(code);
    // console.log(tokens)
    // Verify ID token
    const userInfo = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: googleClientId
    });

    // Extract user information from the verified token payload
    const payload = userInfo.getPayload();
    const googleId = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];
    const avatar = generateAvatar();
    // Check if user already exists in the database
    let user = await User.findOne({ googleId });

    // If user doesn't exist, create a new user
    if (!user) {
      user = new User({
        googleId,
        name,
        email,
        avatar
      });
      await user.save();
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id, accessToken: tokens.access_token }, jwtSecret, {
      expiresIn: 86400, // expires in 24 hours
    });

    // res.set('Authorization', `Bearer ${token}`);
    // res.redirect(process.env.CLIENT_URL);
    res.status(201).json({ message: 'Google login successful. You are now authenticated.', token });
    // Redirect user to client URL with token as query parameter
    // res.redirect(`${process.env.CLIENT_URL}?token=${token}`)
  } catch (error) {
    console.error('Error verifying ID token:', error);
    res.status(500).json({ message: 'Failed to verify ID token', details: error.message });
  }
}

// To get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId; // check verifyToken middleware

    // Find the user by their ID in the database
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ message: "Internal server error", details: error.message });
  }
};

// For Google logout
const googleLogout = async (req, res) => {
  try {
    const accessToken = req.accessToken; // check verifyToken middleware

    // Check if access token is provided
    if(!accessToken){
      return res.status(400).send({ message: "accessToken is required" });
    }
    // Revoke the access token
    await client.revokeToken(accessToken);
    
    // Respond with a success message
    res.status(200).json({ success: true, message: 'Google logout successful.' });
  } catch (error) {
    console.error('Error revoking access token:', error);
    res.status(500).json({ success: false, message: 'Failed to logout from Google.', details: error.message });
  }
};


module.exports = { googleLogin, handleGoogleCallback, getUserProfile, deleteProfile, googleLogout };
