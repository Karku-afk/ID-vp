const express = require('express');

const fs = require('fs').promises;
//moodul POST päringute lahtiharutamiseks, parsimiseks
const bodyparser = require('body-parser');
//moodul andmebaasiga suhtlemiseks (koos async ehk ootamise osaga)
const mysql = require('mysql2/promise');
//moodul .env koskkonnamuutujate lugemiseks
require('dotenv').config();
const session = require('express-session');

const checkLogin = require('./src/checkLogin');

const dateET = require('./src/dateTimeET');

const textRef = "public/txt/vanasonad.txt";

const regtextRef = "public/txt/visits.txt";


//käivitan funktsiooni express() ja annan nimeks app
const app = express();
//võtame kasutusele sessioonihalduri
app.use(session({secret:process.env.SES_SECRET, saveUnitialized: false, resave: true}));
//määrame renderusmootori: EJS
app.set('view engine', 'ejs');
//määrame avalikuna kasutatava kataloogi
app.use(express.static('public'));
//määrame vormide sisu parsimiseks, kui false, siis ainult tekst
app.use(bodyparser.urlencoded({extended: true}));

//marsruudid
app.get('/', (req, res)=>{
	//const dayNow = dateET.day();
	const dateNow = dateET.date(0);
	const timeNow = dateET.time();
	//res.send('Express.js veeb läkski tööle!');
	res.render('index', {dateNow: dateNow, timeNow: timeNow});
});

//sisseloginud kasutajate avaleht

app.get('/home', checkLogin.isLogin, (req, res) => {
	res.render('home');
});

app.get('/logout', (req, res) => {
	//hävitame sessiooni
	req.session.destroy();
	res.redirect('/');
});

app.get('/vanasona', async (req, res)=>{
	try {
		const data = await fs.readFile(textRef, "utf8");
		let folkWisdom = data.split(";");
		res.render('vanasona', {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]});
	}
	catch (err){
		console.log(err);
		res.render('vanasona', {wisdom: 'Kahjuks ei leidnud ühtegi vanasõna'});	
	}
});

app.get('/regvisit', (req, res)=>{
    res.render('regvisit');
});

app.post('/regvisit', async (req, res)=>{
    try {
        // külastuse kuupäev ja kellaaeg dateFindET.js moodulist
        const visitDate = dateET.date();
        const visitTime = dateET.time();
        await fs.appendFile(regtextRef, req.body.inputName + ', ' + visitDate + ', ' + visitTime + ';');
				// kõige uuem avalik foto (privaatsus 3), mida pole kustutatud
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		const sqlReq = 'SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)';
		const [sqlRes] = await conn.execute(sqlReq, [3]);
		let photoAlt = sqlRes[0].alttext;
		if(!photoAlt) {
			photoAlt = 'Uusim avalik foto';
		}
		res.render('index', {lastVisit: 'Viimati registreeriti külastus ' + lastVisitParts[1].trim() + ', kell ' + lastVisitParts[2].trim() + ' kui seda tegi ' + lastVisitParts[0].trim(), dayNow: dayNow, dateNow: dateNow, timeNow: timeNow, photoFile: sqlRes[0].filename, photoAlt: photoAlt});
        res.render('regvisit');
    } catch (err){
        console.log(err);
    }
});




app.get('/huvitav', (req, res)=>{
    res.render('huvitav');
});

const galleryPhotoRouter = require('./routes/galleryPhotoRoutes');
app.use('/galleryPhotos', galleryPhotoRouter);

//Eesti filmi marsruudid
const eestiFilmRouter = require('./routes/eestifilmRoutes');
app.use('/eestifilm', eestiFilmRouter);


//galeriipiltide üleslaadimine

const galleryPhotoUploadRouter = require('./routes/galleryPhotoUploadRoutes');
app.use('/galleryPhotoUpload', galleryPhotoUploadRouter);

//kasutajakonto loomine

const signupRouter = require('./routes/signupRoutes');
app.use('/signup', signupRouter);

//sisselogimine

const signinRouter = require('./routes/signinRoutes');
app.use('/signin', signinRouter);

app.listen(5219);
