const { ObjectId } = require('mongodb');
const { supabase, client } = require('../model/db');


class Nominator {

	nominators = new Set();
	bootstrapped = false;

	constructor(data) {
		this.nominators = data ? new Set(data) : new Set();
	}

	addNominator(nominator) {
		this.nominators.add(nominator);
		console.log("Added Nominator: ", nominator);
	}

	exists(nominator) {
		return this.nominators.has(nominator);
	}

	batchAddNominators(nominators) {
		console.log("Batch Adding ... ");
		if (nominators.length > 0) {
			for (let index = 0; index < nominators.length; index++) {
				// const nominator = nominators[index];
				this.addNominator(nominators[index].access_code);
			}
			// this.nominators = new Set(nominators);
			this.bootstrapped = true;
			console.log("[dbQueries.js]-[Nominators-Added]: ", nominators);
			return true;
		}
		return false;
	}

}

const nominators = new Nominator();

module.exports.nominators = nominators;
module.exports.getNominators = async function getNominators() {
	let { data: AccessCodes, error } = await supabase
		.from('AccessCodes')
		.select('access_code')
		.eq('is_used', true);
	console.log("[dbQueries.js]-[getNominators]: ", AccessCodes);
	if (AccessCodes === null || error) return [];
	return AccessCodes;
};


module.exports.members = async function member_data() {

	const { data, error } = await
		supabase
			.from('Members')
			.select('first_name, last_name, gender, level, unit, campus')
			.neq('level', 100)
			.neq('level', 500);

	if (error || data === null) return [];

	// data.map(function (member, index, member_data) {
	// 	member_data[index].unit = member.unit.toLowerCase().split(" ").join("_");
	// });

	const unit_set = new Set();
	for (let index = 0; index < data.length; index++) {
		const member = data[index];
		const unit = member.unit;
		if (unit_set.has(unit)) {
			members_data_by_units[unit].push(member);
		}
		else {
			unit_set.add(unit);
			members_data_by_units[unit] = [];
			members_data_by_units[unit].push(member);
		}
	}

	// console.log("Members: ", data);
}

const members_data_by_units = {};
module.exports.members_data_by_units = members_data_by_units;





module.exports.isAccessCodeValid = async function isAccessCodeValid(code) {

	await client.connect();
	// const AccessCodesCol = client.db('E-Vote').collection('access_codes');

	const updated = await client.db('E-Vote')
		.collection('access_codes')
		.findOneAndUpdate({
			"access_token": code,
			"is_used": false
		}, {
			$set: { "is_used": true }
		});

	if (updated.value === null) return false;

	console.log("Updated: ", updated);
	return updated.value;
}



module.exports.getCandidates = async function getCandidates() {
	await client.connect();

	const candidates = await client.db('E-Vote')
		.collection('candidates')
		.find().toArray();

	console.log("Candidates: ", candidates);
	return candidates;
}


module.exports.getPositions = async function getPositions() {
	await client.connect();

	const positions = await client.db('E-Vote')
		.collection('positions')
		.find().toArray();

	console.log("Positions: ", positions);
	return positions;
}


module.exports.castVote = async function castVote(positionId, candidateId, votingToken) {

	await client.connect();

	const query = { access_token: votingToken, };
	const update = { $set: { ["votes." + new ObjectId(positionId)]: new ObjectId(candidateId) } };
	const options = { upsert: true };

	const casted_vote = await client.db('E-Vote')
		.collection('votes')
		.updateOne(query, update, options);

	console.log("Votes-Update: ", casted_vote);
	return casted_vote;

}



// module.exports.candidates = function 