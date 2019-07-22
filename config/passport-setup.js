const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const googleUser = require('../models/googleUser');

dotenv.config();

passport.use(
	new GoogleStrategy({
		// options for google strategy
		clientID: process.env.clientID,
		clientSecret: process.env.clientSecret,
		callbackURL: '/auth/google/redirect'
	})
);
