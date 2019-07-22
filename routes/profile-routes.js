const router = require('express').Router();
const authCheck = require('../middleware/verifyToken');
const express = require('express');
const jwtDecode = require('jwt-decode');

router.get('/', authCheck, (req, res) => {
	if (req.cookies.auth_token) {
		const token = req.cookies.auth_token;
		const decoded = jwtDecode(token);
		const decodedData = {
			email: decoded.email
		};
		res.render('profile', { user: decodedData });
	} else {
		console.log('dwd', req.user);
		res.render('profile', { user: req.user });
	}
});

module.exports = router;
