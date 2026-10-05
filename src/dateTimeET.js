
const dateFormattedET =function(parameter=1){
	let timeNow = new Date();
	let dateNow = timeNow.getDate();
	let monthNow = timeNow.getMonth();
	let yearNow =  timeNow.getFullYear();
	const monthNamesET = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
	const folkMonthNamesET = [
		"näärikuu", "küünlakuu", "paastukuu", "jürikuu", "lehekuu", "jaanikuu", 
		"heinakuu", "lõikuskuu", "mihklikuu", "viinakuu", "talvekuu", "jõulukuu"
	];
	let monthName;
	if (parameter === 1) {
        monthName = folkMonthNamesET[monthNow];
    } else {
        monthName = monthNamesET[monthNow];
    }
	
	return monthName + " " + dateNow + ". päev " + yearNow;
}

function addLeadZero(numValue){
	if(numValue < 10) {
		numValue = "0" + numValue;
		//numValue = numValue.padStart (2, "0");
	}
	return numValue
}

function timeFormattedET(){
	let timeNow = new Date();
	let hourNow = timeNow.getHours();
	let minuteNow = timeNow.getMinutes();
	let secondNow = timeNow.getSeconds ();
	let timeFormatted = hourNow + ":" + addLeadZero(minuteNow) + ":" + addLeadZero(secondNow);
	return timeFormatted;
}

function paev(){
	let today = new Date();
	const weekdays = ["Pühapäev", "Esmaspäev", "Teisipäev", "Kolmapäev", "Neljapäev", "Reede", "Laupäev"];
	let dayNumber = today.getDay();
	let dayName = weekdays[dayNumber];
	
	return dayName;
}

//ekspordin kõik vajalikud funktsioonid koos mugavate nimedega
module.exports ={time: timeFormattedET, date: dateFormattedET, day: paev};






//Viktoria//
/* const dateFormattedET = function(opt){
	let timeNow = new Date();
	let dateNow = timeNow.getDate();
	let monthNow = timeNow.getMonth();
	let yearNow = timeNow.getFullYear();
	let monthNamesET = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
	if(opt == 1){
		monthNamesET = ["näärikuu", "küünlakuu", "paastukuu", "jürikuu", "lehekuu", "jaanikuu", "heinakuu", "lõikuskuu", "mihklikuu", "viinakuu", "talvekuu", "jõulukuu"];
	}
	return dateNow + ". " + monthNamesET[monthNow] + " " + yearNow;
}

 const addLeadZero = function(numValue){
	if(numValue < 10){
		numValue = "0" + numValue;
		//numValue = numValue.padStart(2, "0")
	}
	return numValue;
 }
 
 const timeFormattedET = function(){
	 let timeNow = new Date();
	 let hourNow = timeNow.getHours();
	 let minuteNow = timeNow.getMinutes();
	 let secondNow = timeNow.getSeconds();
	 let timeFormatted = hourNow + "." + addLeadZero(minuteNow) + "." + addLeadZero(secondNow);
	 return timeFormatted;
 }
 
 //ekspordin kõik vajalikud funktsioonid koos mugavamate nimedega
 module.exports = {time: timeFormattedET, date: dateFormattedET}; */