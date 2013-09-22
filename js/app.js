function MyFoodCtrl($scope) {

	// Util

	var saveComponent = function(component) {
		setLocalStorage(component, $scope[component]);
	}

	var isString = function (obj) {
		return Object.prototype.toString.call(obj) == '[object String]' && obj !== "";
	}

	// Generic

	$scope.genericListAddWithCheck = function(item, callback) {
		if(!isString(item)) {
			showPopup("The input data cannot be empty.");
			return;
		}
		if(!callback()) {
			showPopup(item + " already exists.");
		}
	}

	// GenericList

	function GenericList() {
		this.list = [];
		this.names = [];
		this.checked = {};
		this.numChecked = 0;
		this.input = "";
		this.triggerUpdate(true);
	}

	GenericList.prototype.update = function () {
	}

	GenericList.prototype.idToName = function (id) {
	}

	GenericList.prototype.nameToId = function (name) {
	}

	GenericList.prototype.getOrCreate = function (item) {
		return 0;
	}

	GenericList.prototype.triggerUpdate = function (ignoreSave) {
		this.cacheNames();
		if(!ignoreSave) {
			this.update();
		}
	}

	GenericList.prototype.cacheNames = function () {
		this.names = [];
		var oldChecked = this.checked;
		this.checked = {};
		for (var i = 0; i < this.list.length; i++) {
			this.names[i] = this.idToName(this.list[i]);
			this.checked[this.names[i]] = oldChecked[this.names[i]] || false;
		}
		this.names.sort();
	}

	GenericList.prototype.updateChecks = function() {
		this.numChecked = 0;
		for (var i = 0; i < this.list.length; i++) {
			var name = this.idToName(this.list[i]);
			if(this.checked[name]) {
				this.numChecked++;
			}
		}
	}

	GenericList.prototype.clearChecks = function() {
		for (var i = 0; i < this.list.length; i++) {
			var name = this.idToName(this.list[i]);
			this.checked[name] = false;
		}
	}

	GenericList.prototype.callChecks = function(callback) {
		for(var key in this.checked) {
			if(this.checked[key]) {
				callback(key);
			}
		}
	}

	GenericList.prototype.addFromInput = function() {
		this.add(this.input);
		this.input = "";
	}

	GenericList.prototype.add = function(item) {
		var thisLocal = this;
		$scope.genericListAddWithCheck(item, function(){
			var id = thisLocal.getOrCreate(item);
			if(getItemIndex(thisLocal.list, id) < 0) {
				thisLocal.list.push(id);
				thisLocal.triggerUpdate();
				return true;
			}
		});
	}

	GenericList.prototype.remove = function() {
		this.copy(false, true);
	}

	GenericList.prototype.move = function(destination) {
		this.copy(destination, true);
	}

	GenericList.prototype.copy = function(destination, del) {
		var thisLocal = this;
		this.callChecks(function(key) {
			if(destination) {
				destination.add(key);
			}
			if(del) {
				var id = thisLocal.nameToId(key);
				var index = getItemIndex(thisLocal.list, id);
				if(index > -1) {
					thisLocal.list.splice(index, 1);
					thisLocal.triggerUpdate();
				}
			}
		});
		this.clearChecks();
	}

	// Ingredients

	$scope.ingredients = getLocalStorage("ingredients") || [];

	function IngredientList(list, save) {
		this.list = list;
		this.saveFunc = save;
		this.triggerUpdate(true);
	}

	IngredientList.prototype = new GenericList();

	IngredientList.prototype.update = function () {
		this.saveFunc(this.list);
		updateForms();
	}

	IngredientList.prototype.idToName = function (id) {
		return $scope.ingredients[id];
	}

	IngredientList.prototype.nameToId = function (ingredient) {
		return getItemIndex($scope.ingredients, ingredient, stringCompare);
	}

	IngredientList.prototype.getOrCreate = function (ingredient) {
		if(!isString(ingredient)) {
			return -1;
		}
		var index = this.nameToId(ingredient);
		if(index < 0) {
			$scope.ingredients.push(ingredient);
			saveComponent("ingredients");
			index = $scope.ingredients.length - 1;
		}
		return index;
	}

	// Fridge

	$scope.fridge = new IngredientList(
		getLocalStorage("fridge") || [],
		function(list){
			setLocalStorage("fridge", list);
			$scope.fridgeUpdateChecks();
		}
	);

	$scope.fridgeAdd = function() {
		$scope.fridge.addFromInput();
	}

	$scope.fridgeRemove = function() {
		$scope.fridge.remove();
	}

	$scope.fridgeMoveToGrocery = function() {
		$scope.fridge.move($scope.grocery);
		changePage("#groceryList");
	}

	$scope.fridgeUpdateChecks = function() {
		$scope.fridge.updateChecks();
		if($scope.fridge.numChecked > 0) {
			footerShow();
		}
		else {
			footerHide();
		}
	}

	// Grocery

	$scope.grocery = new IngredientList(
		getLocalStorage("grocery") || [],
		function(list){
			setLocalStorage("grocery", list);
			$scope.groceryUpdateChecks();
		}
	);

	$scope.groceryAdd = function() {
		$scope.grocery.addFromInput();
	}

	$scope.groceryRemove = function() {
		$scope.grocery.remove();
	}

	$scope.groceryMoveToFridge = function() {
		$scope.grocery.move($scope.fridge);
		changePage("#fridge");
	}

	$scope.groceryUpdateChecks = function() {
		$scope.grocery.updateChecks();
		if($scope.grocery.numChecked > 0) {
			footerShow();
		}
		else {
			footerHide();
		}
	}


	// Recipes

	$scope.recipes = getLocalStorage("recipes") || [];

	var recipeCompare = function(item1, item2){ return item1.name.toUpperCase() === item2.name.toUpperCase(); };

	function RecipeList(list, save) {
		this.list = list;
		this.saveFunc = save;
		this.triggerUpdate(true);
	}

	RecipeList.prototype = new GenericList();

	RecipeList.prototype.update = function () {
		this.saveFunc(this.list);
		updateForms();
	}

	RecipeList.prototype.idToName = function (id) {
		return $scope.recipes[id].name;
	}

	RecipeList.prototype.nameToId = function (name) {
		return getItemIndex($scope.recipes, {name: name}, recipeCompare);
	}

	RecipeList.prototype.getOrCreate = function (recipeName) {
		if(!isString(recipeName)) {
			return -1;
		}

		var index = this.nameToId(recipeName);
		if(index < 0) {
			var recipe = {
				name : recipeName,
				ingredients: [],
				// steps: [],
			};
			$scope.recipes.push(recipe);
			saveComponent("recipes");
			index = $scope.recipes.length - 1;
		}
		
		return index;
	}
	
	// Recipes page

	$scope.recipe = new RecipeList(
		getLocalStorage("recipe") || [],
		function(list){
			setLocalStorage("recipe", list);
			$scope.recipeUpdateChecks();
		}
	);

	$scope.recipeAdd = function() {
		$scope.recipe.addFromInput();
	}

	$scope.recipeRemove = function() {
		$scope.recipe.remove();
	}

	$scope.recipeCopeToGrocery = function() {
		$scope.recipe.copy($scope.grocery);
		showPopup("Items copied to grocery.");
		//changePage("#fridge");
	}

	$scope.recipeUpdateChecks = function() {
		$scope.recipe.updateChecks();
		if($scope.recipe.numChecked > 0) {
			footerShow();
		}
		else {
			footerHide();
		}
	}

/*
	// Active Recipes

	$scope.activeRecipe = null;

	$scope.activeRecipeSet = function(recipe) {
		$scope.activeRecipe = recipe;
		if(recipe) {
			$scope.genericListCreate(
				recipe.ingredients, 
				function(list){
					saveComponent("recipes");
					$scope.activeRecipeUpdateChecks();
				},
				$scope.ingredientGetIndex
			);
		}
	}

	$scope.activeRecipeAdd = function() {
		$scope.genericListAddInput($scope.activeRecipe, $scope.ingredientAddOrGet);
	}

	$scope.activeRecipeRemove = function() {
		$scope.genericListRemove($scope.activeRecipe);
	}

	$scope.activeRecipeCopyToGrocery = function() {
		$scope.genericListCopy($scope.activeRecipe, $scope.grocery);
		showPopup("Items moved to grocery.");
	}

	$scope.activeRecipeUpdateChecks = function() {
		$scope.genericListCheckedUpdate($scope.activeRecipe);
		if($scope.activeRecipe.numChecked > 0) {
			footerShow();
		}
		else {
			footerHide();
		}
	}*/
}

localStorageInit();