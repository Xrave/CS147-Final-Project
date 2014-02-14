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
	$('#submitTaskBtn').click(function(e) {
		e.preventDefault();
		var taskNameobj = $('#newTaskName').val();
		var taskAssignedTo = $('#childName').val();
		var rewardPtNum = $('#rewardVal').val();
		var newdata = {			
			"assignedTo": taskAssignedTo,
			"task_description": taskNameobj,
			"task_reward_text": "+"+rewardPtNum+" pts",
			"iconURL": "images/Placeholder_profile_black.png"		
		};
		//make it into a JSON object. push it to data by calling a routes, then allow the default action to go through.
		$.post('/maketask', newdata, handleNewTaskCreation);
	});
}
function handleNewTaskCreation(result){
	//res.render(result)
	window.location.href = '/';
}
