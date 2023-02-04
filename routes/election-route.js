const router = require('express').Router();
module.exports = router;


const { getCandidates, getPositions, castVote } = require('../model/dbQueries');
const { SessionHandler } = require('../utillities/session');

router.use(SessionHandler);

const page_js = ['<script src="/js/election.js" type="text/javascript" async=false defer=false></script>'];


router.get('/election', async function (req, res) {

	console.log("REQ-[GET]-[/election/election] : ", req.ip);

	const candidates = await getCandidates();
	const positions = await getPositions();

	res.render('election', {
		title: "Election Page",
		js_scripts: page_js,
		candidates: candidates || [],
		positions: positions || [],
	})

});




router.post('/election/:position_id', async function (req, res, next) {
	const candidate_id = req.body.candidate;
	const position_id = req.params.position_id;
	const access_token = req.session.entity.access_token;
	console.log("REQ-[POST]-[/election/nomination] : ", req.body);

	if (position_id && candidate_id) {

		const vote_result = await castVote(position_id, candidate_id, access_token);

		if (vote_result.modifiedCount === 1 || vote_result.updatedCount === 1) {

			// Create a modified entity session
			const entity = {
				...req.session.entity,
				votes: {
					...req.session.entity.votes,
					[position_id]: candidate_id
				}
			};

			// Update session
			req.session.entity = entity;

			console.log("REQ-[POST]-[/election/nomination] [New-Session]: ", entity);

			return res.json({ status: 200, message: 'Vote Recorded!', voting_entity: entity });
		}

		return res.send({ status: 400, message: "Vote not! recorded!, Try again?" });

	}

	return res.send({ status: 400, message: "Vote not!recorded!, Try again?" });
});