const express = require('express');
const multer = require('multer');

const router = express.Router();

// seadistame multer vahevara (middleware) failide üleslaadimiseks
// määran üleslaadimise kataloogi
const upload = multer({dest: './public/gallery/orig/'});
// määrata saab veel näiteks lubatud failitüüpe, faili suuruse piirangut jne


//kontrollerid
const {
 	galleryPhotos } = require ('../controllers/galleryPhotoController');

router.route('/').get(galleryPhotos);

module.exports = router;