/*this function is completely reusable, even outside of this project
  (but it needs the bulma libary use for the innerHTML)*/
const createAutoComplete = ({
	root,
	renderOption,
	onOptionSelect,
	inputValue,
	fetchData,
}) => {
	//creating the pop-up element for the search
	root.innerHTML = `
	    <label><b>Search</b></label>
	    <input class="input" />
	    <div class="dropdown">
		    <div class="dropdown-menu">
		        <div class="dropdown-content results"></div>
		    </div>
	    </div>
`;

	const input = root.querySelector("input");
	const dropdown = root.querySelector(".dropdown");
	const resultWrapper = root.querySelector(".results");

	//fetch the items on user input
	const onInput = async event => {
		const items = await fetchData(event.target.value);

		//handling empty search
		if (!items.length) {
			dropdown.classList.remove("is-active");
			return;
		}

		//reset the results
		resultWrapper.innerHTML = "";

		dropdown.classList.add("is-active");

		for (let item of items) {
			const option = document.createElement("a");

			option.classList.add("dropdown-item");
			option.innerHTML = renderOption(item);

			//handling what happens when we select a item from the list
			option.addEventListener("click", () => {
				dropdown.classList.remove("is-active");
				input.value = inputValue(item);
				onOptionSelect(item);
			});

			resultWrapper.appendChild(option);
		}
	};

	input.addEventListener("input", debounce(onInput));

	//automatically closing the dropdown if we click outside the root element
	document.addEventListener("click", event => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove("is-active");
		}
	});
};
