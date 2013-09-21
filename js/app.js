function MyFoodCtrl($scope) {
	$scope.ingredients = getLocalStorage("ingredients") || [];
	$scope.fridge = getLocalStorage("fridge") || [];
	$scope.grocery = getLocalStorage("grocery") || [];

	$scope.fridgeItems = getLocalStorage("myFridge") || [];
	$scope.groceryList = getLocalStorage("groceryList") || [];

	//Ingredients

	$scope.addIngredient= function(ingredient) {
		$scope.ingredients.push(ingredient);
		setLocalStorage("ingredients", $scope.ingredients);
	}

	$scope.addOrGetIngredient = function(ingredient) {
		var index = $scope.getItemIndex($scope.ingredients, ingredient, true);
		if(index < 0) {
			$scope.addIngredient(ingredient);
			index = $scope.getItemIndex($scope.ingredients, ingredient, true);
		}
		return index;
	}

	//Fridge

	$scope.addToFridge = function() {
		var index = $scope.addOrGetIngredient($scope.myFridgeItemName);
		$scope.myFridgeItemName = "";
		if(!$scope.getItemIndex($scope.fridge, index, false)) {
			$scope.fridge.push(index);
			$scope.cacheFridge();
			setLocalStorage("fridge", $scope.fridge);
		}
	}

	$scope.cacheFridge = function() {
		$scope.fridgeString = [];
		for (var i = 0; i < $scope.fridge.length; i++) {
			$scope.fridgeString[i] = $scope.ingredients[$scope.fridge[i]];
		};
	}
	$scope.cacheFridge();

	$scope.addToGrocery = function() {
		
	}

	$scope.getItemIndex = function(array, item, ignorecase) {
		for (var i = array - 1; i >= 0; i--) {
			if(ignorecase && item.toUpperCase() === array[i].toUpperCase()) {
				return i;
			}
			else if(item === array[i]) {
				return i;
			}
		}
		return -1;
	}

	$scope.addToMyFridge = function() {
		$scope.fridgeItems.push($scope.myFridgeItemName);
		setLocalStorage("myFridge", $scope.fridgeItems);
		$scope.myFridgeItemName = "";
	};	

	$scope.addToGroceryList = function() {
		$scope.groceryList.push($scope.groceryListItemName);
		setLocalStorage("groceryList", $scope.groceryList);
		$scope.groceryListItemName = "";
	};
}

localStorageInit();