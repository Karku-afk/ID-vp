const mysql = require('mysql2/promise');

const argon = require('argon2');

//@desc page for logging in
//@route GET /signin
//@access public

const signinPage =(req, res) => {
	res.render('signin', {notice: 'Sisesta oma kasutajatunnus ja salasõna'});

};

const signinPagePost = async(req, res) => {
	//console.log(req.file);
	//console.log(req.body);
	let conn;
	//andmete puhastamine ja valideerimine
	
	if(!req.body.emailInput || !req.body.passwordInput){
		return res.render('signin',{notice:'Konto andmed on sisestamata'})
	}



	try{

		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
	

	
		//andrus going crazy
		let sqlReq = 'SELECT id, password FROM users WHERE email = ?';
		const [users] = await conn.execute(sqlReq, [req.body.emailInput]);
		//kui sellist üldse ei leitud
		if(users.length === 0){
		return res.render('signin', {notice: 'Kasutajatunnus ja/või salasõna on vale'});
	}
		const user = users[0];
		//parooli kontrollimine
		const match = await argon.verify(user.password, req.body.passwordInput);
		if (match) {
			console.log('oled sisse loginud kasutajana: ' + user.id);
			//paneme sessiooni käima ja salvestame sessiooni muutujad;
			req.session.userId = user.id
			return res.redirect('/home');
		} else {
			return res.render('signin', {notice: 'Sisselogimine ei õnnestunud'});
		}
	}
	

	catch(err) {
		console.log('Viga ' + err);
		res.render('signin', {notice: 'Sisselogimine ei õnnestunud'});
	}
	
	finally {
		if(conn){
			await conn.end();
		}
	}
};




module.exports = {
	signinPage,
	signinPagePost
}