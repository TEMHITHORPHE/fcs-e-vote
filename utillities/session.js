function SessionHandler(req, res, next) {
	console.log("[SESSION]-[", req.baseUrl, "]: ", req.session);
	// console.log(req.session);
	if (req.session.isNew) return res.redirect('/');
	next();
};



function CreateSession() {

}

function VerifySession(params) {

}


module.exports.SessionHandler = SessionHandler