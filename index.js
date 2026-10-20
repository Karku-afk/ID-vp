const express = require('express');

const fs = require('fs').promises;
//moodul POST päringute lahtiharutamiseks, parsimiseks
const bodyparser = require('body-parser');
//moodul andmebaasiga suhtlemiseks (koos async ehk ootamise osaga)
const mysql = require('mysql2/promise');
//moodul .env koskkonnamuutujate lugemiseks
require('dotenv').config();

const dateET = require('./src/dateTimeET');

const textRef = "public/txt/vanasonad.txt";

const regtextRef = "public/txt/visits.txt";


//käivitan funktsiooni express() ja annan nimeks app
const app = express();
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
        res.render('regvisit');
    } catch (err){
        console.log(err);
    }
});
app.get('/huvitav', (req, res)=>{
    res.render('huvitav');
});

//Eesti filmi marsruudid
const eestiFilmRouter = require('./routes/eestifilmRoutes');
app.use('/eestifilm', eestiFilmRouter);


//galeriipiltide üleslaadimine

const galleryPhotoUploadRouter = require('./routes/galleryPhotoUploadRoutes');
app.use('/galleryPhotoUpload', galleryPhotoUploadRouter);

app.listen(5219);
