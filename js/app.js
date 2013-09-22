function MyFoodCtrl($scope) {

	// Util

	var saveComponent = function(component) {
		setLocalStorage(component, $scope[component]);
	}

	var isString = function (obj) {
		return Object.prototype.toString.call(obj) == '[object String]' && obj !== "";
	}

	// Ingredients

	$scope.ingredients = getLocalStorage("ingredients") || [];

	$scope.ingredientAdd = function(ingredient) {
		$scope.ingredients.push(ingredient);
		saveComponent("ingredients");
		return $scope.ingredients.length - 1;
	}

	$scope.ingredientAddOrGet = function(ingredient) {
		if(!isString(ingredient)) {
			return -1;
		}
		var index = $scope.ingredientGetIndex(ingredient);
		if(index < 0) {
			index = $scope.ingredientAdd(ingredient);
		}
		return index;
	}

	$scope.ingredientGetIndex = function(ingredient) {
		return getItemIndex($scope.ingredients, ingredient, stringCompare);
	}

	// IngredientList

	$scope.ingredientListCreate = function(save, list) {
		var ingredientList = {
			save: save,
			list: list,
			names: [],
			checked: {},
			input: "",
		}
		$scope.ingredientListUpdate(ingredientList);
		return ingredientList;
	}

	$scope.ingredientListCacheNames = function(ingredientList) {
		ingredientList.names = [];
		var oldChecked = ingredientList.checked;
		ingredientList.checked = {};
		for (var i = 0; i < ingredientList.list.length; i++) {
			ingredientList.names[i] = $scope.ingredients[ingredientList.list[i]];
			ingredientList.checked[ingredientList.names[i]] = oldChecked[ingredientList.names[i]] || false;
		};
	}

	$scope.ingredientListUpdate = function(ingredientList) {
		$scope.ingredientListCacheNames(ingredientList);
		ingredientList.save(ingredientList.list);
		updateForms();
	}

	$scope.ingredientListAddInput = function(ingredientList) {
		$scope.ingredientListAdd(ingredientList, ingredientList.input)
		ingredientList.input = "";
	}

	$scope.ingredientListAdd = function(ingredientList, ingredient) {
		if(!isString(ingredient)) {
			showDialog("Error", "The input data is not valid");
			return;
		}
		var id = $scope.ingredientAddOrGet(ingredient);
		if(getItemIndex(ingredientList.list, id) < 0) {
			ingredientList.list.push(id);
			$scope.ingredientListUpdate(ingredientList);
		}
		else {
			showDialog("Error", ingredient + " already exists.");
		}
	}

	$scope.ingredientListRemove = function(ingredientList, callback, callbackArgument) {
		for(var key in ingredientList.checked) {
			if(ingredientList.checked[key]) {
				var id = $scope.ingredientGetIndex(key);
				if(callback) {
					callback(callbackArgument, key);
				}
				var index = getItemIndex(ingredientList.list, id);
				if(index > -1) {
					ingredientList.list.splice(index, 1);
					$scope.ingredientListUpdate(ingredientList);
				}
			}
		}
	}

	// Fridge

	$scope.fridge = $scope.ingredientListCreate(function(list){setLocalStorage("fridge", list);}, getLocalStorage("fridge") || []);

	$scope.fridgeAdd = function() {
		$scope.ingredientListAddInput($scope.fridge);
	}

	$scope.fridgeRemove = function() {
		$scope.ingredientListRemove($scope.fridge);
	}

	$scope.fridgeMoveToGrocery = function() {
		$scope.ingredientListRemove($scope.fridge, $scope.ingredientListAdd, $scope.grocery);
		changePage("#groceryList");
	}

	// Grocery

	$scope.grocery = $scope.ingredientListCreate(function(list){setLocalStorage("grocery", list);}, getLocalStorage("grocery") || []);

	$scope.groceryAdd = function() {
		$scope.ingredientListAddInput($scope.grocery);
	}

	$scope.groceryRemove = function() {
		$scope.ingredientListRemove($scope.grocery);
	}

	$scope.groceryMoveToFridge = function() {
		$scope.ingredientListRemove($scope.grocery, $scope.ingredientListAdd, $scope.fridge);
		changePage("#fridge");
	}

	// Recipes
	$scope.recipes = getLocalStorage("recipes") || [];

	$scope.recipesAdd = function() {
		var text = $scope.recipeInput;
		if(!isString(text)) {
			return;
		}
		$scope.recipeInput = "";
		var data = recipeCreate(text);
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

/*
	$scope.activeRecipe = {};
	$scope.activeRecipeIngredientsNames = [];
	$scope.activeRecipeIngredientsChecked = {};

	$scope.activeRecipeSet = function(recipe) {
		$scope.activeRecipe = recipe;
		$scope.activeRecipeUpdate();
	}

	$scope.activeRecipeUpdate = function() {
		$scope.activeRecipeIngredientsChecked = $scope.ingredientCacheList($scope.ingredients, $scope.activeRecipe, $scope.activeRecipeIngredientsNames, $scope.activeRecipeIngredientsChecked);
		//TODO: setLocalStorage("grocery", $scope.grocery);
		updateForms();
	}
	
	$scope.activeRecipeIngredientsAdd = function() {
		//$scope.activeRecipeIngredientsAddIngredient($scope.groceryListItemName);
		//$scope.activeRecipeIngredientsListItemName = "";
	}

	$scope.activeRecipeIngredientsAddIngredient = function(ingredient) {
		//$scope.ingredientListAdd(ingredient, $scope.grocery, $scope.groceryUpdate);
	}

	$scope.activeRecipeIngredientsRemove = function() {
		//$scope.ingredientListRemove($scope.grocery, $scope.groceryChecked, $scope.groceryUpdate);
	}

	$scope.activeRecipeIngredientsCopyToGrocery = function() {
		//$scope.ingredientListRemove($scope.grocery, $scope.groceryChecked, $scope.groceryUpdate, $scope.fridgeAddIngredient);
		//changePage("#fridge");
	}
*/
	var recipeCreate = function(name) {
		return {
			name : name,
			ingredients: [],
			// steps: [],
		}
	}
}

localStorageInit();