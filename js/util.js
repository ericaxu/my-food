function localStorageInit() {
	if (typeof window.localStorage == "object") {
		if (!localStorage.getItem("myFood")) {
			localStorage.setItem("myFood", "{}");
		}
	} else {
		// do something, localStorage is not supported
	}
}



function getLocalStorage(name) {
	return JSON.parse(localStorage.getItem(name));
}

function setLocalStorage(name, data) {
	localStorage.setItem(name, JSON.stringify(data));
}