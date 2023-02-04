
class CandidatesCache {

	candidates = new Set();
	bootstrapped = false;
	get_data;

	constructor(CandidatesRetrievalFunc) {
		if (typeof CandidatesRetrievalFunc === "function") {
			const data = CandidatesRetrievalFunc();
			console.log("[Cache-Init]: ", data);

			if (data && Array.isArray(data) && data.length > 0) {
				this.candidates = new Set(data);
				this.get_data = CandidatesRetrievalFunc;
				this.bootstrapped = true;
				console.log("[Cache-Bootstrapped]: ", data);
			}
		} else {
			throw new Error("Function expected");
		}
	}

	refresh() {
		if (this.bootstrapped) {
			const data = this.get_data();
			console.log("[Cache-Refreshed]: ", data);
			if (data && Array.isArray(data) && data.length > 0) {
				this.candidates = new Set(data);
				this.bootstrapped = true;
				console.log("[Cache-Bootstrapped]: ", data);
			}
		}
		else {
			if (typeof this.get_data === "function") {
				const data = this.get_data();
				console.log("[Cache-Init]: ", data);

				if (data && Array.isArray(data) && data.length > 0) {
					this.candidates = new Set(data);
					this.bootstrapped = true;
					console.log("[Cache-Bootstrapped]: ", data);
				}
			} else {
				throw new Error("Function expected");
			}
		}
	}

	batchAddCandidates(candidates) {
		console.log("Batch Adding ... ");
		if (candidates && Array.isArray(candidates) && candidates.length > 0) {
			this.candidates = new Set(candidates);
			this.bootstrapped = true;

		}
	}
}

