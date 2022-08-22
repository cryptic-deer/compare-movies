//DEBOUNCING -> protecting the function against fast and repetative uses
//making sure that we don't search on every keypress
const debounce = (func, delay = 1000) => {
	let timeoutId;
	//we can pass any number of arguments to this function ->(...args)
	return (...args) => {
		//on the first keypress the timeoutId is undefined so it skips this if statement
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		//only fetch data if there is more than 1 sec between keypresses
		timeoutId = setTimeout(() => {
			func.apply(null, args);
		}, delay);
	};
};
