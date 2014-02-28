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
		var newData = 
			{oldTaskID: getParameterByName("id"),
			 newTaskName: $('#newTaskname').val(),  
			 newAssignee: $('#childSelector').val(), 
			 newPtValue: $('#newRewardValue').val(),
			};
		console.log(newData);
		$.post('/callback?action=editTask', newData, function(result){
			window.location.reload(true); 
		});
		//send all the information.
	});
})