function MyFoodCtrl($scope) {
	$scope.ingredients = getLocalStorage("ingredients") || [];
	$scope.fridge = getLocalStorage("fridge") || [];
	$scope.fridgeNames = [];
	$scope.fridgeChecked = {};
	$scope.grocery = getLocalStorage("grocery") || [];
	$scope.groceryNames = [];
	$scope.groceryChecked = {};
	$scope.recipes = getLocalStorage("recipes") || [];

	// Ingredients

	$scope.addIngredient = function(ingredient) {
		$scope.ingredients.push(ingredient);
		setLocalStorage("ingredients", $scope.ingredients);
		return $scope.ingredients.length - 1;
	}

	$scope.addOrGetIngredient = function(ingredient) {
		if(!$scope.isString(ingredient)) {
			return -1;
		}
		var index = $scope.getIngredientIndex(ingredient);
		if(index < 0) {
			index = $scope.addIngredient(ingredient);
		}
		return index;
	}

	$scope.getIngredientIndex = function(ingredient) {
		return getItemIndex($scope.ingredients, ingredient, stringCompare);
	}

	$scope.cacheIngredientList = function(ingredients, list, outputNames, inputChecked) {
		outputNames.length = 0;
		outputChecked = {};
		for (var i = 0; i < list.length; i++) {
			outputNames[i] = ingredients[list[i]];
			outputChecked[outputNames[i]] = inputChecked[outputNames[i]] || false;
		};

		return outputChecked;
	}

	// Fridge

	$scope.updateFridge = function() {
		$scope.fridgeChecked = $scope.cacheIngredientList($scope.ingredients, $scope.fridge, $scope.fridgeNames, $scope.fridgeChecked);
		setLocalStorage("fridge", $scope.fridge);
		updateForms();
	}

	$scope.updateFridge();

	$scope.addToFridge = function() {
		var text = $scope.fridgeItemName;
		if(!$scope.isString(text)) {
			console.log("invalid text");
			return;
		}
		$scope.fridgeItemName = "";
		var id = $scope.addOrGetIngredient(text);
		if(getItemIndex($scope.fridge, id) < 0) {
			$scope.fridge.push(id);
			$scope.updateFridge();
		}
		else {
			console.log(text + " already exists.");
		}
	}

	$scope.removeFromFridge = function() {
		for(var key in $scope.fridgeChecked) {
			if($scope.fridgeChecked[key]) {
				var id = $scope.getIngredientIndex(key);
				var index = getItemIndex($scope.fridge, id);
				if(index > -1) {
					$scope.fridge.splice(index, 1);
					$scope.updateFridge();
				}
			}
		}
	}

	// Grocery

	$scope.updateGrocery = function() {
		$scope.groceryChecked = $scope.cacheIngredientList($scope.ingredients, $scope.grocery, $scope.groceryNames, $scope.groceryChecked);
		setLocalStorage("grocery", $scope.grocery);
		updateForms();
	}

	$scope.updateGrocery();

	$scope.addToGrocery = function() {
		var text = $scope.groceryListItemName;
		if(!$scope.isString(text)) {
			console.log("invalid text");
			return;
		}
		$scope.fridgeItemName = "";
		var index = $scope.addOrGetIngredient(text);
		$scope.groceryListItemName = "";
		if(getItemIndex($scope.grocery, index) < 0) {
			$scope.grocery.push(index);
			$scope.updateGrocery();
		}
		else {
			console.log(text + " already exists.");
		}
	}

	$scope.removeFromGrocery = function() {
		for(var key in $scope.groceryChecked) {
			if($scope.groceryChecked[key]) {
				var id = $scope.getIngredientIndex(key);
				var index = getItemIndex($scope.grocery, id);
				if(index > -1) {
					$scope.grocery.splice(index, 1);
					$scope.updateGrocery();
				}
			}
		}
	}

	// Recipes

	$scope.addToRecipes = function() {
		var text = $scope.recipeInput;
		if(!$scope.isString(text)) {
			return;
		}
		$scope.recipeInput = "";
		var data = {"name": text};
		var index = getItemIndex($scope.recipes, data, function(item1, item2){ return item1.name.toUpperCase() === item2.name.toUpperCase(); });
		if(index < 0) {
			$scope.recipes.push(data);
			setLocalStorage("recipes", $scope.recipes);
			updateForms();
		}
		else {
			console.log(text + " already exists.");
		}
	}

	// Util
	$scope.isString = function (obj) {
		return Object.prototype.toString.call(obj) == '[object String]' && obj !== "";
	}
}

localStorageInit();