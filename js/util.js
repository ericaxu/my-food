function localStorageInit() {
	if (typeof window.localStorage == "object") {
		if (!localStorage.getItem("myFood")) {
			localStorage.setItem("myFood", "{}");
		}
	} else {
		// do something, localStorage is not supported
	}
}

function clearLocalStorage() {
	localStorage.clear();
}

function getLocalStorage(name) {
	var data = localStorage.getItem(name);
	if(data) {
		return JSON.parse(LZString.decompress(data));
	}
}

function setLocalStorage(name, data) {
	localStorage.setItem(name, LZString.compress(JSON.stringify(data)));
}

function getItemIndex(array, item, compare) {
	if(!compare) {
		return array.indexOf(item);
	}
	for (var i = array.length - 1; i >= 0; i--) {
		if(item === array[i]) {
			return i;
		}
		else if(compare && compare(item, array[i])) {
			return i;
		}
	}
	return -1;
}

var stringCompare = function(item1, item2) {
	return item1.toUpperCase() === item2.toUpperCase();
}

var changePage = function(page) {
	$.mobile.changePage(page, { transition: "slide" });
}

var ignoreError = function(func) {
	try { func(); } 
	catch (error) {  }
}

var commonFoodList = [
	"Apples",
	"Avacado",
	"Almond",
	"Bacon",
	"Black beans",
	"Bagels",
	"Barley",
	"Beer",
	"Bread",
	"Broccoli",
	"Cabbage",
	"Carrots",
	"Celery",
	"Cheese",
	"Chicken",
	"Chicken breasts",
	"Chicken drumsticks",
	"Chickren legs",
	"Clams",
	"Coffee",
	"Corns",
	"Cupcakes",
	"Crab",
	"Cereal",
	"Chocolate",
	"Curry",
	"Dates",
	"Duck",
	"Donuts",
	"Eggs",
	"Muffins",
	"Salmon",
	"Garlic",
	"Ginger",
	"Goose",
	"Grapes",
	"Green beans"
];

commonFoodList.sort();