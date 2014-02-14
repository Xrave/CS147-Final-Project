'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {
	console.log("Javascript connected!");
	$('.nameobj').click(function(e) {
		e.preventDefault();
		var namestr = $(this).text();
		var nameAnaStr = anagrammedName(namestr);
		console.log(nameAnaStr);
		$(this).text(nameAnaStr);
	});
}

