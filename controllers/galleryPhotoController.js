const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const sharp = require('sharp');

//@desc home page for viewing gallery photos
//@route GET /galleryPhotos
//@access public

const galleryPhotos = async (req, res) => {
	//console.log('Andmebaasiserver on: ' + process.env.DB_HOST);
	const mysql = require('mysql2/promise');
	let conn;
	try {
		conn = await mysql.createConnection({
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			database: process.env.DB_NAME
		});
        const sqlReq = 'SELECT filename, alttext FROM gallery_photos WHERE privacy >= ? AND deleted IS NULL';
		const [sqlRes] = await conn.execute(sqlReq, [2]);
		console.log(sqlRes);
        sqlRes.forEach(function(photo){
			if(!photo.alttext) {
				photo.alttext = 'Uusim avalik foto';
			}
		});
		res.render('galleryPhotos', {pictureList: sqlRes});
	} catch (err) {
		console.log('Viga andmebaasist lugemisel: ' + err);
        	res.render('galleryPhotos', {pictureList: []});
	}
	finally {
		if(conn){
			await conn.end();
		}
	}
}


module.exports = {
	galleryPhotos
}