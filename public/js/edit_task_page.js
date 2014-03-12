'use strict';

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	$('#editBtn').click(function(){
		//replace to edit page
		$("#blockName").hide();
		$('#blockNumber').hide();
		$('#blockText').hide();
		//push some stuff onto the dropdown:
		$.get("/childList", function(res){
			console.log(res);
			for(var i in res){
				$("#childSelector").append("<option value='"+res[i].email+"'>"+res[i].name+"</option>");
			}
		});
		$(".boob").show();
		//replace edit button with done button
		$(".completedRightBtn").html("<!--img src='images/doneTask_btn.png' id='doneBtn' /--><button id='doneBtn' class='btn btn-success'>&#9998;Done</button>");
	});
    
    $('#reply_btn').click(function(){
        var comment = $('#commentarea').val();
        console.log(comment);
        if(comment.length<1){
            $('#commentarea').notify("Comment can't be empty.", {className: 'warn', elementPosition: "top center"});
            return;
        }
        var oldID = getParameterByName("id");
        if(oldID.length == 0){
            window.location = "/"; //weird things have happened. let's abort.
            return;
        }
        //proceed...
        $.post('/callback?action=comment', {"comment":comment, "taskID":oldID})
        .done(function(){
            $("#commentsSection").append("<p class='post'>"+comment+"</p>");
			$("#commentsSection").animate({scrollTop:$("#commentsSection")[0].scrollHeight}, 3000, 'swing');
        })
        .fail(function(){
            $("#commentarea").notify("Adding comment failed.", {className: 'error', elementPosition: "top center"});
            return;
        });
        
    })
    $("#commentsSection").animate({scrollTop:$("#commentsSection")[0].scrollHeight}, 3000, 'swing');
	
	$(document).on("click", "#doneBtn", function(e){
		//{oldTaskID: older_id, newTaskName: newName, newAssignee: username, newPtValue: number}
		//package information
		e.preventDefault();
        var oldID = getParameterByName("id");
        if(oldID.length == 0){
            window.location = "/"; //weird things have happened. let's abort.
            return;
        }
        var n_name = $('#newTaskname').val();
        var n_assignee = $('#childSelector').val();
		var n_assigneeName = $('#childSelector').text();
        var n_pts = parseInt($('#newRewardValue').val());
        
        if(n_name.length == 0){
            $('#newTaskname').notify("Please enter a task", {className: 'warn', elementPosition: "bottom center"});
            return;
        }
        if (n_assignee == undefined){
            $('#childSelector').notify("Please select a child to assign the task to!", {className: 'warn', elementPosition: "bottom right"});
            return;
        }
        if( n_pts<0){
            $('#newRewardValue').notify("Can't assign a negative reward", {className: 'warn', elementPosition: "bottom right"});
            return;
        }
        if( isNaN(n_pts) | n_pts == undefined){
            $('#newRewardValue').notify("Please enter a numerical reward value.", "warning");
            return;
        }
        
		var newData = 
			{oldTaskID: oldID,
			 newTaskName: n_name,  
			 newAssignee: n_assignee, 
			 newAssigneeName: n_assigneeName,
			 newPtValue: n_pts,
			};
		console.log(newData);
		$.post('/callback?action=editTask', newData, function(result){
			window.location.reload(true); 
		});
		//send all the information.
	});
})