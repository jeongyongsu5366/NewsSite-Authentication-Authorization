const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => console.log('Connected to MongoDB!!'));

app.use('/', (req, res) => {
	res.render('homepage', { user: req.user });
});

app.use((err, req, res, next) => {
	res.json(err);
});

app.listen(3000, () => {
	console.log('App now listening for requests on port 3000');
});
