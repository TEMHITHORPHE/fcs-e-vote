const { supabase } = require('../model/db');


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




// const unit_set = new Set();
// for (let index = 0; index < member_data.length; index++) {
// 	const member = member_data[index];
// 	const unit = member.unit;
// 	if (unit_set.has(unit)) {
// 		members_data_by_units[unit].push(member);
// 	}
// 	else {
// 		unit_set.add(unit);
// 		members_data_by_units[unit] = [];
// 		members_data_by_units[unit].push(member);
// 	}
// }




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
