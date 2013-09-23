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
	return item1 === item2;
}

var changePage = function(page) {
	$.mobile.changePage(page, { transition: "slide" });
}

var ignoreError = function(func) {
	try { func(); } 
	catch (error) {  }
}

var commonFoodList = [ "Apples", "Avacados", "Almond", "Bacon", "Black beans", "Barley", "Beer", "Bread", "Broccoli", "Cabbage", "Carrots", "Celery", "Cheese", "Chicken", "Chicken breasts", "Chicken drumsticks", "Chickren legs", "Clams", "Coffee", "Corns", "Crab", "Cereal", "Chocolate", "Curry", "Dates", "Duck", "Eggs", "Salmon", "Garlic", "Ginger", "Goose", "Grapes", "Green beans", "Graham crackers", "Ham", "Honey", "Lobster", "Kiwi", "Ketchup", "Kidney beans", "Lamb", "Milk", "Pepperoni", "Spinach", "Spaghetti", "Wine", "Walnuts", "Yogurt", "Zucchinis", "Tomatoes", "Bean sprouts", "Strawberries", "Bananas", "Baking soda", "Baking powder", "Brandy", "Ground pork", "Ground beef", "Tofu", "Bay leaves", "Bok choy", "Butter", "Basil", "Flour", "Cherries", "Cream cheese", "Cranberries", "Cinnamon", "Coconuts", "Cheddar cheese", "Cod", "Dill", "Eels", "Eggplants", "Feta cheese", "Gelatin", "Grapefruits", "Green onions", "Gluten", "Heavy creen", "Lemons", "Limes", "Lavender", "Lettuce", "Light cream", "Lotus", "Lima beans", "Leeks", "Macaroni", "Mangoes", "Margarine", "Marshmallows", "Melons", "Mayonnaise", "Miso", "Mint", "Mussles", "Mushrooms", "Mustard", "Olives", "Octopus", "Onions", "Oranges", "Oysters", "Pesto", "Panko", "Papayas", "Parsley", "Pasta", "Peas", "Peaches", "Peanuts", "Pineapples", "Prawns", "Shrimp", "Poppy seeds", "Plums", "Pears", "Pumpkins", "Quinoa", "Rabbits", "Radishes", "Red beans", "Rice", "Rosemary", "Rose water", "Rice vinegar", "Red snapper", "Ricotta cheese", "Rum", "Saffron", "Sardines", "Sausages", "Snow peas", "Dry sherry", "Shallots", "Steaks", "Squid", "Soba noodles", "Swordfish", "Turkeys", "Thyme", "Tuna", "Udon noodles", "Vanilla", "Yeast", "White beans", "Watermelons", "Watercress", "Blackberries", "Blueberries", "Cucumbers", "Pork ribs", "Cilantro", "Soy bean", "Passion fruit", "Fish", "Beef", "Pork"];

commonFoodList.sort();
