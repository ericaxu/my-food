function detectDragAndDrop () {
	var isDragging = false;
	$("span").mousedown(function() {
		console.log("mousedown");//t
		$(window).mousemove(function() {
			isDragging = true;
			console.log("is dragging");//t
			$(window).unbind("mousemove");
		});
	})
	.mouseup(function() {
		var wasDragging = isDragging;
		isDragging = false;
		$(window).unbind("mousemove");
		if (!wasDragging) {
			$("#throbble").toggle();
		} else {
			console.log("dropped");//t
		}
	});
}

function expandPanel() {
	console.log("expandPanel");//t
	var documentHeight = $(document).height();
	console.log(documentHeight);//t
	$(".slide-menu, .ui-panel-inner").height(documentHeight);
	console.log($(".ui-panel-inner").height());//t
}

detectDragAndDrop();

$(document).on("submit", "form", function(e) {
	var currentPage = $.mobile.activePage.attr("id")
	$("#" + currentPage).find(".submit").click();
	e.preventDefault();
	e.stopImmediatePropagation();
}).bind("mobileinit", function () {
	$.mobile.ajaxEnabled = false;
	expandPanel();
}).on("click", ".link", function() {
	var newPage = $(this).attr("class").split(" ")[1];
	$.mobile.changePage("#"+newPage, {
		transition: "slide"
	});
	expandPanel();
}).on("pageinit", "*", expandPanel);