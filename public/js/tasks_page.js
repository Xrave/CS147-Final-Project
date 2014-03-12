'use strict';

//global variables
var taskID = "";

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
        ga('send', 'event', 'add task', 'click');
        window.location="/addtask";

    });
    
    $("#newAddTaskBtn").click(function(e){
        ga('send', 'event', 'add task', 'click');
        ga('send', 'event', 'add task center', 'click');
        window.location="/addtask";
    });

    $.get("/confirmRequests", function(res) {
        console.log(res);
		for(var i = 0; i < res.length; i++){
			taskID = res[i].id;
			$(".popupText").html(res[i].assigneeName + "reported that he has completed the task <span style='font-weight:bold'>" + res[i].taskText + "</span>. Please confirm this report.");
			$(".popup").show();
		}
    });

    $(".popupConfirm").click(function() {
        $.post('/callback?action=confirmTask', taskID);
        $(".popup").hide();
    });
    $(".popupReject").click(function(){
        $.post('/callback?action=rejectTask', taskID);
        $(".popup").hide();
    });

}