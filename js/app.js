function MyFoodCtrl($scope) {
	$scope.ingredients = getLocalStorage("ingredients") || [];
	$scope.fridge = getLocalStorage("fridge") || [];
	$scope.fridgeNames = [];
	$scope.fridgeChecked = {};
	$scope.grocery = getLocalStorage("grocery") || [];
	$scope.groceryNames = [];
	$scope.groceryChecked = {};
	$scope.recipes = getLocalStorage("recipes") || [];

	// Util

	var saveComponent = function(component) {
		setLocalStorage(component, $scope[component]);
	}

	var isString = function (obj) {
		return Object.prototype.toString.call(obj) == '[object String]' && obj !== "";
	}

	// Ingredients

	var addIngredient = function(ingredient) {
		$scope.ingredients.push(ingredient);
		saveComponent("ingredients");
		return $scope.ingredients.length - 1;
	}

	var addOrGetIngredient = function(ingredient) {
		if(!isString(ingredient)) {
			return -1;
		}
		var index = getIngredientIndex(ingredient);
		if(index < 0) {
			index = addIngredient(ingredient);
		}
		return index;
	}

	var getIngredientIndex = function(ingredient) {
		return getItemIndex($scope.ingredients, ingredient, stringCompare);
	}

	var cacheIngredientList = function(ingredients, list, outputNames, inputChecked) {
		outputNames.length = 0;
		outputChecked = {};
		for (var i = 0; i < list.length; i++) {
			outputNames[i] = ingredients[list[i]];
			outputChecked[outputNames[i]] = inputChecked[outputNames[i]] || false;
		};

		return outputChecked;
	}

	$scope.removeFromIngredientList = function(list, listChecked, update) {
		for(var key in listChecked) {
			if(listChecked[key]) {
				var id = getIngredientIndex(key);
				var index = getItemIndex(list, id);
				if(index > -1) {
					list.splice(index, 1);
					update();
				}
			}
		}
	}

	// Fridge

	$scope.updateFridge = function() {
		$scope.fridgeChecked = cacheIngredientList($scope.ingredients, $scope.fridge, $scope.fridgeNames, $scope.fridgeChecked);
		saveComponent("fridge");
		updateForms();
	}

	$scope.updateFridge();

	$scope.addToFridge = function() {
		var text = $scope.fridgeItemName;
		if(!isString(text)) {
			console.log("invalid text");
			return;
		}
		$scope.fridgeItemName = "";
		var id = addOrGetIngredient(text);
		if(getItemIndex($scope.fridge, id) < 0) {
			$scope.fridge.push(id);
			$scope.updateFridge();
		}
		else {
			console.log(text + " already exists.");
		}
	}

	// Grocery

	$scope.updateGrocery = function() {
		$scope.groceryChecked = cacheIngredientList($scope.ingredients, $scope.grocery, $scope.groceryNames, $scope.groceryChecked);
		setLocalStorage("grocery", $scope.grocery);
		updateForms();
	}

	$scope.updateGrocery();

	$scope.addToGrocery = function() {
		var text = $scope.groceryListItemName;
		if(!isString(text)) {
			console.log("invalid text");
			return;
		}
		$scope.fridgeItemName = "";
		var index = addOrGetIngredient(text);
		$scope.groceryListItemName = "";
		if(getItemIndex($scope.grocery, index) < 0) {
			$scope.grocery.push(index);
			$scope.updateGrocery();
		}
		else {
			console.log(text + " already exists.");
		}
	}

	// Recipes

	$scope.addToRecipes = function() {
		var text = $scope.recipeInput;
		if(!isString(text)) {
			return;
		}
		$scope.recipeInput = "";
		var data = createRecipe(text);
		var index = getItemIndex($scope.recipes, data, function(item1, item2){ return item1.name.toUpperCase() === item2.name.toUpperCase(); });
		if(index < 0) {
			$scope.recipes.push(data);
			saveComponent("recipes");
			updateForms();
		}
		else {
			console.log(text + " already exists.");
		}
	}

	var createRecipe = function(name) {
		return {
			name : name,
			ingredients: [],
			// steps: [],
		}
	}
}

localStorageInit();