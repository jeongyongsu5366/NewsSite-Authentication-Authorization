const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { localUser, registerValidation, loginValidation } = require('../models/localUser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const router = express.Router();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router.get('/login', (req, res) => {
	res.render('login', { user: req.user });
});

router.get('/register', (req, res) => {
	res.render('register');
});

// Auth with google+
router.get('google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
	// res.send(req.user);
	res.redirect('/profile');
});
