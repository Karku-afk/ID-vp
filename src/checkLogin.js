exports.isLogin = function(req, res, next){
	if(req.session != null){
		if(req.session.userId){
			console.log('sisse on loginud kasutaja: ' + req.session.userId);
			next();
		} else {
			console.log('sessioonimuutujat pole??');
			return res.redirect('/signin');
		}
	} else {
		console.log('sisselogimist pole tuvastatud!');
		return res.redirect('/signin');
	}
}