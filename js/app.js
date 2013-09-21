function MyFoodCtrl($scope) {
	$scope.ingredients = getLocalStorage("ingredients") || [];
	$scope.fridge = getLocalStorage("fridge") || [];
	$scope.fridgeNames = [];
	$scope.grocery = getLocalStorage("grocery") || [];
	$scope.groceryNames = [];

	// Ingredients

	$scope.addIngredient = function(ingredient) {
		$scope.ingredients.push(ingredient);
		setLocalStorage("ingredients", $scope.ingredients);
		return $scope.ingredients.length - 1;
	}

	$scope.addOrGetIngredient = function(ingredient) {
		var index = $scope.getIngredientIndex(ingredient);
		if(index < 0) {
			index = $scope.addIngredient(ingredient);
		}
		return index;
	}

	$scope.getIngredientIndex = function(ingredient) {
		return getItemIndex($scope.ingredients, ingredient, true);
	}

	$scope.cacheIngredientList = function(ingredients, list, output) {
		output.length = 0;
		for (var i = 0; i < list.length; i++) {
			output[i] = ingredients[list[i]];
		};
	}

	// Fridge

	$scope.addToFridge = function() {
		var index = $scope.addOrGetIngredient($scope.myFridgeItemName);
		$scope.myFridgeItemName = "";
		if(getItemIndex($scope.fridge, index) < 0) {
			$scope.fridge.push(index);
			$scope.cacheIngredientList($scope.ingredients, $scope.fridge, $scope.fridgeNames);
			setLocalStorage("fridge", $scope.fridge);
		}
	}

	$scope.cacheIngredientList($scope.ingredients, $scope.fridge, $scope.fridgeNames);

	// Grocery

	$scope.addToGrocery = function() {
		var index = $scope.addOrGetIngredient($scope.groceryListItemName);
		$scope.groceryListItemName = "";
		if(getItemIndex($scope.grocery, index) < 0) {
			$scope.grocery.push(index);
			$scope.cacheIngredientList($scope.ingredients, $scope.grocery, $scope.groceryNames);
			setLocalStorage("grocery", $scope.grocery);
		}
	}

	$scope.cacheIngredientList($scope.ingredients, $scope.grocery, $scope.groceryNames);
}

localStorageInit();