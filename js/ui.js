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

detectDragAndDrop();

$(document).on("submit", "form", function(e) {
	var currentPage = $.mobile.activePage.attr('id')
	$("#" + currentPage).find(".submit").click();
	e.preventDefault();
	e.stopImmediatePropagation();
});