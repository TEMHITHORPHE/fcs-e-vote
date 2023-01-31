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
		if (nominators.length > 0) {
			this.nominators = new Set(nominators);
			this.bootstrapped = true;
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
	if (AccessCodes === null || error) return [];
	return AccessCodes;
};
