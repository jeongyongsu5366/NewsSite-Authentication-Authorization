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

router.post('/register', async (req, res) => {
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	// Checking if the user is already in the DataBase
	const emailExist = await localUser.findOne({ email: req.body.email });
	if (emailExist) return res.status(400).send('Email Already Exists');

	// Hash the password
	// The complexity of the string that this has algorithm get generated
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	// Create A New User
	const localuser = new localUser({
		name: req.body.name,
		email: req.body.email,
		password: hashPassword
	});

	try {
		// Stores on DB
		await localuser.save();
		console.log('Welcome! Congratulation on your registration!');
		res.redirect('/auth/login');
	} catch (err) {
		res.status(400).send(err);
	}
});

router.post('/login', async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await localUser.findOne({ email: req.body.email });
	if (!user) return res.status(400).send('Email or Passowrd is wrong');
	// Check if password is correct
	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send('Invalid Password');

	// Right After validating Password, we're going to res.send jwt
	// res.send('Logged in'!);
	const payload = {
		_id: user._id,
		isAdmin: user.isAdmin,
		email: user.email
	};
	const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 86400 });
	res.cookie('auth_token', token, { maxAge: 86400, httpOnly: true });
	console.log(user);
	res.status(200).render('homepage', { user: user });
});

module.exports = router;
