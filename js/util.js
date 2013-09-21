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

function getItemIndex(array, item, ignorecase) {
	for (var i = array.length - 1; i >= 0; i--) {
		if(ignorecase && item.toUpperCase() === array[i].toUpperCase()) {
			return i;
		}
		else if(item === array[i]) {
			return i;
		}
	}
	return -1;
}