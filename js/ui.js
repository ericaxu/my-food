function onReize() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	var bucketWidth = $("#left-bucket").width();
	var bucketHeight = $("#left-bucket").height();

	$(".link").css("height", windowHeight / 4);
	$(".link").css("background-size", Math.min(110, windowHeight / 4 * 0.6) + "px " + Math.min(windowHeight / 4 * 0.65, 120) + "px");
	$(".link span").css("top", windowHeight / 4 * 0.85);
	$(".slide-menu, .ui-panel-inner").height(windowHeight);
}

function initPage() {
	onReize();
	updateForms();
}

function updateForms() {
	setTimeout(function(){
		if($.mobile.activePage){
			$.mobile.activePage.trigger("create");
		}
	}, 0);
}

function showPopup(content, autoDismiss) {
	$("#popup p").text(content);
	$("#popup").popup().popup("open", {
		transition: "pop",
		history: false
	});
	if (autoDismiss) {
		setTimeout(function() {
			$("#popup").popup("close");
		}, 1500);
	}
}

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

$("#popup").on("click", function () {
	$(this).dialog("close");
})

$(window).resize(onReize);
