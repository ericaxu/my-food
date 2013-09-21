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

function initPage() {
	expandPanel();
	$(".groceryListItem").each(function() {
		$(this).attr("draggable", "true");
	});	
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
}).on("pageinit", "*", initPage);

// Drag and drop\