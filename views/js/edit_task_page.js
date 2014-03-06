'use strict';



// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	$('.rightBtn').click(function(){
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
		$("#editBtn").replaceWith("<img src='images/doneTask_btn.png' id='doneBtn' />");
	});

	$(document).on("click", "#doneBtn", function(){
		function getParameterByName(name) {
			name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
			var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
			return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
		}
		//{oldTaskID: older_id, newTaskName: newName, newAssignee: username, newPtValue: number}
		//package information
        var oldID = getParameterByName("id");
        if(oldID.length == 0){
            window.location = "/"; //weird things have happened. let's abort.
            return;
        }
        var n_name = $('#newTaskname').val();
        var n_assignee = $('#childSelector').val();
        var n_pts = parseInt($('#newRewardValue').val());
        
        if(n_name.length == 0){
            $('#newTaskName').notify("Please enter a task", "warning");
            return;
        }
        if (n_assignee == undefined){
            $('#childSelector').notify("Please select a child to assign the task to!", "warning");
            return;
        }
        if( n_pts<0){
            $('#newRewardValue').notify("Can't assign a negative reward", "warning");
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
			 newPtValue: n_pts,
			};
		console.log(newData);
		$.post('/callback?action=editTask', newData, function(result){
			window.location.reload(true); 
		});
		//send all the information.
	});
})