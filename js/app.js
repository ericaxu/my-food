function MyFoodCtrl($scope) {
	$scope.ingredients = getLocalStorage("ingredients") || [];
	$scope.fridge = getLocalStorage("fridge") || [];
	$scope.fridgeNames = [];
	$scope.grocery = getLocalStorage("grocery") || [];
	$scope.groceryNames = [];
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

	$scope.cacheIngredientList = function(ingredients, list, output) {
		output.length = 0;
		for (var i = 0; i < list.length; i++) {
			output[i] = ingredients[list[i]];
		};
	}

	// Fridge

	$scope.addToFridge = function() {
		var text = $scope.fridgeItemName;
		if(!$scope.isString(text)) {
			return;
		}
		$scope.fridgeItemName = "";
		var index = $scope.addOrGetIngredient(text);
		if(getItemIndex($scope.fridge, index) < 0) {
			$scope.fridge.push(index);
			$scope.cacheIngredientList($scope.ingredients, $scope.fridge, $scope.fridgeNames);
			setLocalStorage("fridge", $scope.fridge);
			updateForms();
		}
	}

	$scope.cacheIngredientList($scope.ingredients, $scope.fridge, $scope.fridgeNames);

	// Grocery

	$scope.addToGrocery = function() {
		var text = $scope.groceryListItemName;
		if(!$scope.isString(text)) {
			return;
		}
		$scope.fridgeItemName = "";
		var index = $scope.addOrGetIngredient(text);
		$scope.groceryListItemName = "";
		if(getItemIndex($scope.grocery, index) < 0) {
			$scope.grocery.push(index);
			$scope.cacheIngredientList($scope.ingredients, $scope.grocery, $scope.groceryNames);
			setLocalStorage("grocery", $scope.grocery);
			updateForms();
		}
	}

	$scope.cacheIngredientList($scope.ingredients, $scope.grocery, $scope.groceryNames);

	// Dishes

	$scope.addToRecipe = function() {
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
	}

	// Util
	$scope.isString = function (obj) {
		return Object.prototype.toString.call(obj) == '[object String]' && obj.trim() !== "";
	}
}

localStorageInit();