

function nomineeChange(select_el) {
	console.log(select_el.value);
	if (select_el) {
		if (select_el.value !== 'null') select_el.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.backgroundColor = '#6152ee'
		else select_el.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.backgroundColor = '#ffffff'
	}
}

function recastVote(fieldset_el_id) {
	const fieldset = document.getElementById(fieldset_el_id);
	console.log("FIELDSET: ", fieldset);
	if (fieldset) {
		fieldset.firstElementChild.nextElementSibling.firstElementChild.removeAttribute("disabled");
		fieldset.lastElementChild.removeAttribute("disabled");
		fieldset.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.style.display = "none";
		fieldset.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.nextElementSibling.style.display = "none";
	}
}


async function signout(e) {

	if (window.localStorage.voting_entity) window.localStorage.voting_entity;

	const response = await fetch('/election/election/signout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: window.localStorage.voting_entity || JSON.stringify({ voting_entity: "" })
	});

	const result = await response.json();

	if (result.status === 200) {
		console.log("Result", result);
		if (result.reset) {
			window.localStorage.clear();
			location.replace('/');
		}
		location.replace('/');
	}
}

async function nominate(position_id) {

	console.log("COLUMN_NAME - [position_id]: ", position_id);

	// Does the provided unit ID exists.
	// if (!fcs || !fcs.units || !fcs.units.includes(position_id)) return;

	// console.log("Passed through: " + position_id);
	const select_el = document.getElementById(position_id);
	if (!select_el) return;
	const candidate_id = select_el.selectedOptions[0].value;
	if (!candidate_id) return;

	console.log(candidate_id);

	if (candidate_id === "null") {
		showAlert('error', 'Nope ... really?');
		return;
	}


	const session = localStorage.voting_entity;
	// console.log("SESIION - ", session);
	if (session) {
		const votes = Object.entries(JSON.parse(session).votes);
		// console.log("ENTRIES: ", votes);
		for (let index = 0; index < votes.length; index++) {
			const casted_vote = votes[index];
			if (casted_vote[1] === candidate_id) {
				showAlert('error', "You have voted for candidate " + candidate_id + " already.");
				select_el.setAttribute("disabled", true);
				select_el.parentElement.nextElementSibling.setAttribute("disabled", true);
				select_el.nextElementSibling.style.display = 'inline';
				select_el.nextElementSibling.nextElementSibling.style.display = 'inline';
				return;
			}
		}
	}

	const response = await fetch('/election/election/' + position_id, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ candidate: candidate_id })
	});

	const result = await response.json();
	console.log("result: ", result);

	if (result) {
		if (result.status === 200) {

			if (result.message) showAlert('success', result.message);

			if (candidate_id !== 'null') {
				select_el.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.backgroundColor = 'green';
			}
			select_el.setAttribute("disabled", true);
			select_el.parentElement.nextElementSibling.setAttribute("disabled", true);
			select_el.nextElementSibling.style.display = 'inline';
			select_el.nextElementSibling.nextElementSibling.style.display = 'inline';
		}
		else if (result.status === 400) {
			if (result.message) showAlert('error', result.message);
		}
		if (result.voting_entity) window.localStorage.setItem("voting_entity", JSON.stringify(result.voting_entity));
	}

}

// 
// Candidates -> {
// 	gender: "male"
// 	name: "Adefarasin Micheal"
// 	symbol: "A"
// 	_id: "63dde5ce2a32a160ba67e04b"
// }


//
// Position -> 
// {
// 	includes: ['male']
// 	position: "Vice President"
// 	_id: "63dde4562a32a160ba67e03c"
// }

function populateFormFields() {

	for (let index = 0; index < fcs.positions.length; index++) {
		const position = fcs.positions[index];
		const select_el = document.getElementById(position._id);
		const dropdown_fragment = document.createDocumentFragment();

		if (select_el) {

			console.log("Position: ", position.position);
			for (let index = 0; index < fcs.candidates.length; index++) {

				const candidate = fcs.candidates[index];
				if (!position.includes.includes(candidate.gender)) continue;

				const option_element = document.createElement("option");
				option_element.value = candidate.symbol;
				option_element.text = candidate.symbol;
				dropdown_fragment.appendChild(option_element);

				console.log("Candidates: ", candidate.name, " - ", candidate.gender);
			}
			select_el.appendChild(dropdown_fragment);
		}
	}
}


// function updateDropDownFields(class_selector, dropdown_subtree) {
// 	console.log("SELECTOR: ", class_selector);
// 	const dropdowns = document.getElementsByClassName(class_selector);
// 	// console.log("Updating: ", dropdowns, class_selector, dropdown_subtree);
// 	for (let index = 0; index < dropdowns.length; index++) {
// 		const dropdown_el = dropdowns[index];
// 		dropdown_el.appendChild(dropdown_subtree.cloneNode(true));
// 		// console.log("Appending: ", dropdown_subtree);
// 	}
// }




window.addEventListener('load', function () {
	console.log("[nomination.js] - LOADED!!");
	if (window.fcs) {
		console.log("FCS-FOUND: ", fcs);
		if (fcs.candidates) {
			populateFormFields();
		}
	}
})