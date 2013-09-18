function NavBarCtrl($scope) {
	$scope.selection = "";
	$scope.switchPanel = function (newPanel) {
		$scope.selection = newPanel;
	}
}

function GroceryListCtrl($scope) {
	$scope.groceryList = [
		{ name: "Potato", done: false },
		{ name: "Fish", done: false }
	];

	$scope.addItem = function() {
		$scope.groceryList.push({ name: $scope.itemName, done: false });
		$scope.itemName = "";
		return false;
	};

	$scope.remaining = function() {
		var count = 0;
		angular.forEach($scope.groceryList, function(item) {
			count += item.done ? 0 : 1;
		});
		return count;
	};

	$scope.archive = function() {
		var oldGroceryList = $scope.groceryList;
		$scope.groceryList = [];
		angular.forEach(oldGroceryList, function(item) {
			if (!item.done) $scope.groceryList.push(item);
		});
	};
}