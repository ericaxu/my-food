function NavBarCtrl($scope) {
	var headerMapping = {
		myFridge: "My Fridge",
		groceryList: "Grocery List",
		mealPlanner: "Meal Planner",
		myDishes: "My Dishes"
	}
	$scope.selection = "";
	$scope.heading = "Main Page";
	$scope.switchPanel = function (newPanel) {
		$scope.selection = newPanel;
		$scope.heading = headerMapping[newPanel];
	}
}

function MyFridgeCtrl($scope) {
	$scope.fridgeItems = getLocalStorage("myFridge") || [];

	$scope.addItem = function() {
		$scope.fridgeItems.push($scope.itemName);
		setLocalStorage("myFridge", $scope.fridgeItems);
		$scope.itemName = "";
		return false;
	};
}

function GroceryListCtrl($scope) {
	$scope.groceryList = getLocalStorage("groceryList") || [];

	$scope.addItem = function() {
		$scope.groceryList.push({ name: $scope.itemName, done: false });
		setLocalStorage("groceryList", $scope.groceryList);
		$scope.itemName = "";
		return false;
	};

}

localStorageInit();