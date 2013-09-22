function MyFoodCtrl($scope) {

	// Util

	var saveComponent = function(component) {
		setLocalStorage(component, $scope[component]);
	}

	var isString = function (obj) {
		return Object.prototype.toString.call(obj) == '[object String]' && obj !== "";
	}

	// Generic

	$scope.genericListAdd = function(item, callback) {
		if(!isString(item)) {
			showDialog("Error", "The input data cannot be empty.");
			return;
		}
		if(!callback()) {
			showDialog("Error", item + " already exists.");
		}
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

	$scope.ingredientListCheckedAction = function(ingredientList, callback) {
		for(var key in ingredientList.checked) {
			if(ingredientList.checked[key]) {
				callback(key);
			}
		}
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
		$scope.genericListAdd(ingredient, function(){
			var id = $scope.ingredientAddOrGet(ingredient);
			if(getItemIndex(ingredientList.list, id) < 0) {
				ingredientList.list.push(id);
				$scope.ingredientListUpdate(ingredientList);
				return true;
			}
		});
	}

	$scope.ingredientListRemove = function(ingredientList) {
		$scope.ingredientListCopy(ingredientList, false, true);
	}

	$scope.ingredientListMove = function(ingredientList, destinationIngredientList) {
		$scope.ingredientListCopy(ingredientList, destinationIngredientList, true);
	}

	$scope.ingredientListCopy = function(ingredientList, destinationIngredientList, del) {
		$scope.ingredientListCheckedAction(ingredientList, function(key) {
			if(destinationIngredientList) {
				$scope.ingredientListAdd(destinationIngredientList, key);
			}
			if(del) {
				var id = $scope.ingredientGetIndex(key);
				var index = getItemIndex(ingredientList.list, id);
				if(index > -1) {
					ingredientList.list.splice(index, 1);
					$scope.ingredientListUpdate(ingredientList);
				}
			}
		});
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
		$scope.ingredientListMove($scope.fridge, $scope.grocery);
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
		$scope.ingredientListMove($scope.grocery, $scope.fridge);
		changePage("#fridge");
	}

	// Recipes

	$scope.recipes = getLocalStorage("recipes") || [];

	$scope.recipesAdd = function() {
		var text = $scope.recipeInput;
		$scope.recipeInput = "";

		$scope.genericListAdd(text, function(){
			var data = $scope.recipeCreate(text);
			var index = getItemIndex($scope.recipes, data, function(item1, item2){ return item1.name.toUpperCase() === item2.name.toUpperCase(); });
			if(index < 0) {
				$scope.recipes.push(data);
				saveComponent("recipes");
				updateForms();
				return true;
			}
		});
	}

	$scope.recipeCreate = function(name) {
		return {
			name : name,
			ingredients: [],
			// steps: [],
		}
	}

	// Active Recipes

	$scope.activeRecipe = {};

	$scope.activeRecipeSet = function(recipe) {
		$scope.activeRecipe = recipe;
		$scope.ingredientListCreate(function(list){saveComponent("recipes");}, $scope.activeRecipe.ingredients);
	}

	$scope.activeRecipeAdd = function() {
		$scope.ingredientListAddInput($scope.activeRecipe);
	}

	$scope.activeRecipeRemove = function() {
		$scope.ingredientListRemove($scope.activeRecipe);
	}

	$scope.activeRecipeCopyToGrocery = function() {
		$scope.ingredientListCopy($scope.activeRecipe, $scope.grocery);
		showDialog("Done", "Items moved to grocery.");
	}
}

localStorageInit();