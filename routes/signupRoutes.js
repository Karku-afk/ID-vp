const express = require('express');

const router = express.Router();


//kasutatavad kontrollerid

const {
	signupPage,
	signupPagePost} = require('../controllers/signupControllers');

router.route('/').get(signupPage);

//post osa suunatakse läbi vahevara - upload

router.route('/').post(signupPagePost);



module.exports = router;