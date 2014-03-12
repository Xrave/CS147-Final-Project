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
		taskID = res;
		var greetings = ["Howdy!", "A while ago,", "Some time ago,", "Y'know,", "Oh my!"];
		var r_greeting = greetings[Math.floor(Math.random() * greetings.length)];
		$(".popupText").html(r_greeting+" <span style='font-weight:bold'>"+res.assigneeName + "</span> completed the task <span style='font-weight:bold'>" + res.taskText + "</span>.");
		$(".popup").fadeIn(200);
		$("#popupwrapper").fadeIn(200);
    });

    $(".popupConfirm").click(function() {
        $.post('/callback?action=taskConfirm', {"taskData":taskID});
        $(".popup").fadeOut(100);
		$("#popupwrapper").fadeOut(100);

    });
    $(".popupReject").click(function(){
        $.post('/callback?action=taskReject', {'taskData':taskID});
        $(".popup").fadeOut(100);
		$("#popupwrapper").fadeOut(100);

    });

}