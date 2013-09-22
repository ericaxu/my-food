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
			showPopup("The input cannot be empty.");
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
		var result = this.add(this.input);
		this.input = "";
		return result;
	}

	GenericList.prototype.add = function(item) {
		var thisLocal = this;
		var result = null;
		$scope.genericListAddWithCheck(item, function(){
			var id = thisLocal.getOrCreate(item);
			if(getItemIndex(thisLocal.list, id) < 0) {
				thisLocal.list.push(id);
				thisLocal.triggerUpdate();
				result = item;
				return true;
			}
		});
		return result;
	}

	GenericList.prototype.remove = function() {
		return this.copy(false, true);
	}

	GenericList.prototype.move = function(destination) {
		return this.copy(destination, true);
	}

	GenericList.prototype.copy = function(destination, del) {
		var thisLocal = this;
		var num = 0;
		this.callChecks(function(key) {
			if(destination) {
				destination.add(key);
			}
			if(del) {
				var id = thisLocal.nameToId(key);
				var index = getItemIndex(thisLocal.list, id);
				if(index > -1) {
					thisLocal.list.splice(index, 1);
				}
			}
			num++;
		});
		this.clearChecks();
		thisLocal.triggerUpdate();
		return num;
	}

	// Ingredients

	$scope.ingredients = getLocalStorage("ingredients") || [];

	function IngredientList(list, save) {
		this.list = list;
		this.saveFunc = save;
		if(list) {
			this.triggerUpdate(true);
		}
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
		var id = this.nameToId(ingredient);
		if(id < 0) {
			$scope.ingredients.push(ingredient);
			saveComponent("ingredients");
			id = $scope.ingredients.length - 1;
		}
		return id;
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
		var num = $scope.fridge.move($scope.grocery);
		showPopup(num + " item" + (num > 1 ? "s" : "") + " moved to grocery list.");
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
		var num = $scope.grocery.move($scope.fridge);
		showPopup(num + " item" + (num > 1 ? "s" : "") + " moved to my fridge.");
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
		if(list) {
			this.triggerUpdate(true);
		}
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
		var result = $scope.recipe.addFromInput();
		if(result) {
			$scope.recipeIngredientsOpen(result);
		}
	}

	$scope.recipeRemove = function() {
		$scope.recipe.remove();
	}

	$scope.recipeCopyToMeal = function() {
		var num = $scope.recipe.copy($scope.meal);
		showPopup(num + " item" + (num > 1 ? "s" : "") + " copied to Meal Planner.");
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
	
	// Meal Planner page

	$scope.meal = new RecipeList(
		getLocalStorage("meal") || [],
		function(list){
			setLocalStorage("meal", list);
			$scope.mealUpdateChecks();
		}
	);

	$scope.mealViewDetails = function() {
		var lastKey = "";
		$scope.meal.callChecks(function(key) {
			lastKey = key;
		});

		$scope.recipeIngredientsOpen(lastKey);
	}

	$scope.mealRemove = function() {
		$scope.meal.remove();
	}

	$scope.mealUpdateChecks = function() {
		$scope.meal.updateChecks();
		if($scope.meal.numChecked > 0) {
			footerShow();
		}
		else {
			footerHide();
		}
	}


	// Active Recipes

	function RecipeIngredientList(list, save) {
		this.list = list;
		this.saveFunc = save;

		this.inFridge = {};
		this.inGrocery = {};
		this.missing = {};

		this.triggerUpdate(true);
	}

	RecipeIngredientList.prototype = new IngredientList();

	RecipeIngredientList.prototype.cacheLists = function () {
		for (var i = 0; i < this.names.length; i++) {
			var inFridge = getItemIndex($scope.fridge.names, this.names[i]) > -1;
			var inGrocery = getItemIndex($scope.grocery.names, this.names[i]) > -1;
			this.inFridge[this.names[i]] = inFridge;
			this.inGrocery[this.names[i]] = inGrocery;
			this.missing[this.names[i]] = (!inFridge && !inGrocery);
		}
	}

	RecipeIngredientList.prototype.triggerUpdate = function (ignoreSave) {
		RecipeList.prototype.triggerUpdate.call(this, true);
		this.cacheLists();
		if(!ignoreSave) {
			this.update();
		}
	}

	$scope.recipeIngredients = null;

	$scope.previousActiveRecipe = getLocalStorage("previousActiveRecipe");

	$scope.recipeIngredientsOpen = function(recipe) {
		$scope.activeRecipeSet(recipe);
		changePage("#recipeIngredients");
	}

	$scope.activeRecipeSet = function(recipe, preventNavigate) {
		var id = $scope.recipe.nameToId(recipe);
		recipe = $scope.recipes[id];
		// Initialize the IngredientList
		$scope.recipeIngredients = new RecipeIngredientList(
			recipe.ingredients,
			function(list){
				saveComponent("recipes");
				$scope.groceryUpdateChecks();
			}
		);
		// Set page title
		$("#recipeIngredientsTitle").text("Ingredients for " + recipe.name);
		// History
		$scope.previousActiveRecipe = recipe.name;
		saveComponent("previousActiveRecipe");
		// Refresh view
		setTimeout(function(){
			if($("#recipeIngredientList").hasClass("ui-controlgroup")) {
				$("#recipeIngredients").trigger("create");
			}
		}, 0);
	}

	if($scope.previousActiveRecipe) {
		$scope.activeRecipeSet($scope.previousActiveRecipe);
	}

	$scope.recipeIngredientsAdd = function() {
		$scope.recipeIngredients.addFromInput();
	}

	$scope.recipeIngredientsRemove = function() {
		$scope.recipeIngredients.remove();
	}

	$scope.recipeIngredientsCopyToGrocery = function() {
		var num = $scope.recipeIngredients.copy($scope.grocery);
		showPopup(num + " item" + (num > 1 ? "s" : "") + " copied to grocery list.");
	}

	$scope.recipeIngredientsUpdateChecks = function() {
		$scope.recipeIngredients.updateChecks();
		if($scope.recipeIngredients.numChecked > 0) {
			footerShow();
		}
		else {
			footerHide();
		}
	}
}

localStorageInit();