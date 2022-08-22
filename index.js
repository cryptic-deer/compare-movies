const API_KEY = "25d1c667";

//these are reusable between the two inputbox
const autoCompleteConfig = {
	renderOption(movie) {
		//broken image fix
		const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
		return `
		<img src="${imgSrc}"/>
		${movie.Title} (${movie.Year})
	`;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchTerm) {
		const response = await axios.get("https://www.omdbapi.com/", {
			params: {
				apikey: API_KEY,
				s: searchTerm,
			},
		});

		if (response.data.Error) {
			return [];
		}

		return response.data.Search;
	},
};

//LEFT SIDE
//calling from autocomplete.js and passing in the required properties
createAutoComplete({
	//where to show autocomplete
	root: document.querySelector("#left-autocomplete"),
	//throwing in a copy of this object as the properties
	...autoCompleteConfig,

	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		onMovieSelect(movie, document.querySelector("#left-summary"), "left");
	},
});
//RIGHT SIDE
createAutoComplete({
	root: document.querySelector("#right-autocomplete"),
	...autoCompleteConfig,

	onOptionSelect(movie) {
		document.querySelector(".tutorial").classList.add("is-hidden");
		onMovieSelect(movie, document.querySelector("#right-summary"), "right");
	},
});

let leftMovie;
let rightMovie;
//getting the data of the selected movie
const onMovieSelect = async (movie, summaryElement, side) => {
	const response = await axios.get("https://www.omdbapi.com/", {
		params: {
			apikey: API_KEY,
			i: movie.imdbID,
		},
	});
	summaryElement.innerHTML = movieTemplate(response.data);

	//check which side's data we're working with
	if (side === "left") {
		leftMovie = response.data;
	} else {
		rightMovie = response.data;
	}
	//comparing the two selected movie's properties
	const runComparison = () => {
		//selecting all the statistics from the DOM
		const leftSideStats = document.querySelectorAll(
			"#left-summary .notification"
		);
		const rightSideStats = document.querySelectorAll(
			"#right-summary .notification"
		);

		//getting the matching properties to compare
		leftSideStats.forEach((leftStat, index) => {
			const rightStat = rightSideStats[index];

			const leftValue = parseInt(leftStat.dataset.value);
			const rightValue = parseInt(rightStat.dataset.value);

			//actual comparison
			if (rightValue < leftValue) {
				//removing green color
				leftStat.classList.remove("is-info");
				//adding yellow color
				leftStat.classList.add("is-success");
			} else {
				rightStat.classList.remove("is-info");
				rightStat.classList.add("is-success");
			}
		});
	};
	//if both movies are defined => compare them
	if (leftMovie && rightMovie) runComparison();
};

const movieTemplate = movieDetail => {
	//extracting the values we want to compare into properties
	const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return prev;
		} else {
			return prev + value;
		}
	}, 0);
	const dollars = parseInt(
		movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, "")
	);
	const metascore = parseInt(movieDetail.Metascore);
	const imdbRating = parseFloat(movieDetail.imdbRating);
	const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

	//returning the html template with the data filled in
	return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title} (${movieDetail.Year})</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
		<article data-value=${awards} class="notification is-info">
			<p class="title">${movieDetail.Awards}</p>
			<p class="subtitle">Awards</p>
		</article>
		<article data-value=${dollars} class="notification is-info">
			<p class="title">${movieDetail.BoxOffice}</p>
			<p class="subtitle">BoxOffice</p>
		</article>
		<article data-value=${metascore} class="notification is-info">
			<p class="title">${movieDetail.Metascore}</p>
			<p class="subtitle">Metascore</p>
		</article>
		<article data-value=${imdbRating} class="notification is-info">
			<p class="title">${movieDetail.imdbRating}</p>
			<p class="subtitle">IMDB Rating</p>
		</article>
		<article data-value=${imdbVotes} class="notification is-info">
			<p class="title">${movieDetail.imdbVotes}</p>
			<p class="subtitle">IMDB Votes</p>
		</article>
    `;
};
