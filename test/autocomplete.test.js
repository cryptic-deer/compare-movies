//! testing with mocha in the browser is not the most optimal

//wait for the selected element to appear before testing
const waitFor = selector => {
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			if (document.querySelector(selector)) {
				clearInterval(interval);
				clearTimeout(timeout);
				resolve();
			}
		}, 30);

		const timeout = setTimeout(() => {
			clearInterval(interval);
			reject();
		}, 2000);
	});
};

//to reset the app before each test
beforeEach(() => {
	document.querySelector("#target").innerHTML = "";
	createAutoComplete({
		root: document.querySelector("#target"),
		fetchData() {
			return [
				{ Title: "Avengers" },
				{ Title: "Not Avengers" },
				{ Title: "Maybe Avengers" },
			];
		},
		renderOption(movie) {
			return movie.Title;
		},
	});
});

it("Dropdown starts closed", () => {
	// test to do not show dropdown on a fresh page
	const dropdown = document.querySelector(".dropdown");
	//assert with chai
	expect(dropdown.className).not.to.include("is-active");
});

it("After searching, dropdown opens up", async () => {
	const input = document.querySelector("input");
	input.value = "avengers";
	input.dispatchEvent(new Event("input"));

	await waitFor(".dropdown-item");

	const dropdown = document.querySelector(".dropdown");

	expect(dropdown.className).to.include("is-active");
});

it("After searching, display results", async () => {
	const input = document.querySelector("input");
	input.value = "avengers";
	input.dispatchEvent(new Event("input"));

	await waitFor(".dropdown-item");

	const items = document.querySelectorAll(".dropdown-item");

	expect(items.length).to.equal(3);
});
