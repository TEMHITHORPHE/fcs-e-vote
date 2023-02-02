




function nomineeChange(select_el) {
	console.log(select_el.value);
	if (select_el && select_el.value !== 'null') {
		select_el.nextElementSibling.style.backgroundColor = '#6152ee'
	}
}


async function signout(e) {

	if (window.localStorage.voting_entity) window.localStorage.voting_entity

	const response = await fetch('/election/nomination/signout', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: window.localStorage.voting_entity || JSON.stringify({ voting_entity: "" })
	});

	const result = response.json();

	if (result.status === 200) {
		console.log("Result", result);
		if (result.reset) {
			window.localStorage.clear();
			location.replace('/');
		}
		location.replace('/');
	}
}

async function nominate(unit_id) {
	// console.log(unit_id);

	unit_id = unit_id.trim().split(' ').join('_').toLowerCase();
	console.log("COLUMN_NAME - [unit_id]: ", unit_id);

	// Does the provided unit ID exists.
	if (!fcs || !fcs.units || !fcs.units.includes(unit_id)) return;

	console.log("Passed through: " + unit_id);
	const unit_nominees_el = document.getElementsByClassName(unit_id);

	console.log(unit_nominees_el);

	let count = 0;
	const nominees = [];
	for (let index = 0; index < unit_nominees_el.length; index++) {
		const nominee_el = unit_nominees_el[index];
		const nominee_id = nominee_el.selectedOptions[0].value;
		nominees.push(nominee_id);
		nominee_id === "null" ? count++ : "";
	}

	if (count === unit_nominees_el.length) {
		showAlert('error', 'Nope ... really?');
		return;
	}
	const response = await fetch('/election/nomination/' + unit_id, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(nominees)
	});

	const result = await response.json();
	console.log("result: ", result);
	if (result) {
		if (result.status === 200) {
			if (result.message) showAlert('success', result.message);
			// const unit_nominees_el = document.getElementsByClassName(unit_id);
			// console.log(unit_nominees_el);
			for (let index = 0; index < unit_nominees_el.length; index++) {
				const select_el = unit_nominees_el[index];
				if (select_el && select_el.value !== 'null') {
					select_el.nextElementSibling.style.backgroundColor = 'green';
				}
				// element.
			}
		}
		else if (result.status === 400) {
			if (result.message) showAlert('error', result.message);
		}
		if (result.voting_entity) window.localStorage.setItem("voting_entity", JSON.stringify(result.voting_entity));
	}

}





function populateFormFields() {
	const units =  Object.keys(fcs.unit_records);
	// console.log(units);
	for (let unit_index = 0; unit_index < units.length; unit_index++) {
		const unit = units[unit_index];
		console.log("\nUnit: ", unit);
		const members = fcs.unit_records[unit];
		const dropdown_fragment = document.createDocumentFragment();
		console.log("Members: ", members);
		if (members) {
			for (let member_index = 0; member_index < members.length; member_index++) {
				const member = members[member_index];
				// console.log(member);
				const option_element = document.createElement("option");
				// option_element.value = member.first_name;
				option_element.value = member.first_name.trim() + " " + member.last_name.trim();
				option_element.text = member.first_name + " " + member.last_name;
				dropdown_fragment.appendChild(option_element);
			}
			// unit = 
			updateDropDownFields(unit.replace(/ /g, "_").toLowerCase(), dropdown_fragment);
		}
		// break;
	}
}


function updateDropDownFields(class_selector, dropdown_subtree) {
	console.log("SELECTOR: ", class_selector);
	const dropdowns = document.getElementsByClassName(class_selector);
	// console.log("Updating: ", dropdowns, class_selector, dropdown_subtree);
	for (let index = 0; index < dropdowns.length; index++) {
		const dropdown_el = dropdowns[index];
		dropdown_el.appendChild(dropdown_subtree.cloneNode(true));
		// console.log("Appending: ", dropdown_subtree);
	}
}




window.addEventListener('load', function () {
	console.log("[nomination.js] - LOADED!!");
	if (window.fcs) {
		console.log("FCS-FOUND: ", window.fcs);
		if (fcs.unit_records) {
			console.log(fcs.unit_records);
			populateFormFields();
		}
	}
})