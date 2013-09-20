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
	var myFood = JSON.parse(localStorage.getItem("myFood"));
	return myFood && myFood[name];
}

function setLocalStorage(name, data) {
	var myFood = JSON.parse(localStorage.getItem("myFood"));
	myFood[name] = data;
	localStorage.setItem("myFood", JSON.stringify(myFood));
}