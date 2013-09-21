function detectDragAndDrop () {
	var isDragging = false;
	$("span").mousedown(function() {
		$(window).mousemove(function() {
			isDragging = true;
			$(window).unbind("mousemove");
		});
	})
	.mouseup(function() {
		var wasDragging = isDragging;
		isDragging = false;
		$(window).unbind("mousemove");
		if (!wasDragging) {
			// ...
		} else {
			// ...
		}
	});
}

function expandPanel() {
	var documentHeight = $(document).height();
	$(".slide-menu, .ui-panel-inner").height(documentHeight);
}

function initDraggables() {
	$(".listItem").draggable({
		cursor: "move",
		distance: 10,
		opacity: 1,
		stack: "*",
		zIndex: 99999,
		revert: "invalid",
		revertDuration: 100
	});
}

function initDroppables() {
	$(".bucket").droppable({
		accept: ".listItem",
		tolerance: "touch",
		hoverClass: "activeBucket"
	});
}

function initPage() {
	expandPanel();
	initDraggables();
	initDroppables();
	updateForms();
}

function updateForms() {
	setTimeout(function(){
		if($.mobile.activePage){
			$.mobile.activePage.trigger("create");
		}
	}, 0);
}

detectDragAndDrop();

$(document).on("submit", "form", function(e) {
	var currentPage = $.mobile.activePage.attr("id")
	$("#" + currentPage).find(".submit").click();
	e.preventDefault();
	e.stopImmediatePropagation();
}).bind("mobileinit", function () {
	$.mobile.ajaxEnabled = false;
	initPage();
}).on("click", ".link", function() {
	var newPage = $(this).attr("class").split(" ")[1];
	$.mobile.changePage("#"+newPage, {
		transition: "slide"
	});
	initPage();
}).on("pageinit", initPage);
