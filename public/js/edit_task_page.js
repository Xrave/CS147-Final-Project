'use strict';



// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	$('.rightBtn').click(function(){
		//replace to edit page
		$("#blockName, #blockNumber").hide();
		$(".boob").show();

		//replace edit button with done button
		$("#editBtn").replaceWith("<img src='images/doneTask_btn.png' id='doneBtn' />");
	});

	$(document).on("click", "#doneBtn", function(){
		//replace to original page
		$("#blockName, #blockNumber").show();
		$(".boob").hide();
		alert("updated!");
	});
})