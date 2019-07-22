const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const app = express();
const cookieParser = require('cookie-parser');
const querystring = require('querystring');
const login = require('./routes/auth-rotues');
const passport = require('passport');
const dotenv = require('dotenv');
const passportSetup = require('./config/passport-setup');
const profile = require('./routes/profile-routes');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('Connected to MongoDB!!'));

app.use(
	cookieSession({
		maxAge: 24 * 60 * 60 * 1000,
		keys: [process.env.cookieKey]
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/auth', login);
app.use('/profile', profile);

app.use('/', (req, res) => {
	res.render('homepage', { user: req.user });
});

app.use((err, req, res, next) => {
	res.json(err);
});

app.listen(3000, () => {
	console.log('App now listening for requests on port 3000');
});
