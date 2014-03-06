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
	$('.task-item').click(function(e) {
		e.preventDefault();
		var taskID = $(this).attr('id');
		window.location="/task?id="+taskID;
	});
    
    $("#addTaskBtn").click(function(e){
        e.preventDefault();
        ga('send', 'event', 'add task', 'click');
        window.location="/addtask";

    });
    
    $("#newAddTaskBtn").click(function(e){
        e.preventDefault();
        ga('send', 'event', 'add task', 'click');
        ga('send', 'event', 'add task center', 'click');
        window.location="/addtask";
    });

}

