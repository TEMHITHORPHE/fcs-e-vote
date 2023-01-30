function SessionHandler(req, res, next) {
	if (req.session.isNew  && req.baseUrl !== '/election') return res.redirect('/');
	next();
};



function CreateSession() {

}

function VerifySession(params) {

}


module.exports.SessionHandler = SessionHandler