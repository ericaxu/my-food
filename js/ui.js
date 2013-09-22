function onReize() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();

	// Menu panel adjustments
	$(".slide-menu, .ui-panel-inner").height(windowHeight);

	if (windowHeight < 350) {
		if (!$(".link").eq(0).hasClass("noBgImg")) {
			$(".link").addClass("noBgImg");
		}	
		$(".link.noBgImg span").css({
			"top": windowHeight / 4  * 0.35,
			"font-size": "1.1em",
			"font-weight": "bold"
		});
	} else {
		$(".link span").css({
			"top": windowHeight / 4 * 0.8,
			"font-size": "1em",
			"font-weight": "normal"
		});
		if ($(".link").eq(0).hasClass("noBgImg")) {
			$(".link").removeClass("noBgImg");
		}
	}

	$(".link").css("height", windowHeight / 4);
	$(".link").css("background-size", Math.min(96, windowHeight / 4 * 0.6) + "px " + Math.min(windowHeight / 4 * 0.65, 105) + "px");
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

function showPopup(content, manualDismiss) {
	$("#popup p").text(content);
	$("#popup").popup().popup("open", {
		transition: "pop",
		history: false
	});
	if (!manualDismiss) {
		setTimeout(function() {
			$("#popup").popup("close");
		}, 1500);
	}
}

function footerShow() {
	$.mobile.activePage.find("div[data-role='footer']").slideDown(200);
}

function footerHide() {
	$.mobile.activePage.find("div[data-role='footer']").slideUp(200);
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
	if ($.mobile.activePage.attr("id") === newPage) {
		$.mobile.activePage.find(".slide-menu").panel("close");
	}
	initPage();
}).on("pageinit", initPage);

$("#popup").on("click", function () {
	$(this).dialog("close");
})

$(window).resize(onReize);
