function onReize() {
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	// Menu panel adjustments
	$(".slide-menu, .ui-panel-inner").height(windowHeight);

	console.log("resize");//t
	console.log($(".link").css("background-size"));//t
	if (windowHeight < 350) {
		// Remove background image
		if (!$(".link").eq(0).hasClass("noBgImg")) {
			$(".link").addClass("noBgImg");
		}

		var margin = parseInt($(".link").css("margin"));
		$(".link").css("height", (windowHeight / 4 - margin * 3.75));
		var linkHeight = parseInt($(".link").css("height"));

		var top = 0;
		if (windowHeight > 250) {
			top = linkHeight * 0.2;
		} else if (windowHeight < 185) {
			top = "-10px";
		}
		$(".link.noBgImg span").css({
			"top": top
		}).show();
		$(".link").css("margin", "10px");
	} else {
		var margin = parseInt($(".link").css("margin"));
		$(".link").css("height", (windowHeight / 4 - margin * 2.5));
		var linkHeight = parseInt($(".link").css("height"));

		$(".link").css("margin", "20px");
		if (windowHeight < 520) {
			$(".link span").hide();
			$(".link").css("background-size", Math.min(105, linkHeight * 0.8) + "px " + Math.min(105, linkHeight * 0.8) + "px");
		} else {
			$(".link span").css({
				"top": linkHeight * 0.85
			}).show();          
			$(".link").css("background-size", Math.min(88, linkHeight * 0.7) + "px " + Math.min(88, linkHeight * 0.7) + "px");
		}

		if ($(".link").eq(0).hasClass("noBgImg")) {
			$(".link").removeClass("noBgImg");
		}
	}
}

function bindAutocomplete() {
	$(".autocomplete").autocomplete({
		source: commonFoodList,
		messages: {
			noResults: '',
			results: function() {}
		},
		select: function (evt, ui) {
			var element = $(this).val(ui.item.value).trigger("input");
			angular.element($("body")).scope().$apply();
			var currentPage = $.mobile.activePage.attr("id");
			$("#" + currentPage).find(".submit").click();
			evt.preventDefault();
		}
	});
}

function initPage() {
	if (!$.mobile.activePage && (window.location.hash === "" || window.location.hash === "loading") || 
		($.mobile.activePage && $.mobile.activePage.attr("id") === "loading")) {
		setTimeout(function(){
			changePage("#fridge");
		}, 0);
	}
	onReize();
	bindAutocomplete();
	updateForms();
}

function deactivateBottons() {
	$.mobile.activePage.find('.ui-btn-active').removeClass('ui-btn-active ui-focus');
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
	deactivateBottons();
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
});

$(window).resize(onReize);
