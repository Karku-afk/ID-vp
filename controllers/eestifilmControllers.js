const mysql = require('mysql2/promise');

//@desc homepage for Estonian Film section
//@route GET /eestifilm
//@access public

const eestifilm =(req, res) => {
	res.render('eestifilm');
};



//@desc homepage for people involved in Estonian Film industry
//@route GET /eestifilm/inimesed
//@access public

//app.get('/eestifilm/inimesed', async (req, res)=>{
const inimesed = async (req, res) => {
	let conn; //connection
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		//defineerime SQL päringu
		let sqlReq = 'SELECT * FROM person';
		const [sqlRes] = await conn.execute(sqlReq);
		console.log(sqlRes);
			res.render('eestifilminimesed', {personList: sqlRes});
	}
	catch (err) {
		console.log('andmebaasiga suhtlemise viga' + err);
		res.render('eestifilminimesed', {personList: []});
	}

finally {
	if(conn){
		await conn.end();
	}
}
};

//@desc homepage for people involved in Estonian Film industry
//@route GET /eestifilm/inimesed_lisa
//@access public

/* app.get('/eestifilm/inimesed_lisa', (req, res)=>{ */
const inimesedAdd = async (req, res) => {
	res.render('eestifilminimesed_lisa', {
        notice: "Ootan sisestust",
        firstName: null,
        lastName: null,
        born: null,
        deceased: null,
        firstNameError: null,
        lastNameError: null,
        bornError: null,
        deceasedError: null
    });
};

	
//@desc homepage for people involved in Estonian Film industry
//@route POST /eestifilm/inimesed_lisa
//@access public

/* app.post('/eestifilm/inimesed_lisa', async (req, res)=>{ */
const inimesedAddPost = async (req, res) => {
	console.log(req.body);
	//kontrollime andmeid, iga sisendit eraldi
	let inputValid = true;
	let firstNameError = null;
	let lastNameError = null;
	let bornError = null;
	let deceasedError = null;
	const timeNow = new Date ();
	//sisestatud sünnikuupäev (tekst) teisendada kuupäevaks
	const bornDate = new Date (req.body.bornInput);
	let bornValid = true;

	if(!req.body.firstNameInput){
		firstNameError = "Eesnimi on sisestamata";
		inputValid = false;
	}
	if(!req.body.lastNameInput){
		lastNameError = "Perekonnanimi on sisestamata";
		inputValid = false;
	}
	if(!req.body.bornInput){
		bornError = "Sünnikuupäev on sisestamata";
		bornValid = false;
		inputValid = false;
	}
	else if(isNaN(bornDate.getTime())){
		bornError = "Sünnikuupäev ei ole reaalne kuupäev";
		bornValid = false;
		inputValid = false;
	}
	else if(bornDate > timeNow){
		bornError = "Sünnikuupäev ei saa olla tulevikus";
		bornValid = false;
		inputValid = false;
	}

	let deceasedDate = null;
	
	if(req.body.deceasedInput != ""){
		deceasedDate = req.body.deceasedInput;
		//sisestatud surmakuupäev (tekst) teisendada kuupäevaks
		const deceasedTime = new Date (req.body.deceasedInput);
		if(isNaN(deceasedTime.getTime())){
			deceasedError = "Surmakuupäev ei ole reaalne kuupäev";
			inputValid = false;
		}
		else if(deceasedTime > timeNow){
			deceasedError = "Surmakuupäev ei saa olla tulevikus";
			inputValid = false;
		}
		else if(bornValid && deceasedTime < bornDate){
			deceasedError = "Surmakuupäev ei saa olla varasem kui sünnikuupäev";
			inputValid = false;
		}
	}

	if(!inputValid){
		console.log("Andmed pole korrektsed");
		return res.render("eestifilminimesed_lisa", {
			notice: "Ootan sisestust",
			firstName: req.body.firstNameInput,
			lastName: req.body.lastNameInput,
			born: req.body.bornInput,
			deceased: req.body.deceasedInput,
			firstNameError: firstNameError,
			lastNameError: lastNameError,
			bornError: bornError,
			deceasedError: deceasedError
		});
	}

	let conn;
	try{
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
	});
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)";
	await conn.execute(sqlReq, [
	req.body.firstNameInput,
	req.body.lastNameInput,
	req.body.bornInput,
	deceasedDate
	]);
	res.render("eestifilminimesed_lisa", {
		notice: req.body.firstNameInput + " " + req.body.lastNameInput + "andmebaasi lisatud",
		firstName: null,
		lastName: null,
		born: null,
		deceased: null,
		firstNameError: null,
		lastNameError: null,
		bornError: null,
		deceasedError: null
	});
	}
	catch(err){
		console.log("Viga andmebaasiga suhtlemisel");
		res.render("eestifilminimesed_lisa", {
			notice: "Viga andmebaasiga suhtlemisel",
			firstName: req.body.firstNameInput,
			lastName: req.body.lastNameInput,
			born: req.body.bornInput,
			deceased: req.body.deceasedInput,
			firstNameError: null,
			lastNameError: null,
			bornError: null,
			deceasedError: null
		});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};


/* app.get('/eestifilm/filmid_lisa', (req, res)=>{ */
const filmidAdd = async (req, res) => {
    res.render('eestifilmfilmid_lisa', {
        notice: "Ootan sisestust",
        title: null,
        releaseYear: null,
        duration: null,
        description: null,
        titleError: null,
        releaseYearError: null,
        durationError: null,
        descriptionError: null
    });
};


/* app.post('/eestifilm/filmid_lisa', async (req, res)=>{ */
const filmidAddPost = async (req, res) => {
	console.log(req.body);
	//kontrollime andmeid, iga sisendit eraldi
	let inputValid = true;
	let titleError = null;
	let releaseYearError = null;
	let durationError = null;
	let descriptionError = null;
	const yearNow = new Date().getFullYear();
	const titleText = String(req.body.titleInput || "").trim();
	const yearText = String(req.body.releaseYearInput || "").trim();
	const durationText = String(req.body.durationInput || "").trim();
	const descriptionText = String(req.body.descriptionInput || "").trim();

	if(titleText === ""){
		titleError = "Pealkiri on sisestamata";
		inputValid = false;
	}
	else if(titleText.length > 100){
		titleError = "Pealkiri on liiga pikk (kuni 100 märki)";
		inputValid = false;
	}

	if(yearText === ""){
		releaseYearError = "Valmimisaasta on sisestamata";
		inputValid = false;
	}
	else if(!/^[0-9]+$/.test(yearText) || Number(yearText) < 1){
		releaseYearError = "Valmimisaasta peab olema positiivne täisarv";
		inputValid = false;
	}
	else if(Number(yearText) > yearNow){
		releaseYearError = "Valmimisaasta ei saa olla tulevikus";
		inputValid = false;
	}

	if(durationText === ""){
		durationError = "Kestus on sisestamata";
		inputValid = false;
	}
	else if(!/^[0-9]+$/.test(durationText) || Number(durationText) < 1){
		durationError = "Kestus peab olema täisarv, mis on suurem kui 0";
		inputValid = false;
	}

	if(descriptionText.length > 1000){
		descriptionError = "Kirjeldus on liiga pikk (kuni 1000 märki)";
		inputValid = false;
	}

	if(!inputValid){
		console.log("Andmed pole korrektsed");
		return res.render("eestifilmfilmid_lisa", {
			notice: "Ootan sisestust",
			title: req.body.titleInput,
			releaseYear: req.body.releaseYearInput,
			duration: req.body.durationInput,
			description: req.body.descriptionInput,
			titleError: titleError,
			releaseYearError: releaseYearError,
			durationError: durationError,
			descriptionError: descriptionError
		});
	}

	let descriptionValue = null;
	if(descriptionText !== ""){
		descriptionValue = descriptionText;
	}

	let conn;
	try{
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReq = "INSERT INTO movie (title, release_year, duration_minutes, description) VALUES (?, ?, ?, ?)";
		await conn.execute(sqlReq, [
			titleText,
			Number(yearText),
			Number(durationText),
			descriptionValue
		]);
		res.render("eestifilmfilmid_lisa", {
			notice: titleText + " andmebaasi lisatud",
			title: null,
			releaseYear: null,
			duration: null,
			description: null,
			titleError: null,
			releaseYearError: null,
			durationError: null,
			descriptionError: null
		});
	}
	catch(err){
		console.log("Viga andmebaasiga suhtlemisel");
		res.render("eestifilmfilmid_lisa", {
			notice: "Viga andmebaasiga suhtlemisel",
			title: req.body.titleInput,
			releaseYear: req.body.releaseYearInput,
			duration: req.body.durationInput,
			description: req.body.descriptionInput,
			titleError: null,
			releaseYearError: null,
			durationError: null,
			descriptionError: null
		});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

/* app.get('/eestifilm/ametid_lisa', (req, res)=>{ */
const ametidAdd = async (req, res) => {
    res.render('eestifilmametid_lisa', {
        notice: "Ootan sisestust",
        title: null,
        description: null,
        titleError: null,
        descriptionError: null
    });
};

/* app.post('/eestifilm/ametid_lisa', async (req, res)=>{ */
const ametidAddPost = async (req, res) => {
	console.log(req.body);
	//kontrollime andmeid, iga sisendit eraldi
	let inputValid = true;
	let titleError = null;
	let descriptionError = null;
	const titleText = String(req.body.titleInput || "").trim();
	const descriptionText = String(req.body.descriptionInput || "").trim();

	if(titleText === ""){
		titleError = "Nimetus on sisestamata";
		inputValid = false;
	}
	else if(titleText.length > 50){
		titleError = "Nimetus on liiga pikk (kuni 50 märki)";
		inputValid = false;
	}

	if(descriptionText.length > 1000){
		descriptionError = "Kirjeldus on liiga pikk (kuni 1000 märki)";
		inputValid = false;
	}

	if(!inputValid){
		console.log("Andmed pole korrektsed");
		return res.render("eestifilmametid_lisa", {
			notice: "Ootan sisestust",
			title: req.body.titleInput,
			description: req.body.descriptionInput,
			titleError: titleError,
			descriptionError: descriptionError
		});
	}

	let descriptionValue = null;
	if(descriptionText !== ""){
		descriptionValue = descriptionText;
	}

	let conn;
	try{
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
		let sqlReq = "INSERT INTO profession (title, description) VALUES (?, ?)";
		await conn.execute(sqlReq, [
			titleText,
			descriptionValue
		]);
		res.render("eestifilmametid_lisa", {
			notice: titleText + " andmebaasi lisatud",
			title: null,
			description: null,
			titleError: null,
			descriptionError: null
		});
	}
	catch(err){
		console.log("Viga andmebaasiga suhtlemisel");
		res.render("eestifilmametid_lisa", {
			notice: "Viga andmebaasiga suhtlemisel",
			title: req.body.titleInput,
			description: req.body.descriptionInput,
			titleError: null,
			descriptionError: null
		});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
};

/* app.get('/lastvisit', async (req, res)=>{ */
const visitAdd = async (req, res) => {
    try {
        const rawText = await fs.readFile(regtextRef, 'utf8');
        let visitList = rawText.split(';');
        // viimane element on tühi (lõpus olev semikoolon), seega viimane külastus on eelviimane
        let lastVisitParts = visitList[visitList.length - 2].split(',');
        // osad: [0] nimi, [1] kuupäev, [2] kellaaeg
        res.render('lastvisit', {lastVisit: 'Viimati registreeriti külastus ' + lastVisitParts[1].trim() + ', kell ' + lastVisitParts[2].trim() + ' kui seda tegi ' + lastVisitParts[0].trim()});
    } catch(err) {
        res.render('lastvisit', {lastVisit: 'Ei leidnud ühtegi külastust!'});
    }
};



module.exports = {
	eestifilm,
	inimesed,
	inimesedAdd,
	inimesedAddPost,
	filmidAdd,
	filmidAddPost,
	ametidAdd,
	ametidAddPost,
	visitAdd
}