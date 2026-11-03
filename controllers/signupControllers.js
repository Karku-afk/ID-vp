const mysql = require('mysql2/promise');
const validator = require('validator');
const argon = require('argon2');

//@desc page creating user account
//@route GET /signup
//@access public

const signupPage =(req, res) => {
	res.render('signup', {notice: 'Ootan andmeid'});

};

const signupPagePost = async(req, res) => {
	//console.log(req.file);
	//console.log(req.body);
	let conn;
	//andmete puhastamine ja valideerimine
	const firstName = validator.escape(req.body.firstNameInput.trim());
	const lastName = validator.escape(req.body.lastNameInput.trim());
	const birthDate = req.body.birthDateInput;
	const gender = req.body.genderInput;
	const email = req.body.emailInput.trim();
	const password = req.body.passwordInput;
	const confirmPassword = req.body.confirmPasswordInput;
	
	//kontrollime kas kõik oluline on olemas
	
	if(!firstName || !lastName || !birthDate || !gender || !email || !password || !confirmPassword){
		notice = 'Andmeid on puudu või miski pole korrektne';
		return res.render('signup', {notice: notice});
	}
	
	//kas email on korrektne
	
	if(!validator.isEmail(email)){
		notice = 'Emaili aadress pole korrektne';
		return res.render('signup', {notice: notice});
	}

	//kas parool on piisavalt tugev
	const passwordOptions = {minLength: 8, minLowerCase: 1, minUpperCase: 1, minNumbers: 1, minSymbols:0};
		if(!validator.isStrongPassword(password, passwordOptions)){
		notice = 'Valitud salasõna on liiga nõrk';
		return res.render('signup', {notice: notice});
	}
	
	//kas paroolid ühtivad?
	
	if (password !== confirmPassword){
		notice = 'Sisestatud salasõnad ei ole ühesugused';
		return res.render('signup', {notice: notice});
	}
	
	//kas sünnikuupäev on korrektne
	
	if(!validator.isDate(birthDate) || validator.isAfter(birthDate)){
		notice = 'Valitud sünnikuupäev pole korrektne';
		return res.render('signup', {notice: notice});
	}



	try{

		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		res.render('signup', {notice: 'Andmed tulevad'});

	
	//kontrollin kas selline kasutaja on äkki juba olemas
	let sqlReq = 'SELECT id FROM users WHERE email = ?'
	const [users] =await conn.execute(sqlReq, [email]);
	if(users.length > 0){
		notice = 'Selline kasutaja on juba olemas';
		return res.render('signup', {notice: notice});
	}
	
	
	//krüpteerime parooli
	const pwdHash = await argon.hash(password);
	
	sqlReq = 'INSERT INTO users (firstname, lastname, birthdate, gender, email, password) VALUES (?,?,?,?,?,?)';
	const [result] = await conn.execute(sqlReq, [
		firstName,
		lastName,
		birthDate,
		gender,
		email,
		pwdHash
	]);
	
	res.render('signup', {notice: 'kasutajakonto loodud'});
	}
	
	
	catch(err) {
		console.log('Viga ' + err);
		res.render('signup', {notice: 'kasutajakonto loomine ei õnnestunud'});
	}
	
	finally {
		if(conn){
			await conn.end();
		}
	}
};




module.exports = {
	signupPage,
	signupPagePost
}