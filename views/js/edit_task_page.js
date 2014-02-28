'use strict';



// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	$('.rightBtn').click(function(){
		//replace to edit page
		$("#blockName, #blockNumber").hide();
		//push some stuff onto the dropdown:
		$.get("/childList", function(res){
			console.log(res);
			for( i in res){
				$("#childSelector").append("<option value='"+res[i].email"'>"+res[i].name+"</option>");
			}
		});
		$(".boob").show();
		
		//replace edit button with done button
		$("#editBtn").replaceWith("<img src='images/doneTask_btn.png' id='doneBtn' />");
	});

	$(document).on("click", "#doneBtn", function(){
		//package information
		//send all the information.
		window.location.reload(true); 	
	});
})