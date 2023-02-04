
window.onload = async function () {
	console.log("LOADED!!");

	displayCodeCard();

	if (window.fcs) {
		if (fcs.alerts) {
			console.log("ALERTS-FOUND: ", window.fcs);
			for (let index = 0; index < fcs.alerts.length; index++) {
				const alert = fcs.alerts[index];
				showAlert(alert.type, alert.message);
			}
			fcs.alerts = [];
		}
	}
}
// window.onload = displayCodeCard();

// const entity = {
// 	access_code: AccessCodes.access_code,
// 	tag: AccessCodes.tag,
// 	nominations: {}
// }
async function displayCodeCard() {
	const store_value = window.localStorage.voting_entity;
	if (!store_value) return;

	const entity = JSON.parse(store_value);
	if (!entity || !entity.access_token) return;

	const code_card_anchor = document.getElementById('code-card-anchor');
	console.log("LOCAL-STORE: ", entity);
	if (!code_card_anchor) return;

	let cardHTML = ""
	for (let index = 0; index < entity.access_token.length; index++) {
		const char = entity.access_token[index];
		cardHTML += `
		<div class="code-card">
		<h2>${char}</h2>
	  </div>
	  `
	}
	code_card_anchor.innerHTML = cardHTML;
}







const CUSTOM_ALERT_TYPE_OBJECT = {
	error: {
		class: ["alert alert-danger mb-2 border-danger border-start border-5 d-flex align-items-center"],
		icon: "fa-solid fa-triangle-exclamation"
	},
	info: {
		class: ["alert alert-info mb-2 border-info border-start d-flex align-items-center"],
		icon: "fa-solid fa-circle-info"
	},
	success: {
		class: ["alert alert-success mb-2 border-success border-start d-flex align-items-center"],
		icon: "fa-solid fa-thumbs-up"
	}
}
function showAlert(alert_type, message) {
	console.log("Alert called! ", alert_type, message);
	let alert_anchor = document.getElementById('alert-anchor');
	if (!alert_anchor) { // IF anchor is not available in DOM.
		alert_anchor = document.createElement('div');
		alert_anchor.id = 'alert-anchor';
		alert_anchor.classList = "w-auto start-0 ms-3 border-start border-5 ";
		document.getElementsByTagName('header')[0].appendChild(alert_anchor);
		console.log("Anchor-Created");
	}
	const alert_el = document.createElement("div");
	alert_type = CUSTOM_ALERT_TYPE_OBJECT[alert_type] ? alert_type : 'info';
	alert_el.classList = CUSTOM_ALERT_TYPE_OBJECT[alert_type].class;

	const innerHTML = `
	<i class="${CUSTOM_ALERT_TYPE_OBJECT[alert_type].icon}" style="height: 24px;"></i>
	<div class="ps-2">
		${message}
	</div>
	<button
		type="button"
		class="btn-close ms-auto"
		data-bs-dismiss="alert"
		aria-label="Close">
	</button>
	`
	alert_el.innerHTML = innerHTML;
	// document.getElementById('alert-anchor').appendChild(alert_el);
	alert_anchor.appendChild(alert_el);
	setTimeout(function () {
		alert_el.classList.add("slide-out-left");
		// alert_anchor.remove();
		alert_el.remove();
	}, 5000);
}


window.onbeforeunload = function () {
	// Change the history stack to prevent back navigation from re-making a POST request,
	//  thereby re-submitting the form. Replacing History state changes it to a normal GET Request.
	if (location.pathname === '/') history.replaceState({}, '', '/');
	// CODE ABOVE IS CRITICAL TO ALERT SYSTEM NOT MIS_BEHAVING ON PAGE NAVIGATION.

	// document.getElementById('alert-anchor') ? document.getElementById('alert-anchor').remove() : console.log("Nothing to remove!");;
	// console.log("Removed! some Nodes!!");
}


