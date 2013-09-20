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
		$("#slide-menu").panel("close");
	}
	// $("[data-role='page']").on("pageinit", function (evt) {
	// 	$(".listview").listview().listview("refresh");
	// });
}

function MyFridgeCtrl($scope) {
	$scope.fridgeItems = getLocalStorage("myFridge") || [];

	$scope.addItem = function() {
		$scope.fridgeItems.push($scope.itemName);
		setLocalStorage("myFridge", $scope.fridgeItems);
		$scope.itemName = "";
	};
}

function GroceryListCtrl($scope) {
	$scope.groceryList = getLocalStorage("groceryList") || [];

	$scope.addItem = function() {
		$scope.groceryList.push($scope.itemName);
		setLocalStorage("groceryList", $scope.groceryList);
		$scope.itemName = "";
	};

}

function MealPlannerCtrl($scope) {
	$scope.toCook = getLocalStorage("mealPlanner") || [];

	$scope.addItem = function() {
		$scope.toCook.push({ name: $scope.itemName, done: false });
		setLocalStorage("mealPlanner", $scope.toCook);
		$scope.itemName = "";
		return false;
	};

}

function MyDishesCtrl($scope) {
	$scope.myDishes = getLocalStorage("myDishes") || [];

	$scope.addItem = function() {
		$scope.myDishes.push({ name: $scope.itemName, done: false });
		setLocalStorage("mealPlanner", $scope.myDishes);
		$scope.itemName = "";
		return false;
	};

}

localStorageInit();