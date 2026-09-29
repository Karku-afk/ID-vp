const express = require("express");
const dateET = require("./src/dateTimeET");

//moodul post päringute lahtiharutamiseks, parsimiseks
const bodyparses = require("body-parser");

//vanasonad hahahahahaahahahahahahahaha
const fs = require ("fs").promises;
const textRef = "public/txt/vanasonad.txt";
//käivitan funktsiooni express() ja annan nimeks appCodeName

const app = express();

//määrame renderdusmootori: EJS

app.set("view engine", "ejs");

//määrame avalikuna kasutatava kataloogi

app.use(express.static("public"));

//määrame vormide sisu parsimise
app.use(bodyparser.urlencoded({extended: false}));

//marsruudid

app.get("/", (req, res)=>{
	
	const dayNow = dateET.day();
	const dateNow = dateET.date(0);
	const timeNow = dateET.time();
	//res.send("Express.js veeb läkski käima");
	res.render("index", {dayNow : dayNow, dateNow: dateNow, timeNow: timeNow});
});

app.get("/vanasona", async (req, res)=>{
	try {
		const data = await fs.readFile(textRef, "utf8");
		let folkWisdom = data.split(";");
		res.render("vanasona", {wisdom: folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))]});
	}
	catch (err) {
		console.log(err);
		res.render("vanasona", {wisdom: "Kahjuks ei leidnud ühtegi vanasõna"});
	}
});

app.get("/regvisit", (req, res)=>{
	res.render("regvisit");

app.post("/regvisit", async (req, res)=>{
	try {
		await fs.open(regtextRef, "a");
		await fs.appendFile(regtextRef, req.body.inputName + ";");
		res.render("regvisit");
	}
	catch (err) {
		console.log(err);
		res.render("regvisit");
	}


	
app.listen(5219);