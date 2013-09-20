function MyFoodCtrl($scope) {
	$scope.fridgeItems = getLocalStorage("myFridge") || [];
	$scope.groceryList = getLocalStorage("groceryList") || [];

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