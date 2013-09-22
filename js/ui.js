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

function onReize() {
	console.log("resize");//t
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var bucketWidth = $("#left-bucket").width();
	var bucketHeight = $("#left-bucket").height();
	console.log(windowWidth - $("#left-bucket").width());
	$(".bucket").css("top", (windowHeight-bucketHeight)/2-5)
	$("#right-bucket").css("left", windowWidth - 2 * $("#left-bucket").width() + 5);
	expandPanel(windowHeight);
}

function expandPanel(height) {
	$(".slide-menu, .ui-panel-inner").height(height);
}

function initDraggables() {
	var originalWidth = 0;
	$(".listItem").draggable({
		cursor: "move",
		distance: 10,
		opacity: 1,
		stack: "*",
		zIndex: 99999,
		revert: "invalid",
		revertDuration: 100,
		start: function (evt, ui) {
			originalWidth = $(this).width();
			$(this).width(100);
		},
		stop: function (evt, ui) {
			$(this).width(originalWidth);
		},
		cursorAt: { top: 20, left: 50 }
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
	var listItemWidth = $(".listItem").eq(0).width();
	onReize();
	// initDraggables(listItemWidth);
	// initDroppables();
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

$(window).resize(onReize);
