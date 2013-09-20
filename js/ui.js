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