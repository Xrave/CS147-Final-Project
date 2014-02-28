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
		var taskAssignedTo = $('input[type=radio]:checked').val()
		if (taskAssignedTo == ""){
			alert("Please select a child to assign the task to!");
			return;
		}
		var rewardPtNum = $('#rewardVal').val();
		var newdata = {		
			"assignee": taskAssignedTo,
			"taskText": taskNameobj,
			"taskReward": parseInt(rewardPtNum),
			"taskCompletion": 0
		};
		//make it into a JSON object. push it to data by calling a routes, then allow the default action to go through.
		$.post('/callback?action=addTask', newdata, handleNewTaskCreation);
	});
}
function handleNewTaskCreation(result){
	//res.render(result)
	$.notify("Task Created!", "success");
	window.location.href = '/';
}